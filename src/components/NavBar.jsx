import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Portfolio</Link>
      </div>
      <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
          <li><a href="https://github.com/ridhamxdev" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/ridham-goyal-025b422a0/" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>LinkedIn</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;