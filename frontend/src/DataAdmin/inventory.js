import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Inventory() {
    const [item, setItems] = useState([]);
const navigate = useNavigate();

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/combined-data');
        setItems(response.data);
    } catch (error) {
        console.error('Error fetching combined data:', error);
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};

useEffect(() => {
    fetchData();
}, []);


    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className='main-content'>
                <div className="page-title">Products</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn" id="sortButton">
                                <i className="fa-solid fa-sort"></i> Sort
                            </button>
                        </div>
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search..."
                                    size="40"
                                />
                            </div>
                            <div>
                                <button id="searchButton" className="btn">Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="t-head">
                        <table className="table-head">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                    <th>Staff</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {item.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center' }}>No items found.</td>
                                    </tr>
                                ) : (
                                    item.map((item, index) => (
                                        <tr key={item.productionId}>
                                            <td>{index + 1}</td>
                                            <td>{item.itemName}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatDate(item.date)}</td>
                                            <td>{item.staff}</td>
                                            <td>{item.status}</td>
                                            <td>{formatDate(item.lastUpdated)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inventory;
