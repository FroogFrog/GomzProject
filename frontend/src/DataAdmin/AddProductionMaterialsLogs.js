import React, { useState, useEffect } from 'react';
import '../css/AddItemModal.css';
import axios from 'axios';

const AddItemModal = ({ isOpen, onClose, onAdd }) => {
    const [description, setDescription] = useState('');
    const [dateLogged, setDateLogged] = useState('');
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [addedMaterials, setAddedMaterials] = useState([]);
    const [quantity, setQuantity] = useState(''); // Added state for quantity

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rawmats'); // Replace with the correct endpoint
                setAvailableMaterials(response.data);
                console.log('Fetched available materials:', response.data); // Log fetched materials
            } catch (error) {
                console.error('Error fetching materials:', error);
            }
        };

        if (isOpen) {
            fetchMaterials();
            // Set the current date when the modal is opened
            const currentDate = new Date().toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
            setDateLogged(currentDate);
            console.log('Set current date:', currentDate); // Log current date
        }
    }, [isOpen]);

    const addMaterialToLog = () => {
        if (selectedMaterial && quantity) {
            // Check if the material is already added
            if (!addedMaterials.some((item) => item.materialId === selectedMaterial)) {
                const newMaterial = { materialId: selectedMaterial, quantity: quantity };
                setAddedMaterials((prev) => [
                    ...prev,
                    newMaterial,
                ]);
                console.log('Added material:', newMaterial); // Log the material added
                setQuantity(''); // Reset quantity after adding
            } else {
                alert('This material has already been added.');
            }
            setSelectedMaterial('');
        } else {
            alert('Please select a material and enter a quantity.');
        }
    };

    const handleRemoveMaterial = (materialId) => {
        const updatedMaterials = addedMaterials.filter((item) => item.materialId !== materialId);
        setAddedMaterials(updatedMaterials);
        console.log('Removed material with ID:', materialId); // Log material removed
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLog = {
            description,
            dateLogged, // Automatically includes today's date
            materials: addedMaterials,
        };
        console.log('Submitted new log:', newLog); // Log the full log details before sending
        onAdd(newLog);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Production Material Log</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    
                    {/* Dropdown for selecting materials */}
                    <div className="material-selection">
                        <select
                            value={selectedMaterial}
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                        >
                            <option value="">Select a Material</option>
                            {availableMaterials.map((material) => (
                                <option key={material.matId} value={material.matId}>
                                    {material.matName}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                        <button type="button" onClick={addMaterialToLog}>
                            Add Material
                        </button>
                    </div>

                    {/* Display added materials */}
                    <div className="added-materials">
                        <h4>Added Materials:</h4>
                        {addedMaterials.length === 0 ? (
                            <p>No materials added yet.</p>
                        ) : (
                            <ul>
                                {addedMaterials.map((item, index) => {
                                    const material = availableMaterials.find(m => m.matId.toString() === item.materialId);
                                    return (
                                        <li key={index}>
                                            {material?.matName} - {item.quantity} units
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMaterial(item.materialId)}
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

                    <button type="submit">Add Log</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
