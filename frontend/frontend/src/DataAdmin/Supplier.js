import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Supplier() {
    const [supplier, setSupplier] = useState([]);
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
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                                    <th></th>
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Supplier;
