import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css'; // You can style your modal here

function UpdateProductionModal({ isOpen, onClose, items, productionId, onUpdate }) {
    const [production, setProduction] = useState({
        itemId: '',
        quantityProduced: '',
        status: 'In Progress',
        staffName: '',
    });

    const initialFetchComplete = useRef(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setProduction({
                itemId: '',
                quantityProduced: '',
                status: 'In Progress',
                productionDate: '',
                staffName: '',
            });
            initialFetchComplete.current = false;  // Reset fetch flag when modal closes
        }
    }, [isOpen]);

    // Fetch production details when modal opens and the productionId is set
    useEffect(() => {
        if (isOpen && productionId && !initialFetchComplete.current) {
            const fetchProduction = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/production/${productionId}`);
                    const productionData = response.data[0] || {}; // If response is an array, access the first element
                    
                    setProduction({
                        itemId: productionData.itemId || '',   // Default to empty string if undefined
                        quantityProduced: productionData.quantityProduced || '',
                        status: productionData.status || 'In Progress',
                        productionDate: productionData.productionDate || '',
                        staffName: productionData.staffName || ''
                    });
                    initialFetchComplete.current = true;  // Mark fetch as complete
                } catch (error) {
                    console.error('Error fetching production:', error);
                }
            };
            fetchProduction();
        }
    }, [isOpen, productionId]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduction(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {  
            await axios.put(`http://localhost:5000/api/updateProduction/${productionId}`, production);
            onUpdate(); // Refresh the data after update
            onClose();  // Close the modal
        } catch (error) {
            console.error('Error updating production:', error);
        }
    };

    return (
        isOpen && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Update Production Record</h2>
                    <form onSubmit={handleSubmit} id="updateForm">
                        <div className="form-group">
                            <label>Item</label>
                            <select
                                name="itemId"
                                required
                                value={production.itemId}
                                onChange={handleChange}
                            >
                                <option value="">Select an item</option>
                                {items.map(item => (
                                    <option key={item.itemId} value={item.itemId}>
                                        {item.itemName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Quantity Produced</label>
                            <input
                                type="number"
                                name="quantityProduced"
                                required
                                value={production.quantityProduced}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                required
                                value={production.status}
                                onChange={handleChange}
                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Canceled">Canceled</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Staff Name</label>
                            <input
                                type="text"
                                name="staffName"
                                required
                                value={production.staffName}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="btn" type="submit">Update</button>
                    </form>
                </div>
            </div>
        )
    );
}

export default UpdateProductionModal;
