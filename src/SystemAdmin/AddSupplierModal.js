import React, { useState, useEffect } from 'react';
import '../css/AddItemModal.css';
import axios from 'axios';

const AddItemModal = ({ isOpen, onClose, onAdd }) => {
    const [supplyName, setSupplyName] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [addedProducts, setAddedProducts] = useState([]);

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

    const addProductToSupplier = () => {
        if (selectedProduct) {
            // Check if the product is already added
            if (!addedProducts.includes(selectedProduct)) {
                setAddedProducts((prev) => [...prev, selectedProduct]);
                console.log(addedProducts)
            } else {
                alert('This product has already been added.');
            }
            setSelectedProduct('');
        }
    };

    const handleRemoveProduct = (productId) => {
        // Remove product by filtering out the selected product from addedProducts
        setAddedProducts((prev) => prev.filter((id) => id !== productId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSupplier = {
            supplyName,
            address,
            contact,
            product: addedProducts,
        };
        onAdd(newSupplier);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Supplier</h2>
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

                    <button type="submit">Add Supplier</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
