import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';

function RawMats() {
    const [rawMats, setRawMats] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rawmats-data'); // Update endpoint as needed
            setRawMats(response.data);
        } catch (error) {
            console.error('Error fetching raw materials data:', error);
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
                <div className="page-title">Raw Materials</div>
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
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {rawMats.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: 'center' }}>No raw materials found.</td>
                                    </tr>
                                ) : (
                                    rawMats.map((rawMat, index) => (
                                        <tr key={rawMat.rawMatId}> 
                                            <td>{index + 1}</td>
                                            <td>{rawMat.itemName}</td>
                                            <td>{rawMat.quantity}</td>
                                            <td>{formatDate(rawMat.date)}</td>
                                            <td>{rawMat.status}</td> 
                                            <td>{formatDate(rawMat.lastUpdated)}</td>
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

export default RawMats;
