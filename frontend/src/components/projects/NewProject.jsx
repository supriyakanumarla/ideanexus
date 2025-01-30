import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, 
  faLink, 
  faLock, 
  faGlobe,
  faTimes,
  faChevronRight,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/projects/NewProject.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const NewProject = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    privacy: 'public',
    attachments: [],
    collaborators: []
  });
  const [preview, setPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const categories = [
    'Technology', 'Science', 'Business', 'Art', 
    'Education', 'Healthcare', 'Environment', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("Create project button clicked");
    if (e) {
      e.preventDefault();
    }
    
    setIsLoading(true);
    try {
      console.log("Form Data:", formData); // Log form data
      
      // Validate form
      if (!validateForm()) {
        console.log("Form validation failed", formErrors);
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      // Basic project data
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('privacy', formData.privacy || 'public');
      
      // Handle tags
      if (formData.tags?.length > 0) {
        formDataToSend.append('tags', JSON.stringify(formData.tags));
      }

      // Handle attachments
      if (formData.attachments?.length > 0) {
        formData.attachments.forEach(file => {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('File size exceeds 5MB limit');
          }
          formDataToSend.append('attachments', file);
        });
      }

      // Handle collaborators
      if (formData.collaborators?.length > 0) {
        formDataToSend.append('collaborators', JSON.stringify(formData.collaborators));
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
        onClose();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="step-content">
            <h3>Basic Information</h3>
            <div className="form-group">
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={formData.title}
                onChange={handleInputChange}
                className={formErrors.title ? 'error' : ''}
              />
              {formErrors.title && <span className="error-message">{formErrors.title}</span>}
            </div>
            <div className="form-group">
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
              />
            </div>
            <div className="form-group">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Tags & Visibility</h3>
            <div className="form-group">
              <div className="tags-input">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  onKeyPress={handleTagInput}
                  className="tag-input"
                />
              </div>
            </div>
            <div className="form-group">
              <div className="privacy-options">
                <button
                  className={`privacy-btn ${formData.privacy === 'public' ? 'active' : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'privacy', value: 'public' }})}
                >
                  <FontAwesomeIcon icon={faGlobe} />
                  Public
                </button>
                <button
                  className={`privacy-btn ${formData.privacy === 'private' ? 'active' : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'privacy', value: 'private' }})}
                >
                  <FontAwesomeIcon icon={faLock} />
                  Private
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Attachments & Preview</h3>
            <div className="form-group">
              <div className="file-upload">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  id="file-input"
                  className="hidden"
                />
                <label htmlFor="file-input" className="upload-btn">
                  <FontAwesomeIcon icon={faImage} />
                  Upload Files
                </label>
              </div>
              {formData.attachments.length > 0 && (
                <div className="attachments-list">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      <span>{file.name}</span>
                      <button onClick={() => removeAttachment(index)}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step/3) * 100}%` }} />
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="modal-footer">
            {step > 1 && (
              <button className="btn secondary" onClick={prevStep}>
                <FontAwesomeIcon icon={faChevronLeft} /> Back
              </button>
            )}
            {step < 3 ? (
              <button 
                type="submit" 
                disabled={isLoading}
                className={`btn primary ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? 'Creating...' : 'Next <FontAwesomeIcon icon={faChevronRight} />'}
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isLoading}
                className={`btn primary ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            )}
          </div>
        </form>
      </div>
      {preview && (
        <div className="preview-panel">
          {/* Project preview content */}
        </div>
      )}
    </div>
  );
};

export default NewProject; 