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
        <li><Link to="/"><FontAwesomeIcon icon={faHouse} /> Dashboard</Link></li>
        <li><Link to="/document"><FontAwesomeIcon icon={faFile} /> Document</Link></li>
        <li><Link to="/inventory"><FontAwesomeIcon icon={faBox} /> Inventory</Link></li>
        <li><Link to="/RawMats"><FontAwesomeIcon icon={faBoxesStacked} /> Raw Materials</Link></li>
        <li><Link to="/Supplier"><FontAwesomeIcon icon={faAddressBook} /> Supplier</Link></li>
        <li><Link to="/SupplyDeliveries"><FontAwesomeIcon icon={faTruckRampBox} /> Supply Deliveries</Link></li>
        <li><Link to="/ProdWork"><FontAwesomeIcon icon={faPeopleCarryBox} /> Production Workers</Link></li>
        <li><Link to="/Production"><FontAwesomeIcon icon={faSitemap} /> Production</Link></li>
        <li><Link to="/deliwork"><FontAwesomeIcon icon={faPersonBiking} /> Delivery Workers</Link></li>
        <li><Link to="/delivery"><FontAwesomeIcon icon={faTruckRampBox} /> Delivery</Link></li>
        <li><Link to="/Orders"><FontAwesomeIcon icon={faClipboardList} /> Orders</Link></li>
        <li><Link to="/Customers"><FontAwesomeIcon icon={faClipboardUser} /> Customers</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
