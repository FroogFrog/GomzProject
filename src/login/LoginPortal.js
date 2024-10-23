import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../css/loginportal.css'; // Import your existing CSS file
import logo from '../icons/gmz.png'; // Import your logo image

const LoginPortal = () => {
  return (
    <div className="background">
      <div className="box-login">
        <img className="logo" src={logo} alt="Logo" />
        <h2>LOGIN PORTAL</h2>
        <div className="login-container">
          <Link to="/system-admin" className="button">Login as System Admin</Link>
          <Link to="/data-admin" className="button">Login as Data Admin</Link>
          <Link to="/sales-admin" className="button">Login as Sales Admin</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPortal;
