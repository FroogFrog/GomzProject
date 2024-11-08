import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios for making API requests
import '../css/AddItemModal.css'; // You can style your modal here

const EditRawMatsModal = ({ isOpen, onClose, mats, onUpdate }) => {
    const [matName, setMatName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);  // State to track errors

    useEffect(() => {
        if (mats) {
            setMatName(mats.matName || '');
            setQuantity(mats.quantity || '');
            setCategory(mats.category || '');
        }
    }, [mats]);

    // Fetch categories from the backend when the modal opens
    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5000/api/categories/rawMaterials')
                .then(response => {
                    setCategories(response.data); // Set the categories from the API response
                })
                .catch(error => {
                    console.error('Error fetching inventory categories:', error);
                });
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedMat = { ...mats, matName, quantity, category};
        onUpdate(updatedMat); 
        onClose();
    };
    
    

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Raw Material</h2>
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
                    <button type="submit">Update Material</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditRawMatsModal;
