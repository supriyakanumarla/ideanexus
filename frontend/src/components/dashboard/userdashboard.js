import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSearch, 
  faEnvelope, 
  faPlus, 
  faLightbulb,
  faUsers 
} from '@fortawesome/free-solid-svg-icons';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/dashboard/UserDashboard.css';
import { toast } from 'react-hot-toast';

const UserDashboardPage = () => {
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    username: ''
  });
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showNewProject, setShowNewProject] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch profile data and unread messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        // Fetch profile data
        const profileResponse = await axios.get('http://localhost:5002/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileResponse.data && profileResponse.data.success) {
          setProfileData({
            profilePicture: profileResponse.data.user.profilePicture,
            username: profileResponse.data.user.username
          });
        }

        // Fetch unread messages count
        const messagesResponse = await axios.get('http://localhost:5002/api/messages/unread', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (messagesResponse.data) {
          setUnreadMessages(messagesResponse.data.count);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add form validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add project creation handler
  const handleCreateProject = async (e) => {
    console.log("Create project button clicked");
    if (e) {
      e.preventDefault();
    }
    
    setIsLoading(true);
    try {
      console.log("Form Data:", formData);
      
      if (!validateForm()) {
        console.log("Form validation failed", formErrors);
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('privacy', formData.privacy || 'public');
      
      if (formData.tags?.length > 0) {
        formDataToSend.append('tags', JSON.stringify(formData.tags));
      }

      if (formData.attachments?.length > 0) {
        formData.attachments.forEach(file => {
          formDataToSend.append('attachments', file);
        });
      }

      console.log("Sending request to server");
      const response = await axios.post(
        'http://localhost:5002/api/projects/create',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log("Server response:", response.data);

      if (response.data.success) {
        toast.success('Project created successfully!');
        setShowNewProject(false);
        setFormData({});
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-dashboard-page">
      <header className="header">
        {/* Profile Icon/Image */}
        <Link to="/user-profile" className="profile-icon">
          {profileData.profilePicture ? (
            <img 
              src={profileData.profilePicture} 
              alt="Profile" 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<FontAwesomeIcon icon={faUser} className="icon" />';
              }}
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="icon" />
          )}
        </Link>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>

        {/* Message Icon */}
        <Link to="/messages" className="message-icon">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          {unreadMessages > 0 && (
            <span className="message-badge">{unreadMessages}</span>
          )}
        </Link>
      </header>

      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions">
          <div 
            className="action-card create-project"
            onClick={() => setShowNewProject(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="action-icon" />
            <span>Create New Project</span>
          </div>
          <Link to="/browse-projects" className="action-card browse-projects">
            <FontAwesomeIcon icon={faLightbulb} className="action-icon" />
            <span>Browse Projects</span>
          </Link>
          <Link to="/find-collaborators" className="action-card find-collaborators">
            <FontAwesomeIcon icon={faUsers} className="action-icon" />
            <span>Find Collaborators</span>
          </Link>
        </div>

        {/* Project Creation Modal */}
        {showNewProject && (
          <div className="modal">
            <div className="modal-content">
              <h2>Create New Project</h2>
              <form onSubmit={handleCreateProject}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={formErrors.title ? 'error' : ''}
                    placeholder="Enter project title"
                  />
                  {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={formErrors.description ? 'error' : ''}
                    placeholder="Enter project description"
                  />
                  {formErrors.description && <span className="error-message">{formErrors.description}</span>}
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={formErrors.category ? 'error' : ''}
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                    <option value="Art">Art</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                  </select>
                  {formErrors.category && <span className="error-message">{formErrors.category}</span>}
                </div>

                <div className="form-group">
                  <label>Privacy</label>
                  <select
                    value={formData.privacy || 'public'}
                    onChange={(e) => setFormData({...formData, privacy: e.target.value})}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Attachments</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFormData({...formData, attachments: Array.from(e.target.files)})}
                  />
                </div>

                <div className="button-group">
                  <button 
                    type="submit" 
                    className={`submit-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Project'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => setShowNewProject(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        <div className="welcome-section">
          <h2>Welcome, {profileData.username}!</h2>
          <p>Start collaborating on exciting projects or create your own.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
