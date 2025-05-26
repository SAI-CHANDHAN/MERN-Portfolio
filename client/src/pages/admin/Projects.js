// src/pages/admin/Projects.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminPages.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, project: null });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setProjects(projects.filter(p => p._id !== projectId));
        setDeleteModal({ show: false, project: null });
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const toggleFeatured = async (projectId, currentStatus) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ featured: !currentStatus })
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(projects.map(p => 
          p._id === projectId ? updatedProject.project : p
        ));
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'featured') return matchesSearch && project.featured;
    if (filter === 'draft') return matchesSearch && project.status === 'draft';
    return matchesSearch;
  });

  const ProjectCard = ({ project }) => (
    <div className="project-card">
      <div className="project-image">
        <img 
          src={project.images?.[0] || '/api/placeholder/300/200'} 
          alt={project.title}
        />
        {project.featured && <div className="featured-badge">Featured</div>}
        {project.status === 'draft' && <div className="draft-badge">Draft</div>}
      </div>
      
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">
          {project.description.length > 100 
            ? `${project.description.substring(0, 100)}...` 
            : project.description
          }
        </p>
        
        <div className="project-tech">
          {project.technologies?.slice(0, 3).map((tech, i) => (
            <span key={i} className="tech-tag">{tech}</span>
          ))}
          {project.technologies?.length > 3 && (
            <span className="tech-tag more">+{project.technologies.length - 3}</span>
          )}
        </div>
        
        <div className="project-meta">
          <span className="project-date">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <div className="project-links">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" title="View Live">
                🔗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="View Code">
                📁
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="project-actions">
        <Link to={`/admin/projects/${project._id}`} className="btn btn-sm btn-primary">
          Edit
        </Link>
        <button 
          onClick={() => toggleFeatured(project._id, project.featured)}
          className={`btn btn-sm ${project.featured ? 'btn-warning' : 'btn-secondary'}`}
        >
          {project.featured ? 'Unfeature' : 'Feature'}
        </button>
        <button 
          onClick={() => setDeleteModal({ show: true, project })}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Projects</h1>
          <p>Manage your portfolio projects</p>
        </div>
        <Link to="/admin/projects/new" className="btn btn-primary">
          Add New Project
        </Link>
      </div>

      <div className="page-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          <button 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            All ({projects.length})
          </button>
          <button 
            onClick={() => setFilter('featured')}
            className={filter === 'featured' ? 'active' : ''}
          >
            Featured ({projects.filter(p => p.featured).length})
          </button>
          <button 
            onClick={() => setFilter('draft')}
            className={filter === 'draft' ? 'active' : ''}
          >
            Drafts ({projects.filter(p => p.status === 'draft').length})
          </button>
        </div>
      </div>

      <div className="content-area">
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="project-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-actions"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No Projects Found</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'No projects match your search criteria.' 
                : 'Start building your portfolio by adding your first project.'
              }
            </p>
            <Link to="/admin/projects/new" className="btn btn-primary">
              Add Your First Project
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Project</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete "{deleteModal.project?.title}"?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteModal({ show: false, project: null })}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteModal.project._id)}
                className="btn btn-danger"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;