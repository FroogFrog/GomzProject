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
    const [paginatedOrders, setPaginatedOrders] = useState([]);  // Orders for the current page
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;  // You can adjust this number

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

    useEffect(() => {
        // Paginate orders when orders or currentPage change
        const indexOfLastOrder = currentPage * ordersPerPage;
        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
        const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
        setPaginatedOrders(currentOrders);
    }, [orders, currentPage]);

    const handleAddOrder = async (newOrder, orderProductsData) => {
        try {
            // Combine order details and products into one request
            const response = await axios.post('http://localhost:5000/api/orders', {
                ...newOrder,
                orderProducts: orderProductsData
            });
            
            console.log('Order added successfully:', response.data);
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
            // Send the merged data in the PUT request
            await axios.put(`http://localhost:5000/api/orders/${updatedOrder.orderId}`, updatedOrder);
    
            // Update the local orders state
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderId === updatedOrder.orderId ? updatedOrder : order
                )
            );
    
            // Close the modal and refresh the orders list
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

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
            setCurrentPage(currentPage + 1);
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
                                    <th>Items</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: 'center' }}>No orders found.</td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order, index) => {
                                        const itemNames = order.itemNames ? order.itemNames.split(', ') : [];
                                        const itemQuantities = order.quantities ? order.quantities.split(', ') : [];
                                        const itemsArray = itemNames.map((name, i) => ({
                                            itemName: name,
                                            quantity: itemQuantities[i] || 'Unknown quantity',
                                        }));

                                        return (
                                            <tr key={order.orderId}>
                                                <td>{index + 1}</td>
                                                <td>{order.customerName}</td>
                                                <td>{moment(order.date).format("MM-DD-YYYY")}</td>
                                                <td>{order.location}</td>
                                                <td>{order.modeOfPayment}</td>
                                                <td>{order.paymentStatus}</td>
                                                <td>{order.status}</td>
                                                <td>
                                                    {itemsArray.length > 0 ? (
                                                        <ul>
                                                            {itemsArray.map((item, i) => (
                                                                <li key={i}>
                                                                    {item.itemName} ({item.quantity})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        "No items listed"
                                                    )}
                                                </td>
                                                <td>₱{order.price}</td>
                                                <td className="button-container">
                                                    <button className="done-btn" onClick={() => handleEditOrder(order)}>
                                                        <i className="fa-solid fa-check"></i>
                                                    </button>
                                                    <button className="edit-btn" onClick={() => handleEditOrder(order)}>
                                                        <i className="fa-solid fa-edit"></i>
                                                    </button>
                                                    <button className="btn" onClick={() => handleDeleteOrder(order.orderId)}>
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button className="btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            <i className="fa-solid fa-chevron-left"></i> Prev
                        </button>
                        <span>Page {currentPage} of {Math.ceil(orders.length / ordersPerPage)}</span>
                        <button className="btn" onClick={handleNextPage} disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}>
                            Next <i className="fa-solid fa-chevron-right"></i>
                        </button>
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
