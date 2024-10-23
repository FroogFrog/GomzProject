import React, { useEffect, useState } from 'react';
import '../css/AddItemModal.css';
import axios from 'axios';

function EditSupplierModal({ isOpen, onClose, supplier, onUpdate }) {
    const [supplyName, setSupplyName] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [addedProducts, setAddedProducts] = useState([]);

    // Fetch available products (raw materials)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rawmats');
                setAvailableProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (isOpen) fetchProducts();
    }, [isOpen]);

    // Fetch raw materials for the selected supplier from tblsupplierrawmats
    useEffect(() => {
        const fetchSupplierProducts = async () => {
            if (supplier && supplier.supplyId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/supplier/${supplier.supplyId}/rawmats`);
                    const supplierRawMats = response.data; // Assuming the response contains raw materials
    
                    // Set the added products based on the fetched supplier raw materials
                    setAddedProducts(supplierRawMats.map(rawMat => rawMat.matId.toString())); // Use matId here
                } catch (error) {
                    console.error('Error fetching supplier products:', error);
                }
            }
        };

        if (supplier) {
            setSupplyName(supplier.supplyName || '');
            setAddress(supplier.address || '');
            setContact(supplier.contact || '');
            fetchSupplierProducts(); // Fetch and set added products
        }
    }, [supplier]);

    const addProductToSupplier = () => {
        if (selectedProduct) {
            // Check if the product is already added
            if (!addedProducts.includes(selectedProduct)) {
                setAddedProducts((prev) => [...prev, selectedProduct]);
            } else {
                alert('This product has already been added.');
            }
            setSelectedProduct(''); // Clear selection after adding
        }
    };

    const handleRemoveProduct = (productId) => {
        // Remove product by filtering out the selected product from addedProducts
        setAddedProducts((prev) => prev.filter((id) => id !== productId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedSupplier = {
            ...supplier,
            supplyName,
            address,
            contact,
            product: addedProducts, // Save updated products list
        };
        onUpdate(updatedSupplier);
        onClose(); // Close modal after update
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Supplier</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Supplier Name"
                        value={supplyName}
                        onChange={(e) => setSupplyName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Contact No."
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />
                    
                    {/* Dropdown for selecting products */}
                    <div className="product-selection">
                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            <option value="">Select a Product</option>
                            {availableProducts.map((product) => (
                                <option key={product.matId} value={product.matId}>
                                    {product.matName}
                                </option>
                            ))}
                        </select>
                        <button type="button" onClick={addProductToSupplier}>
                            Add Product
                        </button>
                    </div>

                    {/* Display added products */}
                    <div className="added-products">
                        <h4>Added Products:</h4>
                        {addedProducts.length === 0 ? (
                            <p>No products added yet.</p>
                        ) : (
                            <ul>
                                {addedProducts.map((productId, index) => {
                                    const product = availableProducts.find(p => p.matId.toString() === productId);
                                    return (
                                        <li key={index}>
                                            {product?.matName || 'Unknown Product'}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(productId)}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <button type="submit">Update Supplier</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default EditSupplierModal;
 