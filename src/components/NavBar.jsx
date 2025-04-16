import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links">Contact</Link>
          </li>
          <li className="nav-item">
            <a href="https://github.com/ridhamxdev" target="_blank" rel="noopener noreferrer" className="nav-links">GitHub</a>
          </li>
          <li className="nav-item">
            <a href="https://www.linkedin.com/in/ridham-goyal-025b422a0/" target="_blank" rel="noopener noreferrer" className="nav-links">LinkedIn</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;