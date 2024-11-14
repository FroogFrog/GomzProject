import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';     
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DetailsModal from './ItemDetailsModal';
import DeleteModal from './DeleteModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Inventory() {
    const [item, setItem] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [inventoryDetails, setInventoryDetails] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'itemName', direction: 'asc' });
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/item');
            const data = await response.json();
            setItem(data);
            setFilteredItems(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchInventoryDetails = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/inventory-data/${itemId}`);
            setInventoryDetails(response.data); 
        } catch (error) {
            console.error('Error fetching inventory details:', error);
        }
    };

    const addItem = async (newItem) => {
        try {
            const response = await axios.post('http://localhost:5000/api/additem', newItem);
            fetchData();
            toast.success('Item added successfully!');
        } catch (error) {
            console.error('Error adding item:', error);
            toast.error('Failed to add item.');
        }
    };

    const updateItem = async (updatedItem) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/updateitem/${updatedItem.itemId}`, updatedItem);
            fetchData();
            toast.success('Item updated successfully!');
        } catch (error) {
            console.error('Error updating item:', error);
            toast.error('Failed to update item.');
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/deleteitem/${id}`);
            fetchData();
            toast.success('Item deleted successfully!');
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete item.');
        }
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            await deleteItem(itemToDelete.itemId); 
        }
        setDeleteModalOpen(false); 
        setItemToDelete(null); 
    };    

    const confirmDeleteItem = (item) => {
        setItemToDelete(item); 
        setDeleteModalOpen(true); 
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
        fetchInventoryDetails(item.itemId); 
        setDetailsModalOpen(true); 
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        const query = event.target.value.toLowerCase();
        const filtered = item.filter((item) => 
            item.itemName.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        const sortedItems = [...filteredItems].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredItems(sortedItems);
        setSortConfig({ key, direction });
    };

    return (
        <div className="container">
            <ToastContainer position="top-right" autoClose={3000} />
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
                        </div>
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search by Item Name, Category or Description"
                                    size="40"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="t-head">
                        <table className="table-head">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('itemId')}>#</th>
                                    <th onClick={() => handleSort('itemName')}>Item Name</th>
                                    <th onClick={() => handleSort('price')}>Price</th>
                                    <th onClick={() => handleSort('category')}>Category</th>
                                    <th onClick={() => handleSort('quantity')}>Quantity</th>
                                    <th onClick={() => handleSort('description')}>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {filteredItems.map((item, index) => (
                                    <tr key={item.itemId}>
                                        <td>{index + 1}</td>
                                        <td>{item.itemName}</td>
                                        <td>₱{item.price}</td>
                                        <td>{item.category}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <button className="done-btn" onClick={() => openDetailsModal(item)}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button className="edit-btn" onClick={() => openEditModal(item)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button className="btn" onClick={() => confirmDeleteItem(item)}>
                                                <i className="fa-solid fa-trash-can"></i>
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
                item={currentItem}
                inventoryDetails={inventoryDetails}
            />
        </div>
    );
}

export default Inventory;
