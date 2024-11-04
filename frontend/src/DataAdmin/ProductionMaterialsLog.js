import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import '../css/style.css';

function ProductionMaterialsLogs() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/production-material-logs');

            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching production material logs:", error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const filteredLogs = logs.filter(log =>
        (log.itemName && log.itemName.toLowerCase().includes(search.toLowerCase())) ||
        (log.description && log.description.toLowerCase().includes(search.toLowerCase()))
    );
    

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className='main-content'>
                <div className="page-title">Production Material Logs</div>
                <div className="info">
                <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn">
                                <i className="fa-solid fa-add"></i> Add
                            </button>
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
                                    <th>Material</th>
                                    <th>Quantity Used</th>
                                    <th>Date Logged</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>No logs found.</td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log, index) => (
                                        <tr key={log.logId}>
                                            <td>{index + 1}</td>
                                            <td>{log.matName}</td>
                                            <td>{log.quantityUsed}</td>
                                            <td>{new Date(log.dateLogged).toLocaleDateString()}</td>
                                            <td>{log.description}</td>
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

export default ProductionMaterialsLogs;
