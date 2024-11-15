import React from 'react';
import { Link } from 'react-router-dom';
import gmzlogo from '../icons/gmzlogo.png'
import '../css/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFile, faBox, faBoxesStacked, faAddressBook, faUsersLine} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2><img src={gmzlogo} width="85" height="75" alt="Logo" /></h2>
      <ul>
        <li><Link to="/system-admin/dashboard"><FontAwesomeIcon icon={faHouse} /> Dashboard</Link></li>
        <li><Link to="/system-admin/document"><FontAwesomeIcon icon={faFile} /> Document</Link></li>
        <li><Link to="/system-admin/inventory"><FontAwesomeIcon icon={faBox} /> Products</Link></li>
        <li><Link to="/system-admin/raw-material"><FontAwesomeIcon icon={faBoxesStacked} /> Raw Materials</Link></li>
        <li><Link to="/system-admin/supplier"><FontAwesomeIcon icon={faAddressBook} /> Supplier</Link></li>
        <li><Link to="/system-admin/account"><FontAwesomeIcon icon={faUsersLine} /> Account Roles</Link></li>
        <li><Link to="/system-admin/tags"><FontAwesomeIcon icon={faAddressBook} /> Tags</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
