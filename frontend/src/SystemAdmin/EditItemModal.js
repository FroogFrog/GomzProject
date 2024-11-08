import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios for making API requests
import '../css/AddItemModal.css'; // You can style your modal here

const EditItemModal = ({ isOpen, onClose, item, onUpdate }) => {
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]); // State to hold the inventory categories

    useEffect(() => {
        if (item) {
            setItemName(item.itemName);
            setPrice(item.price);
            setCategory(item.category);
            setDescription(item.description);
        }
    }, [item]);

    // Fetch categories from the backend when the modal opens
    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5000/api/categories/inventory')
                .then(response => {
                    setCategories(response.data); // Set the categories from the API response
                })
                .catch(error => {
                    console.error('Error fetching inventory categories:', error);
                });
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedItem = { ...item, itemName, price, category, description };
        onUpdate(updatedItem);
        onClose(); // Close the modal after updating
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Item</h2>
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
                    <button type="submit">Update Item</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditItemModal;
