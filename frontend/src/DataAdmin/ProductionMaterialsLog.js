import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import DeleteModal from './DeleteModal';
import AddProductionMaterialLog from './AddProductionMaterialsLogs';
import UpdateProductionMaterialLogs from './UpdateProductionMaterialsLogs';
import '../css/style.css';

function ProductionMaterialsLogs() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [logToUpdate, setLogToUpdate] = useState(null);

    // Fetch logs from the backend
    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/production-material-logs');
            console.log('Fetched logs:', response.data);
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching production material logs:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => setSearch(e.target.value);

    // Filter logs based on search input
    const filteredLogs = logs.filter((log) =>
        (log.itemName && log.itemName.toLowerCase().includes(search.toLowerCase())) ||
        (log.description && log.description.toLowerCase().includes(search.toLowerCase()))
    );

    // Open add log modal
    const handleAddLogClick = () => {
        setAddModalOpen(true);
    };

    // Open update log modal
    const handleEditLogClick = (log) => {
        setLogToUpdate(log);
        setUpdateModalOpen(true);
    };

    // Open delete log modal
    const handleDeleteLogClick = (log) => {
        setItemToDelete(log);
        setDeleteModalOpen(true);
    };

    // Handle log deletion
    const handleDeleteLog = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/deletemateriallog/${itemToDelete.logId}`);
            fetchLogs();
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting log:', error);
        }
    };

    // Handle new log added
    const handleLogAdded = async (newLog) => {
        try {
            await axios.post('http://localhost:5000/api/addproductionlog', newLog);
            fetchLogs();
            setAddModalOpen(false);
        } catch (error) {
            console.error('Error adding production log:', error);
            alert('Failed to add production log. Please try again.');
        }
    };

    // Handle log update
    const handleLogUpdated = async (updatedLog) => {
        try {
            await axios.put(`http://localhost:5000/api/updatelog/${updatedLog.logId}`, updatedLog);
            fetchLogs();
            setUpdateModalOpen(false);
        } catch (error) {
            console.error('Error updating production log:', error);
            alert('Failed to update production log. Please try again.');
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className="main-content">
                <div className="page-title">Material Used Logs</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn" onClick={handleAddLogClick}>
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
                                    onChange={handleSearchChange}
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
                                    <th>Description</th>
                                    <th>Date Logged</th>
                                    <th>Materials Used</th>
                                    <th>Actions</th>
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
                                    filteredLogs.map((log, index) => {
                                        // Parse materialsUsed into an array if it’s a comma-separated string
                                        const materialsArray = typeof log.materialsUsed === 'string'
                                            ? log.materialsUsed.split(',').map(material => material.trim())
                                            : log.materialsUsed;

                                        return (
                                            <tr key={log.logId}>
                                                <td>{index + 1}</td>
                                                <td>{log.description}</td>
                                                <td>{new Date(log.dateLogged).toLocaleDateString()}</td>
                                                <td>
                                                    {Array.isArray(materialsArray) && materialsArray.length > 0 ? (
                                                        <ul>
                                                            {materialsArray.map((material, i) => (
                                                                <li key={i}>{material}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        "No materials used"
                                                    )}
                                                </td>
                                                <td>
                                                    <button className="btn" onClick={() => handleDeleteLogClick(log)}>
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                    <button className="edit-btn" onClick={() => handleEditLogClick(log)}>
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Add Production Material Log Modal */}
            <AddProductionMaterialLog 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)} 
                onAdd={handleLogAdded} 
            />
            {/* Update Production Log Modal */}
            <UpdateProductionMaterialLogs 
                isOpen={isUpdateModalOpen} 
                onClose={() => setUpdateModalOpen(false)} 
                log={logToUpdate} 
                onUpdate={handleLogUpdated} 
            />
            {/* Delete Confirmation Modal */}
            <DeleteModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)} 
                onDelete={handleDeleteLog} 
            />
        </div>
    );
}

export default ProductionMaterialsLogs;
