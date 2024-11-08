import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Header from '../BG/SalesAdminHeader';
import Sidebar from '../BG/SalesAdminSidebar';
import axios from 'axios';
import moment from "moment";
import EditOrderModal from './EditOrderModal';

function Cancelled() {
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]); // New state to hold items
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch orders from the backend
    const fetchOrdersByStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cancelled`);
            setOrders(response.data); // Use response.data directly
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Fetch items from the backend
    const fetchItems = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/items`);
            setItems(response.data); // Use response.data directly
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    useEffect(() => {
        fetchOrdersByStatus();
        fetchItems(); // Fetch items on component mount
    }, []);

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
            fetchOrdersByStatus();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    // Function to get item name by itemId
    const getItemNameById = (itemId) => {
        const item = items.find((item) => item.itemId === itemId);
        return item ? item.itemName : 'Unknown Item'; // Return a default value if not found
    };

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className='main-content'>
                <div className="page-title">Preparing Orders</div>
                <div className="info">
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
                                        <td>{getItemNameById(order.itemId)}</td> {/* Get item name */}
                                        <td>{order.quantity}</td>
                                        <td>₱{order.price}</td>
                                        <td>
                                            <button className="btn">
                                                <i className="fa-solid fa-check"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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

export default Cancelled;
