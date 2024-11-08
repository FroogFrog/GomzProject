import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css'; // You can style your modal here

const AddRawMatsModal = ({ isOpen, onClose, onAdd }) => {
    const [matName, setMatName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5000/api/categories/rawMaterials')
                .then(response => {
                    setCategories(response.data);
                })
                .catch(error => {
                    console.error('Error fetching raw materials categories:', error);
                });
        }
    }, [isOpen]); // Runs when the modal opens

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMat = { matName, category };  // Include quantity in newMat
        onAdd(newMat);
        onClose(); // Close the modal after adding
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Raw Material</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Material Name"
                        value={matName}
                        onChange={(e) => setMatName(e.target.value)}
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
                    <button type="submit">Add Material</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddRawMatsModal;
