// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    contacts: 0,
    skills: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/analytics/stats'),
        fetch('/api/analytics/recent-activity')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData.activities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Showcase your latest work',
      link: '/admin/projects/new',
      icon: '📁',
      color: 'blue'
    },
    {
      title: 'Write Blog Post',
      description: 'Share your thoughts and insights',
      link: '/admin/blog/new',
      icon: '✍️',
      color: 'green'
    },
    {
      title: 'Manage Skills',
      description: 'Update your technical skills',
      link: '/admin/skills',
      icon: '🛠️',
      color: 'purple'
    },
    {
      title: 'View Messages',
      description: 'Check contact form submissions',
      link: '/admin/contact',
      icon: '💬',
      color: 'orange'
    }
  ];

  const StatCard = ({ title, value, icon, link }) => (
    <Link to={link} className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3 className="stat-value">{loading ? '...' : value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </Link>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Projects"
          value={stats.projects}
          icon="📁"
          link="/admin/projects"
        />
        <StatCard
          title="Blog Posts"
          value={stats.blogs}
          icon="📝"
          link="/admin/blog"
        />
        <StatCard
          title="Skills Listed"
          value={stats.skills}
          icon="⚡"
          link="/admin/skills"
        />
        <StatCard
          title="Messages"
          value={stats.contacts}
          icon="💬"
          link="/admin/contact"
        />
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              to={action.link}
              className={`quick-action-card ${action.color}`}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {loading ? (
            <div className="activity-skeleton">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="activity-item-skeleton">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'project' && '📁'}
                  {activity.type === 'blog' && '📝'}
                  {activity.type === 'contact' && '💬'}
                  {activity.type === 'skill' && '⚡'}
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.message}</p>
                  <span className="activity-time">{activity.timeAgo}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">
              <p>No recent activity to display.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-section">
        <h2>Portfolio Overview</h2>
        <div className="overview-cards">
          <div className="overview-card">
            <h3>Portfolio Health</h3>
            <div className="health-indicators">
              <div className="indicator">
                <span className="indicator-label">Projects</span>
                <div className="indicator-bar">
                  <div 
                    className="indicator-fill green" 
                    style={{ width: stats.projects > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
              <div className="indicator">
                <span className="indicator-label">Blog Posts</span>
                <div className="indicator-bar">
                  <div 
                    className="indicator-fill blue" 
                    style={{ width: stats.blogs > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
              <div className="indicator">
                <span className="indicator-label">Skills</span>
                <div className="indicator-bar">
                  <div 
                    className="indicator-fill purple" 
                    style={{ width: stats.skills > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overview-card">
            <h3>Next Steps</h3>
            <ul className="next-steps">
              {stats.projects === 0 && <li>Add your first project</li>}
              {stats.blogs === 0 && <li>Write your first blog post</li>}
              {stats.skills === 0 && <li>List your technical skills</li>}
              {stats.contacts > 0 && <li>Respond to recent messages</li>}
              {stats.projects > 0 && stats.blogs > 0 && stats.skills > 0 && (
                <li>Your portfolio looks great! 🎉</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;