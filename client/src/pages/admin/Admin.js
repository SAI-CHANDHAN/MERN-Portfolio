import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav className="space-x-4">
          <Link to="/admin" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/admin/projects" className="hover:underline">
            Projects
          </Link>
          <Link to="/admin/blog" className="hover:underline">
            Blogs
          </Link>
          <Link to="/admin/contacts" className="hover:underline">
            Contacts
          </Link>
          <Link to="/admin/skills" className="hover:underline">
            Skills
          </Link>
          <button
            onClick={handleLogout}
            className="ml-6 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="flex-grow p-6 bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
