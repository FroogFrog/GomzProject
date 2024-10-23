import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import AddSupplyDeliveryModal from './AddSupplyDeliveryModal'; // Ensure this is the correct path
import UpdateSupplyDeliveryModal from './UpdateSupplyDeliveryModal'; // Import the modal
import '@fortawesome/fontawesome-free/css/all.min.css';

function SupplyDeliveries() {
    const [supDeli, setSupDeli] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false); // Modal state for adding
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); // Modal state for updating
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null); // Store selected delivery for update

    const fetchData = async () => {
        try {
            // Fetch Supply Deliveries
            const response = await axios.get('http://localhost:5000/api/supDeli');
            setSupDeli(response.data);

            // Fetch Suppliers
            const supplierResponse = await axios.get('http://localhost:5000/api/supplier');
            setSuppliers(supplierResponse.data);

            // Fetch Inventory Items
            const itemResponse = await axios.get('http://localhost:5000/api/item');
            setItems(itemResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getSupply = (id) => {
        const supplier = suppliers.find(supplier => supplier.supplyId === id);
        return supplier ? supplier.supplyName : 'Unknown Supplier';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/deleteSupDeli/${id}`);
            fetchData(); // Refresh after deletion
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    

    // Function to open the update modal
    const openUpdateModal = (id) => {
        setSelectedDeliveryId(id);
        setUpdateModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className="main-content">
                <div className="page-title">Supply Deliveries</div>
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
                                    <th>Supplier Name</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Cost</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {supDeli.map((delivery, index) => (
                                    <tr key={delivery.supDeliId}>
                                        <td>{index + 1}</td>
                                        <td>{getSupply(delivery.supplyId)}</td>
                                        <td>{delivery.matName}</td> {/* Use matName from the fetched data */}
                                        <td>{delivery.quantity}</td>
                                        <td>₱{delivery.cost}</td>
                                        <td>{formatDate(delivery.date)}</td>
                                        <td>
                                            <button className="btn" onClick={() => deleteItem(delivery.supDeliId)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="edit-btn" onClick={() => openUpdateModal(delivery.supDeliId)}>
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

            {/* add Supply Delivery Modal */}
            <AddSupplyDeliveryModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)} 
                suppliers={suppliers} 
                items={items}
                onAdd={fetchData} 
            />

            {/* Update Supply Delivery Modal */}
            <UpdateSupplyDeliveryModal
                isOpen={isUpdateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                suppliers={suppliers}
                items={items}
                setItems={setItems}  // Pass setItems correctly
                deliveryId={selectedDeliveryId}
                onUpdate={fetchData}  // Refresh data after update
            />
        </div>
    );
}

export default SupplyDeliveries;
