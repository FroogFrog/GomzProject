import React from 'react';
import { Link } from 'react-router-dom';
import gmzlogo from '../icons/gmzlogo.png'
import '../css/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFile, faBox, faBoxesStacked, faAddressBook, faTruckRampBox, faPeopleCarryBox, faSitemap, faPersonBiking, faClipboardList, faClipboardUser } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2><img src={gmzlogo} width="85" height="75" alt="Logo" /></h2>
      <ul>
        <li><Link to="/data-admin/dashboard"><FontAwesomeIcon icon={faHouse} /> Dashboard</Link></li>
        <li><Link to="/data-admin/inventory"><FontAwesomeIcon icon={faBox} /> Inventory</Link></li>
        <li><Link to="/data-admin/rawmaterial"><FontAwesomeIcon icon={faBoxesStacked} /> Raw Materials</Link></li>
        <li><Link to="/data-admin/Supplier"><FontAwesomeIcon icon={faAddressBook} /> Supplier</Link></li>
        <li><Link to="/data-admin/Supply-Delivery"><FontAwesomeIcon icon={faTruckRampBox} /> Supply Deliveries</Link></li>
        <li><Link to="/data-admin/Production"><FontAwesomeIcon icon={faSitemap} /> Production</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
