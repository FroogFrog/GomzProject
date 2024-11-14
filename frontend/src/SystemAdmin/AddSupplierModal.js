import React, { useState, useEffect } from 'react';
import '../css/AddItemModal.css';
import axios from 'axios';

const AddItemModal = ({ isOpen, onClose, onAdd }) => {
    const [supplyName, setSupplyName] = useState('');
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

    // Function to format phone number to the required format
    const formatPhoneNumber = (phoneNumber) => {
        // Remove non-digit characters
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Format the phone number
        return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
    };

    const addProductToSupplier = () => {
        if (selectedProduct) {
            // Check if the product is already added
            if (!addedProducts.includes(selectedProduct)) {
                setAddedProducts((prev) => [...prev, selectedProduct]);
            } else {
                alert('This product has already been added.');
            }
            setSelectedProduct(''); // Clear the selected product after adding
        }
    };

    const handleRemoveProduct = (productId) => {
        setAddedProducts((prev) => prev.filter((id) => id !== productId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format the contact number before saving
        const formattedContact = formatPhoneNumber(contact);

        const newSupplier = {
            supplyName,
            contact: formattedContact, // Use the formatted contact number
            product: addedProducts,
        };

        console.log(newSupplier.contact)
        onAdd(newSupplier); // Call the onAdd function with the formatted supplier data
        onClose(); // Close the modal
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
