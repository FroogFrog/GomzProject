import React, { useEffect, useState } from "react";
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';
import AddRawMatsModal from './AddRawMatsModal';  
import EditRawMatsModal from './EditRawMatsModal';  
import RawMatDetailsModal from './RawMatsDetailsModal'; // Import the new modal
import DeleteModal from './DeleteModal'; // Import DeleteModal component
import '@fortawesome/fontawesome-free/css/all.min.css';
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
        } catch (error) {
            console.error('Error deleting item:', error.response ? error.response.data : error.message);
        }
    };

    const addRawMat = async (newMat) => {
        try {
            const response = await axios.post('http://localhost:5000/api/addmats', newMat);
            fetchData();
        } catch (error) {
            console.error('Error adding raw material:', error);
        }
    };

    const updateRawMat = async (updatedMat) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/updatemats/${updatedMat.matId}`, updatedMat);
            fetchData();
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
        console.log('Material clicked:', mats); // Check what data is passed
        setCurrentMats(mats);
        setDetailsModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
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
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {rawMats.map((rawMats, index) => (
                                    <tr key={rawMats.matsId}>
                                        <td>{index + 1}</td>
                                        <td>{rawMats.matName}</td>
                                        <td>{rawMats.quantity}</td>
                                        <td>{rawMats.category}</td>
                                        <td>
                                            <button className="btn" onClick={() => openDetailsModal(rawMats)} key={rawMats.matId}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button className="btn" onClick={() => confirmDeleteItem(rawMats)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="btn" onClick={() => openEditModal(rawMats)}>
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
