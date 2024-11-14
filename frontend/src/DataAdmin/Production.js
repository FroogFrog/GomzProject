import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import AddProductionModal from './AddProductionModal'; // Add production modal
import UpdateProductionModal from './UpdateProductionModal'; // Update production modal
import DeleteModal from './DeleteModal'; // Import DeleteModal component
import { ToastContainer, toast } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Required CSS for toast

function Production() {
    const [productions, setProductions] = useState([]);
    const [items, setItems] = useState([]); // For inventory items
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedProductionId, setSelectedProductionId] = useState(null); // Store selected production for update
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
    const [itemToDelete, setItemToDelete] = useState(null); // Item to delete
    const [searchText, setSearchText] = useState(''); // Search text state
    const [sortConfig, setSortConfig] = useState({
        key: 'itemName', // Default column to sort by
        direction: 'asc', // Default sort direction
    });

    // Fetch production data, inventory items
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/production');
            setProductions(response.data);

            const itemResponse = await axios.get('http://localhost:5000/api/item');
            setItems(itemResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
            await axios.delete(`http://localhost:5000/api/production/${id}`);
            fetchData(); // Refresh after deletion
            toast.success('Production item deleted successfully!'); // Show success toast
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete production item.'); // Show error toast
        }
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            await deleteItem(itemToDelete.productionId); // Call deleteItem with the itemId
        }
        setDeleteModalOpen(false); // Close the modal after deletion
        setItemToDelete(null); // Clear the item to delete
    };

    const confirmDeleteItem = (item) => {
        setItemToDelete(item); // Set the item to be deleted
        setDeleteModalOpen(true); // Open the delete modal
    };

    const openUpdateModal = (id) => {
        setSelectedProductionId(id);
        setUpdateModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setAddModalOpen(true);
    };

    // Helper function to get the item name by itemId
    function getItemName(itemId) {
        const item = items.find((i) => i.itemId === itemId);
        return item ? item.itemName : 'Unknown';
    }

    // Sorting function
    const sortedProductions = [...productions].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Filter productions based on search input
    const filteredProductions = sortedProductions.filter((production) => {
        const searchLower = searchText.toLowerCase();
        const itemName = getItemName(production.itemId).toLowerCase();
        const staffName = production.staffName.toLowerCase();
        return (
            itemName.includes(searchLower) || staffName.includes(searchLower)
        );
    });

    // Handle sort column and direction change
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className="main-content">
                <div className="page-title">Production Records</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn" onClick={openAddModal}>
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
                                    placeholder="Search by Item or Staff"
                                    size="40"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="t-head">
                        <table className="table-head">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('itemId')}>#</th>
                                    <th onClick={() => handleSort('itemId')}>Item</th>
                                    <th onClick={() => handleSort('quantityProduced')}>Quantity Produced</th>
                                    <th onClick={() => handleSort('productionDate')}>Date</th>
                                    <th onClick={() => handleSort('staffName')}>Staff</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {filteredProductions.map((production, index) => (
                                    <tr key={production.productionId}>
                                        <td>{index + 1}</td>
                                        <td>{getItemName(production.itemId)}</td>
                                        <td>{production.quantityProduced}</td>
                                        <td>{formatDate(production.productionDate)}</td>
                                        <td>{production.staffName}</td>
                                        <td>
                                            <button className="btn" onClick={() => confirmDeleteItem(production)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="edit-btn" onClick={() => openUpdateModal(production.productionId)}>
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

            {/* Update Production Modal */}
            <UpdateProductionModal
                isOpen={isUpdateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                items={items}
                productionId={selectedProductionId}
                onUpdate={fetchData} // Refresh data after update
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />

            {/* Add Production Modal */}
            <AddProductionModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                items={items}
                onAdd={fetchData} // Refresh data after adding
            />
            
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Production;
