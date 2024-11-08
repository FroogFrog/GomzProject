import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const navigate = useNavigate();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Handles logout
  async function handleLogout() {
    try {
      await axios.post('/api/auth/logout');
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  // Handles clicking outside dropdowns to close them
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      Welcome back, <span className="username">Username!</span>
      <span className="navbar-icons">
        <div className="dropdown" ref={notificationDropdownRef}>
          <button type="button" className="icon-button" onClick={() => setNotificationOpen(!isNotificationOpen)}>
            <FontAwesomeIcon icon={faBell} />
            <span className="icon-button-badge">1</span>
          </button>
          {isNotificationOpen && (
            <div className="dropdown-content">
              <ul>
                <li><a href="#">Notification 1</a></li>
              </ul>
            </div>
          )}
        </div>
        <div className="dropdown" ref={userDropdownRef}>
          <button
            type="button"
            className="icon-button"
            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          {isUserDropdownOpen && (
            <div className="dropdown-content">
              <ul>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          )}
        </div>
      </span>
    </div>
  );
}

export default Header;
