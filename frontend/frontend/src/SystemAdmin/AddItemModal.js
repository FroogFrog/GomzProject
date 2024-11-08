import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css'; // You can style your modal here

const AddItemModal = ({ isOpen, onClose, onAdd }) => {
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]); // Store fetched inventory categories

    

    console.log("Add Supply Delivery Modal isOpen:", isOpen); // Log isOpen prop

    // Fetch inventory categories from backend when the modal opens
    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5000/api/categories/inventory')
                .then(response => {
                    setCategories(response.data);
                })
                .catch(error => {
                    console.error('Error fetching inventory categories:', error);
                });
        }
    }, [isOpen]); // Runs when the modal opens

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = { itemName, price, category, description };
        onAdd(newItem);
        onClose(); // Close the modal after adding
    };

    if (!isOpen) return null;

    return (
        <div id="addModal" className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.categoryName}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <button type="submit">Add Item</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;