import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1: About */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Sai Chandhan Reddy</h3>
            <p className="text-gray-400 text-sm">
              A passionate web developer creating engaging and functional digital experiences.
              Let's build something amazing together.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Connect */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Connect With Me</h3>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              <a
                href="https://github.com/SAI-CHANDHAN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-2xl"
                aria-label="GitHub Profile"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href="https://linkedin.com/in/saichandhanannapureddy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-2xl"
                aria-label="LinkedIn Profile"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href="https://www.instagram.com/sai_chandhan?igsh=MWw0anU1Y3RuOGh2dA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-2xl"
                aria-label="Instagram Profile"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="mailto:chandhansai17@gmail.com"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-2xl"
                aria-label="Email"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              <a
                href="mailto:youremail@example.com" // Replace with your email
                className="hover:text-blue-400 transition-colors duration-300"
              >
                chandhansai17@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Saichandhan. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;