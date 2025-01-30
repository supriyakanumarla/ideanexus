import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faThLarge, 
  faList,
  faBookmark,
  faUserPlus,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import '/home/rguktongole/Desktop/ideanexus/frontend/src/components/browse/BrowsePage.css';
import FilterPanel from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/browse/FilterPanel.jsx';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Assuming you have an auth context
import { toast } from 'react-hot-toast';

const BrowsePage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchType, setSearchType] = useState('projects');
  const [filters, setFilters] = useState({
    category: '',
    tags: [],
    collaborationStatus: 'all',
    skills: [],
    experience: 'all',
    sortBy: 'relevance'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useAuth();

  // Fetch initial data and recommendations
  useEffect(() => {
    fetchResults();
    fetchRecommendations();
  }, [searchType]);

  // Fetch results when filters or search query change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, searchType]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search`, {
        params: {
          type: searchType,
          query: searchQuery,
          ...filters
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setResults(response.data.results);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/recommendations/${searchType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error('Recommendations error:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
  };

  const toggleSaved = async (itemId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookmarks`,
        { itemId, itemType: searchType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update the UI to reflect the new saved state
      setResults(prevResults =>
        prevResults.map(item =>
          item.id === itemId
            ? { ...item, isSaved: !item.isSaved }
            : item
        )
      );

      // Show success message
      toast.success(response.data.message);
    } catch (err) {
      toast.error('Failed to save item. Please try again.');
      console.error('Bookmark error:', err);
    }
  };

  const toggleFollow = async (userId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update the UI to reflect the new following state
      setResults(prevResults =>
        prevResults.map(user =>
          user.id === userId
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        )
      );

      // Show success message
      toast.success(response.data.message);
    } catch (err) {
      toast.error('Failed to follow user. Please try again.');
      console.error('Follow error:', err);
    }
  };

  const renderProjectCard = (project) => (
    <div className={`card ${viewMode}-card`} key={project.id}>
      <div className="card-header">
        <img src={project.image} alt={project.title} />
        <button 
          className={`bookmark-btn ${project.isSaved ? 'saved' : ''}`}
          onClick={() => toggleSaved(project.id)}
        >
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      </div>
      <div className="card-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="collaboration-status">
          <span className={`status ${project.status}`}>
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );

  const renderUserCard = (user) => (
    <div className={`card ${viewMode}-card`} key={user.id}>
      <div className="card-header">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
        <button 
          className={`follow-btn ${user.isFollowing ? 'following' : ''}`}
          onClick={() => toggleFollow(user.id)}
        >
          <FontAwesomeIcon icon={faUserPlus} />
          {user.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
      <div className="card-content">
        <h3>{user.name}</h3>
        <p>{user.bio}</p>
        <div className="skills">
          {user.skills.map(skill => (
            <span key={skill} className="skill">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="browse-page">
      <div className="search-header">
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <div className="search-input">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <div className="search-options">
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filters
            </button>
            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <FontAwesomeIcon icon={faThLarge} />
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showFilters && (
        <FilterPanel 
          filters={filters}
          setFilters={setFilters}
          searchType={searchType}
        />
      )}

      {recommendations.length > 0 && !searchQuery && (
        <div className="recommendations-section">
          <h2>Recommended for You</h2>
          <div className={`recommendations-container ${viewMode}-view`}>
            {recommendations.map(item =>
              searchType === 'projects'
                ? renderProjectCard(item)
                : renderUserCard(item)
            )}
          </div>
        </div>
      )}

      <div className={`results-container ${viewMode}-view`}>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : results.length > 0 ? (
          results.map(item =>
            searchType === 'projects'
              ? renderProjectCard(item)
              : renderUserCard(item)
          )
        ) : (
          <div className="no-results">
            No {searchType} found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage; 