import React, { useEffect, useState } from "react";
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import '../css/style.css';

function RawMats() {
    const [rawMats, setRawMats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortedRawMats, setSortedRawMats] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'matName', direction: 'asc' });

    // Fetch raw materials data from the API
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rawmats');
            setRawMats(response.data);
            setSortedRawMats(response.data); // Set the sortedRawMats initially to all rawMats data
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter raw materials based on the search query
    const filteredRawMats = sortedRawMats.filter((rawMat) =>
        rawMat.matName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rawMat.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle sorting functionality
    const handleSort = (key) => {
        const newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const sortedData = [...filteredRawMats].sort((a, b) => {
            if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortedRawMats(sortedData);
        setSortConfig({ key, direction: newDirection });
    };

    return (
        <div className="container">
            <Sidebar />
            <Header />

            <div className='main-content'>
                <div className="page-title">RAW MATERIALS</div>
                <div className="info">
                    <div className="above-table">
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search by item name or category..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    size="40"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="t-head">
                        <table className="table-head">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th onClick={() => handleSort('matName')}>Item Name</th>
                                    <th onClick={() => handleSort('quantity')}>Quantity</th>
                                    <th onClick={() => handleSort('category')}>Category</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {filteredRawMats.map((rawMat, index) => (
                                    <tr key={rawMat.matsId}>
                                        <td>{index + 1}</td>
                                        <td>{rawMat.matName}</td>
                                        <td>{rawMat.quantity}</td>
                                        <td>{rawMat.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RawMats;
