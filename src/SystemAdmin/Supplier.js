import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';
import AddSupplierModal from './AddSupplierModal'; // Import your AddItemModal
import EditSupplierModal from './EditSupplierModal'; // Import your EditItemModal
import SupplierDetailsModal from './SupplierDetailsModal'; // Import the SupplierDetailsModal
import '@fortawesome/fontawesome-free/css/all.min.css';

function Supplier() {
    const [supplier, setSupplier] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/supplier');
            
            
            
            // No need for JSON.parse, just use the product field as is
            const suppliersWithParsedProduct = response.data.map(supplier => ({
                ...supplier,
                product: supplier.product || 'No products' // Handle missing products
            }));

            setSupplier(suppliersWithParsedProduct);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addSupplier = async (newSupplier) => {
        try {
            const response = await axios.post('http://localhost:5000/api/addsupplier', newSupplier); // Change this line
            fetchData();
        } catch (error) {
            console.error('Error adding supplier:', error); // Log the error
        }
    };

    const updateSupplier = async (updatedSupplier) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/supplier/${updatedSupplier.supplyId}`, updatedSupplier);
            fetchData();
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    const deleteSupplier = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/deletesupplier/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (supplier) => {
        setSelectedSupplier(supplier);
        setEditModalOpen(true);
    };

    const openDetailsModal = (supplier) => {
        setSelectedSupplier(supplier);
        setDetailsModalOpen(true); // Open the modal
    };

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
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Contact No.</th>
                                    <th>Product</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {supplier.map((supply, index) => (
                                    <tr key={supply.supplyId}>
                                        <td>{index + 1}</td>
                                        <td>{supply.supplyName}</td>
                                        <td>{supply.address}</td>
                                        <td>{supply.contact}</td>
                                        <td>{supply.products || 'No products'}</td>
                                        <td>
                                            <button className="btn" onClick={() => openDetailsModal(supply)}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button className="btn" onClick={() => deleteSupplier(supply.supplyId)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="btn" onClick={() => handleEditClick(supply)}>
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

            {/* Supplier Details Modal */}
            <SupplierDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                supplier={selectedSupplier} // Pass the selected supplier
            />
        </div>
    );
}

export default Supplier;
