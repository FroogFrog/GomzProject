import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import AddSupplyDeliveryModal from './AddSupplyDeliveryModal'; // Ensure this is the correct path
import UpdateSupplyDeliveryModal from './UpdateSupplyDeliveryModal'; // Import the modal
import DeleteModal from './DeleteModal'; // Import DeleteModal component
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

function SupplyDeliveries() {
    const [supDeli, setSupDeli] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false); // Modal state for adding
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); // Modal state for updating
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null); // Store selected delivery for update
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
    const [itemToDelete, setItemToDelete] = useState(null); // Item to delete
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [sortOrder, setSortOrder] = useState('asc'); // State for sort order

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
            toast.success('Supply Delivery deleted successfully!'); // Toast on delete success
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Error deleting supply delivery.'); // Toast on delete failure
        }
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            await deleteItem(itemToDelete.supDeliId); // Call deleteItem with the itemId
        }
        setDeleteModalOpen(false); // Close the modal after deletion
        setItemToDelete(null); // Clear the item to delete
    };

    const confirmDeleteItem = (item) => {
        setItemToDelete(item); // Set the item to be deleted
        setDeleteModalOpen(true); // Open the delete modal
    };

    // Function to open the update modal
    const openUpdateModal = (id) => {
        setSelectedDeliveryId(id);
        setUpdateModalOpen(true);
    };

    // Sort function
    const sortData = (column) => {
        const sortedData = [...supDeli].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[column] > b[column] ? 1 : -1;
            } else {
                return a[column] < b[column] ? 1 : -1;
            }
        });
        setSupDeli(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Function to filter data based on search
    const filterData = (query) => {
        return supDeli.filter((delivery) =>
            (getSupply(delivery.supplyId)?.toLowerCase().includes(query.toLowerCase())) || 
            (delivery.matName?.toLowerCase().includes(query.toLowerCase()))
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filteredData = filterData(searchQuery);
            setSupDeli(filteredData);
        } else {
            fetchData(); // Reset to original data when searchQuery is cleared
        }
    }, [searchQuery]); // Trigger on searchQuery change

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
                        </div>
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search by Supplier or Item..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                    <th onClick={() => sortData('supplyId')}>Supplier Name</th>
                                    <th onClick={() => sortData('matName')}>Item</th>
                                    <th onClick={() => sortData('quantity')}>Quantity</th>
                                    <th onClick={() => sortData('cost')}>Cost</th>
                                    <th onClick={() => sortData('date')}>Date</th>
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
                                            <button className="btn" onClick={() => confirmDeleteItem(delivery)}>
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

            {/* Add Supply Delivery Modal */}
            <AddSupplyDeliveryModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                suppliers={suppliers}
                items={items}
                onAdd={fetchData}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />

            {/* Update Supply Delivery Modal */}
            <UpdateSupplyDeliveryModal
                isOpen={isUpdateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                suppliers={suppliers}
                items={items}
                setItems={setItems}
                deliveryId={selectedDeliveryId}
                onUpdate={fetchData}
            />

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
}

export default SupplyDeliveries;
