import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/DataAdminHeader';
import Sidebar from '../BG/DataAdminSidebar';
import SupplierDetailsModal from './SupplierDetailsModal'; // Import the SupplierDetailsModal
import '@fortawesome/fontawesome-free/css/all.min.css';

function Supplier() {
    const [supplier, setSupplier] = useState([]);
    const [sortedSuppliers, setSortedSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'supplyName', direction: 'asc' });
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/supplier');
            // Ensure that products are correctly handled even if missing
            const suppliersWithParsedProduct = response.data.map(supplier => ({
                ...supplier,
                product: supplier.product || 'No products' // Handle missing products
            }));
            setSupplier(suppliersWithParsedProduct);
            setSortedSuppliers(suppliersWithParsedProduct); // Initially set the sorted list
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle sorting functionality
    const handleSort = (key) => {
        const newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const sortedData = [...sortedSuppliers].sort((a, b) => {
            if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortedSuppliers(sortedData);
        setSortConfig({ key, direction: newDirection });
    };

    // Handle search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter suppliers based on the search query (by supplier name)
    const filteredSuppliers = sortedSuppliers.filter((supply) =>
        supply.supplyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search by supplier name..."
                                    size="40"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="t-head">
                        <table className="table-head">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th onClick={() => handleSort('supplyName')}>Name</th>
                                    {/* <th onClick={() => handleSort('address')}>Address</th> */}
                                    <th onClick={() => handleSort('contact')}>Contact No.</th>
                                    <th onClick={() => handleSort('product')}>Product</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {filteredSuppliers.map((supply, index) => (
                                    <tr key={supply.supplyId}>
                                        <td>{index + 1}</td>
                                        <td>{supply.supplyName}</td>
                                        {/* <td>{supply.address}</td> */}
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
