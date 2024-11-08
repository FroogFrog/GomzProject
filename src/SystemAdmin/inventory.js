import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';     
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DetailsModal from './ItemDetailsModal';  // Import DetailsModal component
import DeleteModal from './DeleteModal'; // Import DeleteModal component
import '@fortawesome/fontawesome-free/css/all.min.css';

function Inventory() {
    const [item, setItem] = useState([]);
    const [inventoryDetails, setInventoryDetails] = useState([]);  // Correct state for inventory details
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);  // State for details modal
    const [currentItem, setCurrentItem] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
    const [itemToDelete, setItemToDelete] = useState(null); // Item to delete
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/item');
            const data = await response.json();
            setItem(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetching inventory details based on the selected itemId
    const fetchInventoryDetails = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/inventory-by-item/${itemId}`);
            setInventoryDetails(response.data); // Use setInventoryDetails to store data
        } catch (error) {
            console.error('Error fetching inventory details:', error);
        }
    };

    const addItem = async (newItem) => {
        try {
            const response = await axios.post('http://localhost:5000/api/additem', newItem);
            fetchData();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const updateItem = async (updatedItem) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/updateitem/${updatedItem.itemId}`, updatedItem);
            fetchData();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/deleteitem/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            await deleteItem(itemToDelete.itemId); // Call deleteItem with the itemId
        }
        setDeleteModalOpen(false); // Close the modal after deletion
        setItemToDelete(null); // Clear the item to delete
    };    

    const confirmDeleteItem = (item) => {
        setItemToDelete(item); // Set the item to be deleted
        setDeleteModalOpen(true); // Open the delete modal
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openEditModal = (item) => {
        setCurrentItem(item);
        setEditModalOpen(true);
    };

    const openDetailsModal = (item) => {
        setCurrentItem(item);
        fetchInventoryDetails(item.itemId); // Fetch inventory details when opening the modal
        setDetailsModalOpen(true); // Open the modal
    };;

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className='main-content'>
                <div className="page-title">Products</div>
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
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {item.map((item, index) => (
                                    <tr key={item.itemId}>
                                        <td>{index + 1}</td>
                                        <td>{item.itemName}</td>
                                        <td>₱{item.price}</td>
                                        <td>{item.category}</td>
                                        <td>{item.totalQuantity}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <button title="View Details" className="btn" onClick={() => openDetailsModal(item)}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button className="btn" onClick={() => confirmDeleteItem(item)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>

                                            <button className="edit-btn" onClick={() => openEditModal(item)}>
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
            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={addItem}
            />
            <EditItemModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                item={currentItem}
                onUpdate={updateItem}
            />
            <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
            />
            <DetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                item={currentItem}  // Ensure currentItem is properly set
                inventoryDetails={inventoryDetails}  // Pass the correct inventory details
            />
            {/* 
            
             */}
            </div>
            
        
    );
}

export default Inventory;
