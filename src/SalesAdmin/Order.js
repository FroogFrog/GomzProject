import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Header from '../BG/SalesAdminHeader';
import Sidebar from '../BG/SalesAdminSidebar';
import axios from 'axios';
import moment from "moment";
import AddOrderModal from './AddOrderModal';
import EditOrderModal from './EditOrderModal';

function Order() {
    const [orders, setOrders] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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
            setOrders((prevOrders) => [...prevOrders, response.data]);
            fetchOrders();
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setEditModalOpen(true);
    };

    const handleUpdateOrder = async (updatedOrder) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${updatedOrder.orderId}`, updatedOrder);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderId === updatedOrder.orderId ? updatedOrder : order
                )
            );
            setEditModalOpen(false);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
                setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
            } catch (error) {
                console.error('Error deleting order:', error);
            }
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
                                    <th>Customer</th>
                                    <th>Order Date</th>
                                    <th>Location</th>
                                    <th>Mode of Payment</th>
                                    <th>Payment Status</th>
                                    <th>Status</th>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
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
                                        <td>{order.customerName}</td>
                                        <td>{moment(order.date).format("MM-DD-YYYY")}</td>
                                        <td>{order.location}</td>
                                        <td>{order.modeOfPayment}</td>
                                        <td>{order.paymentStatus}</td>
                                        <td>{order.status}</td>
                                        <td>{order.itemName}</td>
                                        <td>{order.quantity}</td>
                                        <td>₱{order.price}</td>
                                        <td>
                                            <button className="btn" onClick={() => handleEditOrder(order)}>
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                            <button className="btn" onClick={() => handleDeleteOrder(order.orderId)}>
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
            {isEditModalOpen && (
                <EditOrderModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={handleUpdateOrder}
                    order={selectedOrder}
                />
            )}
        </div>
    );
}

export default Order;
