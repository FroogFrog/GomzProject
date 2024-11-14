import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';     
import { ToastContainer, toast } from 'react-toastify'; // Import toastify
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function Inventory() {
    const [item, setItem] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortedItems, setSortedItems] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'itemName', direction: 'asc' });

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/item');
            const data = await response.json();
            setItem(data);
            setSortedItems(data); // Initially set the sortedItems to all items
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter the items based on the search query
    const filteredItems = sortedItems.filter((item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle sorting functionality
    const handleSort = (key) => {
        const newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const sortedData = [...filteredItems].sort((a, b) => {
            if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortedItems(sortedData);
        setSortConfig({ key, direction: newDirection });
    };

    // Add Item (with Toast)
    const addItem = async (newItem) => {
        try {
            await axios.post('http://localhost:5000/api/additem', newItem);
            fetchData();
            toast.success('Item added successfully!'); // Show success toast
        } catch (error) {
            console.error('Error adding item:', error);
            toast.error('Failed to add item'); // Show error toast
        }
    };

    // Update Item (with Toast)
    const updateItem = async (updatedItem) => {
        try {
            await axios.put(`http://localhost:5000/api/item/${updatedItem.itemId}`, updatedItem);
            fetchData();
            toast.success('Item updated successfully!'); // Show success toast
        } catch (error) {
            console.error('Error updating item:', error);
            toast.error('Failed to update item'); // Show error toast
        }
    };

    // Delete Item (with Toast)
    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/deleteitem/${id}`);
            fetchData();
            toast.success('Item deleted successfully!'); // Show success toast
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete item'); // Show error toast
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className='main-content'>
                <div className="page-title">Products</div>
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
                                    placeholder="Search by name, category or description..."
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
                                    <th onClick={() => handleSort('itemName')}>Item Name</th>
                                    <th onClick={() => handleSort('price')}>Price</th>
                                    <th onClick={() => handleSort('category')}>Category</th>
                                    <th onClick={() => handleSort('quantity')}>Quantity</th>
                                    <th>Description</th>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>     
                    </div>
                </div>
            </div>

            {/* ToastContainer for Notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Inventory;
