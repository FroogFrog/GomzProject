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
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc' for sorting order

    // Fetch logs from backend
    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/production-material-logs');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching production material logs:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSearchChange = (e) => setSearch(e.target.value);

    // Sorting function
    const sortLogsByDate = () => {
        const sortedLogs = [...logs].sort((a, b) => {
            const dateA = new Date(a.dateLogged);
            const dateB = new Date(b.dateLogged);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setLogs(sortedLogs);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sorting order
    };

    // Filter logs based on search input (Description field only)
    const filteredLogs = logs.filter((log) =>
        log.description && log.description.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddLogClick = () => setAddModalOpen(true);

    const handleEditLogClick = (log) => {
        setLogToUpdate(log);
        setUpdateModalOpen(true);
    };

    const handleDeleteLogClick = (log) => {
        setItemToDelete(log);
        setDeleteModalOpen(true);
    };

    const handleDeleteLog = async () => {
        if (!itemToDelete) return;

        console.log('Deleting log:', itemToDelete);  // Add this line for debugging

        try {
            await axios.delete(`http://localhost:5000/api/deletemateriallog/${itemToDelete.logId}`);
            fetchLogs();
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting log:', error);
            alert('Failed to delete the log. Please try again.');
        }
    };

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

    const handleLogUpdated = async (updatedLog) => {
        try {
            await axios.post('http://localhost:5000/api/updateproductionlog', updatedLog);
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
                        </div>
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search by description..."
                                    size="40"
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="t-head">
                        <table className="table-head">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th onClick={sortLogsByDate}>Date</th>
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
                                        const materialNames = log.matNames ? log.matNames.split(', ') : [];
                                        const materialQuantities = log.quantities ? log.quantities.split(', ') : [];
                                        const materialBatchNumbers = log.batchNumbers ? log.batchNumbers.split(', ') : [];
                                        const materialsArray = materialNames.map((name, i) => ({
                                            matName: name,
                                            batchNumber: materialBatchNumbers[i] || 'Unknown batch',
                                            quantity: materialQuantities[i] || 'Unknown quantity',
                                        }));

                                        return (
                                            <tr key={log.logId}>
                                                <td>{index + 1}</td>
                                                <td>{log.description}</td>
                                                <td>{new Date(log.dateLogged).toLocaleDateString()}</td>
                                                <td>
                                                    {materialsArray.length > 0 ? (
                                                        <ul>
                                                            {materialsArray.map((material, i) => (
                                                                <li key={i}>
                                                                    {material.matName} - Batch#{material.batchNumber} ({material.quantity})
                                                                </li>
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
                onConfirm={handleDeleteLog} 
            />
        </div>
    );
}

export default ProductionMaterialsLogs;
