import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';
import AddSupplierModal from './AddSupplierModal'; 
import EditSupplierModal from './EditSupplierModal'; 
import SupplierDetailsModal from './SupplierDetailsModal'; 
import DeleteModal from './DeleteModal'; 
import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer and toast
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles

function Supplier() {
    const [supplier, setSupplier] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'supplyName', direction: 'asc' });
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/supplier');
            const suppliersWithParsedProduct = response.data.map(supplier => ({
                ...supplier,
                product: supplier.product || 'No products'
            }));
            setSupplier(suppliersWithParsedProduct);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch suppliers.');  // Error toast for fetch
        }
    };

    const addSupplier = async (newSupplier) => {
        try {
            await axios.post('http://localhost:5000/api/addsupplier', newSupplier);
            fetchData();
            toast.success('Supplier added successfully!');  // Success toast
        } catch (error) {
            console.error('Error adding supplier:', error);
            toast.error('Failed to add supplier.');  // Error toast
        }
    };

    const updateSupplier = async (updatedSupplier) => {
        try {
            await axios.put(`http://localhost:5000/api/supplier/${updatedSupplier.supplyId}`, updatedSupplier);
            fetchData();
            toast.success('Supplier updated successfully!');  // Success toast
        } catch (error) {
            console.error('Error updating supplier:', error);
            toast.error('Failed to update supplier.');  // Error toast
        }
    };

    const deleteSupplier = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/deletesupplier/${id}`);
            fetchData();
            toast.success('Supplier deleted successfully!');  // Success toast
        } catch (error) {
            console.error('Error deleting supplier:', error);
            toast.error('Failed to delete supplier.');  // Error toast
        }
    };

    const handleDeleteConfirm = async () => {
        if (itemToDelete) {
            await deleteSupplier(itemToDelete.supplyId);
        }
        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const confirmDeleteItem = (supply) => {
        setItemToDelete(supply);
        setDeleteModalOpen(true);
    };

    const handleEditClick = (supplier) => {
        setSelectedSupplier(supplier);
        setEditModalOpen(true);
    };

    const openDetailsModal = (supplier) => {
        setSelectedSupplier(supplier);
        setDetailsModalOpen(true);
    };

    const handleSort = (column) => {
        let direction = 'asc';
        if (sortConfig.key === column && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: column, direction });
    };

    const sortedSuppliers = supplier
        .filter(supply => 
            supply.supplyName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className='main-content'>
                <div className="page-title">Supplier</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn" onClick={() => setAddModalOpen(true)}>
                                <i className="fa-solid fa-add"></i> Add
                            </button>
                            <button className="btn" id="sortButton" onClick={() => handleSort('supplyName')}>
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
                                    placeholder="Search by name or contact..."
                                    size="40"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="t-head">
                        <table className="table-head">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('supplyId')}>#</th>
                                    <th onClick={() => handleSort('supplyName')}>Name</th>
                                    <th onClick={() => handleSort('contact')}>Contact No.</th>
                                    <th>Product</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {sortedSuppliers.map((supply, index) => (
                                    <tr key={supply.supplyId}>
                                        <td>{index + 1}</td>
                                        <td>{supply.supplyName}</td>
                                        <td>{supply.contact}</td>
                                        <td>{supply.products || 'No products'}</td>
                                        <td>
                                            <button className="btn" onClick={() => openDetailsModal(supply)}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button className="btn" onClick={() => confirmDeleteItem(supply)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="edit-btn" onClick={() => handleEditClick(supply)}>
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

            {/* Add Supplier Modal */}
            <AddSupplierModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={addSupplier}
            />

            {/* Edit Supplier Modal */}
            <EditSupplierModal 
                isOpen={isEditModalOpen} 
                onClose={() => setEditModalOpen(false)} 
                supplier={selectedSupplier} 
                onUpdate={updateSupplier} 
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
            {/* Supplier Details Modal */}
            <SupplierDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                supplier={selectedSupplier} 
            />

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Supplier;
