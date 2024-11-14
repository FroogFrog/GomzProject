import React, { useState, useEffect } from 'react';
import '../css/AddItemModal.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const AddProductionMaterialsLogs = ({ isOpen, onClose, onAdd }) => {
    const [description, setDescription] = useState('');
    const [dateLogged, setDateLogged] = useState('');
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [availableBatches, setAvailableBatches] = useState([]); // Store batches for selected material
    const [selectedBatch, setSelectedBatch] = useState(''); // Store selected batch
    const [selectedBatchQuantity, setSelectedBatchQuantity] = useState(''); // Store available batch quantity
    const [addedMaterials, setAddedMaterials] = useState([]); // Store the added materials
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rawmats');
                setAvailableMaterials(response.data);
            } catch (error) {
                console.error('Error fetching materials:', error);
            }
        };

        if (isOpen) {
            fetchMaterials();
            const currentDate = new Date().toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
            setDateLogged(currentDate);
        }
    }, [isOpen]);

    // Fetch available batches when a material is selected
    useEffect(() => {
        if (selectedMaterial) {
            const fetchBatches = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/rawmatsinv/${selectedMaterial}`);
                    setAvailableBatches(response.data);
                } catch (error) {
                    console.error('Error fetching batches:', error);
                }
            };
            fetchBatches();
        }
    }, [selectedMaterial]);

    // Set the quantity for the selected batch
    useEffect(() => {
        if (selectedBatch) {
            const selectedBatchData = availableBatches.find(batch => batch.inventoryId === parseInt(selectedBatch));
            // Ensure selectedBatchData is not undefined
            if (selectedBatchData) {
                setSelectedBatchQuantity(selectedBatchData.quantity.toString());
            } else {
                setSelectedBatchQuantity('');
            }
        }
    }, [selectedBatch, availableBatches]);

    const addMaterialToLog = () => {
        if (selectedMaterial && selectedBatch && quantity) {
            // Ensure quantity and selectedBatchQuantity are both valid numbers
            const enteredQuantity = parseInt(quantity, 10);
            const batchQuantity = parseInt(selectedBatchQuantity, 10);
            
            // Check if the entered quantity exceeds the available batch quantity
            if (isNaN(enteredQuantity) || isNaN(batchQuantity)) {
                toast.error('Please enter a valid quantity.');
                return;
            }
            
            if (enteredQuantity > batchQuantity) {
                toast.error('Entered quantity exceeds available batch quantity.'); // Show error toast
                return;
            }

            // Check if the material and batch combination is already added
            if (!addedMaterials.some((item) => item.materialId === selectedMaterial && item.inventoryId === selectedBatch)) {
                const newMaterial = {
                    materialId: selectedMaterial,
                    inventoryId: selectedBatch, // Save only inventoryId
                    quantity: enteredQuantity
                };

                setAddedMaterials((prev) => [...prev, newMaterial]);
                setQuantity(''); // Reset quantity after adding
            } else {
                toast.error('This material and batch combination has already been added.'); // Show error toast
            }

            setSelectedMaterial('');
            setSelectedBatch('');  // Clear selected batch
            setSelectedBatchQuantity(''); // Reset batch quantity
        } else {
            toast.error('Please select a material, batch, and enter a quantity.'); // Show error toast
        }
    };

    const handleRemoveMaterial = (materialId, inventoryId) => {
        const updatedMaterials = addedMaterials.filter(
            (item) => item.materialId !== materialId || item.inventoryId !== inventoryId
        );
        setAddedMaterials(updatedMaterials);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLog = {
            description,
            dateLogged, // Automatically includes today's date
            materials: addedMaterials,
        };
        onAdd(newLog);
        onClose();
    };

    const isAddButtonDisabled = parseInt(quantity, 10) > parseInt(selectedBatchQuantity, 10); // Check if the button should be disabled

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

                        {/* Dropdown for selecting batch */}
                        {selectedMaterial && (
                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                            >
                                <option value="">Select a Batch</option>
                                {availableBatches.map((batch) => (
                                    <option key={batch.inventoryId} value={batch.inventoryId}>
                                        Batch#{batch.inventoryId} - Quantity: {batch.quantity}
                                    </option>
                                ))}
                            </select>
                        )}

                        <input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                        {/* Disable if quantity exceeds available batch quantity */}
                        <button
                            type="button"
                            onClick={addMaterialToLog}
                            disabled={isAddButtonDisabled}
                        >
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
                                    const material = availableMaterials.find(
                                        m => m.matId.toString() === item.materialId
                                    );

                                    const batch = availableBatches.find(
                                        b => b.inventoryId === item.inventoryId // Find batch by inventoryId
                                    );
                                    return (
                                        <li key={index}>
                                            {material?.matName} - Batch#{item?.inventoryId} - {item.quantity} units
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMaterial(item.materialId, item.inventoryId)}
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

export const ToastContainer = () => <ToastContainer position="top-right" autoClose={3000} />;

export default AddProductionMaterialsLogs;
