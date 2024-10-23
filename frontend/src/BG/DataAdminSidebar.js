import React from 'react';
import { Link } from 'react-router-dom';
import gmzlogo from '../icons/gmzlogo.png'
import '../css/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faTruck, faBox, faChartLine, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2><img src={gmzlogo} width="85" height="75" alt="Logo" /></h2>
      <ul>
        <li><Link to="/data-admin/dashboard"><FontAwesomeIcon icon={faHouse} /> Dashboard</Link></li>
        <li><Link to="/data-admin/dashboard"><FontAwesomeIcon icon={faClipboardList} /> Orders</Link></li>
        <li><Link to="/data-admin/dashboard"><FontAwesomeIcon icon={faTruck} /> Delivery</Link></li>
        <li><Link to="/data-admin/dashboard"><FontAwesomeIcon icon={faChartLine} /> Sales</Link></li>
        <li><Link to="/data-admin/dashboard"><FontAwesomeIcon icon={faBox} /> Inventory</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
