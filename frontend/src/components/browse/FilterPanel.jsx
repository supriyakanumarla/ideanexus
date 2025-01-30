import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const FilterPanel = ({ filters, setFilters, searchType }) => {
  const categories = [
    'Technology', 'Science', 'Business', 'Art', 
    'Education', 'Healthcare', 'Environment', 'Other'
  ];

  const skills = [
    'Programming', 'Design', 'Marketing', 'Writing',
    'Research', 'Management', 'Data Analysis', 'Other'
  ];

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!filters.tags.includes(newTag)) {
        setFilters(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="filters-panel">
      <div className="filter-section">
        <h3>Sort By</h3>
        <select 
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            sortBy: e.target.value
          }))}
        >
          <option value="relevance">Relevance</option>
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {searchType === 'projects' && (
        <>
          <div className="filter-section">
            <h3>Category</h3>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                category: e.target.value
              }))}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>Collaboration Status</h3>
            <select
              value={filters.collaborationStatus}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                collaborationStatus: e.target.value
              }))}
            >
              <option value="all">All</option>
              <option value="open">Open for Collaboration</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </>
      )}

      {searchType === 'users' && (
        <>
          <div className="filter-section">
            <h3>Skills</h3>
            <div className="skills-select">
              {skills.map(skill => (
                <label key={skill} className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.skills.includes(skill)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          skills: [...prev.skills, skill]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          skills: prev.skills.filter(s => s !== skill)
                        }));
                      }
                    }}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Experience Level</h3>
            <select
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                experience: e.target.value
              }))}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </>
      )}

      <div className="filter-section">
        <h3>Tags</h3>
        <div className="tags-input">
          {filters.tags.map(tag => (
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
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 