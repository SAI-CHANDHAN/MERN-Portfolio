import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/projects', name: 'Projects' },
    { path: '/blog', name: 'Blog' },
    { path: '/contact', name: 'Contact' },
    { path: '/skills', name: 'Skills' },
  ];

  return (
    <nav className="navbar bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold logo">
          Sai Chandhan Reddy Annapureddy
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'text-blue-400' : 'hover:text-blue-300'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'text-blue-400' : 'hover:text-blue-300'}`
              }
            >
              Admin
            </NavLink>
          )}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 mobile-menu">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700'
                }`
              }
              onClick={toggleMenu} // Close menu on click
            >
              {link.name}
            </NavLink>
          ))}
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700'
                }`
              }
              onClick={toggleMenu}
            >
              Admin
            </NavLink>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                toggleMenu(); // Close menu after logout
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 transition duration-300"
              onClick={toggleMenu} // Close menu on click
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;