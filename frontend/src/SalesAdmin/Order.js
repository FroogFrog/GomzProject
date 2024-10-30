import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Header from '../BG/SalesAdminHeader';
import Sidebar from '../BG/SalesAdminSidebar';
import axios from 'axios';
import moment from "moment";
import AddOrderModal from './AddOrderModal'; // Adjust the import based on your file structure

function Order() {
    const [orders, setOrders] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false); // State for controlling the modal

    // Fetch orders from the backend
    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAddOrder = async (newOrder) => {
        try {
            const response = await axios.post('http://localhost:5000/api/orders', newOrder);
            setOrders((prevOrders) => [...prevOrders, response.data]); // Update the orders list
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className='main-content'>
                <div className="page-title">Orders</div>
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
                                    <th>Customer</th>
                                    <th>Order Date</th>
                                    <th>Location</th>
                                    <th>Mode of Payment</th>
                                    <th>Payment Status</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.orderId}>
                                        <td>{index + 1}</td>
                                        <td>{order.itemName}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.customerName}</td>
                                        <td>{moment(order.date).format("MM-DD-YYYY")}</td>
                                        <td>{order.location}</td>
                                        <td>{order.modeOfPayment}</td>
                                        <td>{order.paymentStatus}</td>
                                        <td>{order.status}</td>
                                        <td>${order.price}</td>
                                        <td>
                                            <button className="btn" onClick={() => console.log('View Order')}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button className="btn" onClick={() => console.log('Delete Order')}>
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
            <AddOrderModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)} 
                onAdd={handleAddOrder} 
            />
        </div>
    );
}

export default Order;
