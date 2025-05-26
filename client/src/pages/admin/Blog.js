import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminPages.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, post: null });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setPosts(posts.filter(p => p._id !== postId));
        setDeleteModal({ show: false, post: null });
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const togglePublished = async (postId, currentStatus) => {
    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ published: !currentStatus })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(p => 
          p._id === postId ? updatedPost.post : p
        ));
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'published') return matchesSearch && post.published;
    if (filter === 'draft') return matchesSearch && !post.published;
    return matchesSearch;
  });

  const PostCard = ({ post }) => (
    <div className="blog-card">
      <div className="blog-image">
        <img 
          src={post.featuredImage || '/api/placeholder/300/200'} 
          alt={post.title}
        />
        <div className="blog-status">
          {post.published ? (
            <span className="status-badge published">Published</span>
          ) : (
            <span className="status-badge draft">Draft</span>
          )}
        </div>
      </div>
      
      <div className="blog-content">
        <div className="blog-meta">
          <span className="blog-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="blog-read-time">{post.readTime || '5'} min read</span>
        </div>
        
        <h3 className="blog-title">{post.title}</h3>
        <p className="blog-excerpt">
          {post.excerpt.length > 120 
            ? `${post.excerpt.substring(0, 120)}...` 
            : post.excerpt
          }
        </p>
        
        <div className="blog-tags">
          {post.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
          {post.tags?.length > 3 && (
            <span className="tag more">+{post.tags.length - 3}</span>
          )}
        </div>
        
        <div className="blog-stats">
          <span className="stat">
            👁️ {post.views || 0} views
          </span>
          <span className="stat">
            💬 {post.comments?.length || 0} comments
          </span>
        </div>
      </div>
      
      <div className="blog-actions">
        <Link to={`/admin/blog/${post._id}`} className="btn btn-sm btn-primary">
          Edit
        </Link>
        <button 
          onClick={() => togglePublished(post._id, post.published)}
          className={`btn btn-sm ${post.published ? 'btn-warning' : 'btn-success'}`}
        >
          {post.published ? 'Unpublish' : 'Publish'}
        </button>
        {post.published && (
          <Link 
            to={`/blog/${post.slug}`} 
            target="_blank"
            className="btn btn-sm btn-secondary"
          >
            View
          </Link>
        )}
        <button 
          onClick={() => setDeleteModal({ show: true, post })}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-blog-page">
      <div className="admin-blog-header">
        <h2>Blog Posts</h2>
        <Link to="/admin/blog/new" className="btn btn-primary">
          + New Post
        </Link>
      </div>

      <div className="admin-blog-filters">
        <input 
          type="text" 
          placeholder="Search posts..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="blog-grid">
          {filteredPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal">
          <div className="modal-content">
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete "{deleteModal.post.title}"?</p>
            <div className="modal-actions">
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(deleteModal.post._id)}
              >
                Delete
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setDeleteModal({ show: false, post: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
