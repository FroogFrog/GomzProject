import React, { useEffect, useState } from "react";
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';
import AddRawMatsModal from './AddRawMatsModal';  
import EditRawMatsModal from './EditRawMatsModal';  
import RawMatDetailsModal from './RawMatsDetailsModal'; // Import the new modal
import DeleteModal from './DeleteModal'; // Import DeleteModal component
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../css/style.css';

function RawMats() {
    const [rawMats, setRawMats] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false); // State for details modal
    const [currentMats, setCurrentMats] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
    const [itemToDelete, setItemToDelete] = useState(null); // Item to delete
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' }); // State for sort configuration

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rawmats');
            setRawMats(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/deletemats/${id}`);
            fetchData();
            toast.success('Raw Material deleted successfully!');
        } catch (error) {
            console.error('Error deleting item:', error.response ? error.response.data : error.message);
        }
    };

    const addRawMat = async (newMat) => {
        try {
            const response = await axios.post('http://localhost:5000/api/addmats', newMat);
            fetchData();
            toast.success('Raw Material added successfully!');
        } catch (error) {
            console.error('Error adding raw material:', error);
        }
    };

    const updateRawMat = async (updatedMat) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/updatemats/${updatedMat.matId}`, updatedMat);
            fetchData();
            toast.success('Raw Material updated successfully!');
        } catch (error) {
            console.error('Error updating raw material:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            await deleteItem(itemToDelete.matId); // Call deleteItem with the itemId
        }
        setDeleteModalOpen(false); // Close the modal after deletion
        setItemToDelete(null); // Clear the item to delete
    };    

    const confirmDeleteItem = (item) => {
        setItemToDelete(item); // Set the item to be deleted
        setDeleteModalOpen(true); // Open the delete modal
    };

    const openEditModal = (mats) => {
        setCurrentMats(mats);
        setEditModalOpen(true);
    };

    const openDetailsModal = (mats) => {
        setCurrentMats(mats);
        setDetailsModalOpen(true);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = rawMats.filter(item => {
        return (
            item.matName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedData = filteredData.sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={3000} />
            <Sidebar />
            <Header />
                
            <div className='main-content'>
                <div className="page-title">RAW MATERIALS</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn" onClick={() => setAddModalOpen(true)}>
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
                                    placeholder="Search by Name or Category..."
                                    size="40"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                    <th>Quantity</th>
                                    <th onClick={() => handleSort('category')}>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {sortedData.map((rawMats, index) => (
                                    <tr key={rawMats.matsId}>
                                        <td>{index + 1}</td>
                                        <td>{rawMats.matName}</td>
                                        <td>{rawMats.quantity}</td>
                                        <td>{rawMats.category}</td>
                                        <td>
                                            <button className="done-btn" onClick={() => openDetailsModal(rawMats)}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button className="btn" onClick={() => confirmDeleteItem(rawMats)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="edit-btn" onClick={() => openEditModal(rawMats)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>    
                </div>
            </div>

            {/* Add Modal */}
            <AddRawMatsModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={addRawMat}
            />

            {/* Edit Modal */}
            <EditRawMatsModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                mats={currentMats}
                onUpdate={updateRawMat}
            />
            <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
            />
            {/* Raw Material Details Modal */}
            <RawMatDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                rawMat={currentMats} // Pass the current material for 
            />
        </div>
    );
}

export default RawMats;
