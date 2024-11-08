import React, { useEffect, useState } from 'react';
import '../css/AddItemModal.css';
import axios from 'axios';

function UpdateProductionMaterialLogs({ isOpen, onClose, log, onUpdate }) {
    const [description, setDescription] = useState('');
    const [dateLogged, setDateLogged] = useState('');
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [quantity, setQuantity] = useState('');
    const [addedMaterials, setAddedMaterials] = useState([]);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rawmats');
                setAvailableMaterials(response.data);
            } catch (error) {
                console.error('Error fetching raw materials:', error);
            }
        };

        if (isOpen) {
            fetchMaterials();
        }
    }, [isOpen]);

    // Load log details into temp state on open or log change
    useEffect(() => {
        if (log) {
            setDescription(log.description || '');
            setDateLogged(log.dateLogged || '');

            if (log.matNames && log.quantities) {
                // Assuming matNames and quantities are comma-separated
                const materialNames = log.matNames.split(', ');
                const materialQuantities = log.quantities.split(', ');

                const materials = materialNames.map((matName, index) => {
                    // Match matName to availableMaterials to get matId
                    const matId = availableMaterials.find((material) => material.matName === matName)?.matId || null;
                    const quantity = materialQuantities[index] || '0'; // Ensure quantity is valid
                    return { matId, matName, quantity };
                });
                setAddedMaterials(materials);
            }
        }
    }, [log, availableMaterials]);

    const addMaterialToLog = () => {
        console.log('Adding material to log...', { selectedMaterial, quantity });
        if (selectedMaterial && quantity) {
            // Ensure selectedMaterial is a number
            const selectedMatId = Number(selectedMaterial); // Convert to number if necessary
            const selectedMat = availableMaterials.find((m) => m.matId === selectedMatId);
            
            if (selectedMat) {
                console.log('Selected material:', selectedMat);
                // Check if the material is already added
                if (!addedMaterials.some((item) => item.matId === selectedMatId)) {
                    setAddedMaterials((prev) => [
                        ...prev,
                        { matId: selectedMatId, matName: selectedMat.matName, quantity }
                    ]);
                    setQuantity(''); // Reset quantity after adding
                } else {
                    alert('This material has already been added.');
                }
                setSelectedMaterial(''); // Clear the selected material
            } else {
                alert('Material not found.');
            }
        } else {
            alert('Please select a material and enter a quantity.');
        }
    };
    

    const handleRemoveMaterial = (materialId) => {
        console.log('Removing material with id:', materialId);
        setAddedMaterials((prev) => prev.filter((material) => material.matId !== materialId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if all fields are filled correctly
        console.log("Checking form values...");
    
        if (!log.logId || !description || !addedMaterials || addedMaterials.length === 0) {
            alert('Please fill in all fields correctly.');
            console.log("Missing fields: ", { logId: log.logId, description, addedMaterials });
            return;
        }
    
        // Prepare the updated log data
        const updatedLog = {
            logId: log.logId,
            description,
            dateLogged: dateLogged || new Date().toISOString().split('T')[0], // Ensure the date is set correctly
            materials: addedMaterials.map(material => ({
                matId: material.matId,
                quantity: Number(material.quantity),  // Convert quantity to a number
            })),
        };
        
    
        console.log("Updated log data:", updatedLog);
    
        // Call the onUpdate callback
        onUpdate(updatedLog);
    
        // Close the modal
        onClose();
    };
    
    
    
    

    const handleCancel = () => {
        console.log('Canceling log update...');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Log</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Log Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
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
                        />
                        <button type="button" onClick={addMaterialToLog}>
                            Add Material
                        </button>
                    </div>

                    <div className="added-materials">
                        <h4>Added Materials:</h4>
                        {addedMaterials.length === 0 ? (
                            <p>No materials added yet.</p>
                        ) : (
                            <ul>
                                {addedMaterials.map((material, index) => (
                                    <li key={index}>
                                        {material.matName || 'Unknown Material'} - {material.quantity || 'Unknown Quantity'}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMaterial(material.matId)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button type="submit">Update Log</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProductionMaterialLogs;
