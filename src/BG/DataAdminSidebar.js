import React from 'react';
import { Link } from 'react-router-dom';
import gmzlogo from '../icons/gmzlogo.png'
import '../css/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faTruck, faBox, faUserTie, faBoxesStacked, faIndustry } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2><img src={gmzlogo} width="85" height="75" alt="Logo" /></h2>
      <ul>
        <li><Link to="/data-admin/dashboard"><FontAwesomeIcon icon={faHouse} /> Dashboard</Link></li>
        <li><Link to="/data-admin/inventory"><FontAwesomeIcon icon={faBox} /> Inventory</Link></li>
        <li><Link to="/data-admin/rawmaterial"><FontAwesomeIcon icon={faBoxesStacked} /> Raw Material</Link></li>
        <li><Link to="/data-admin/supplier"><FontAwesomeIcon icon={faUserTie} /> Supplier</Link></li>
        <li><Link to="/data-admin/supply-delivery"><FontAwesomeIcon icon={faTruck} /> Supply Delivery</Link></li>
        <li><Link to="/data-admin/production"><FontAwesomeIcon icon={faIndustry} /> Production</Link></li>
        <li><Link to="/data-admin/productionmateriallogs"><FontAwesomeIcon icon={faIndustry} /> Production Materials Logs</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
