import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css'; // You can style your modal here


function AddProductionModal({ isOpen, onClose, items, onAdd }) {
    const [production, setProduction] = useState({
        itemId: '',
        quantityProduced: '',
        staffName: '', // Added staffName field
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduction(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/addProduction', production);
            onAdd(); // Refresh the data
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error adding production:', error);
        }
    };

    if (!isOpen) return null; // Return null if not open

    return (
        <div id="addModal" className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Production Record</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Item</label>
                        <select name="itemId" value={production.itemId} onChange={handleChange} required>
                            <option value="">Select an item</option>
                            {items.map(item => (
                                <option key={item.itemId} value={item.itemId}>{item.itemName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Quantity Produced</label>
                        <input
                            type="number"
                            name="quantityProduced"
                            value={production.quantityProduced}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Staff</label>
                        <input
                            type="text"
                            name="staffName"
                            value={production.staffName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="btn" type="submit">Add</button>
                </form>
            </div>
        </div>
    )
}

export default AddProductionModal;
