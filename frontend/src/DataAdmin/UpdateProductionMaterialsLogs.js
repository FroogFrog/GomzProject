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

            if (log.materialsUsed) {
                const materials = log.materialsUsed.split(', ').map((item) => {
                    const [matName, quantity] = item.split(': ');
                    const matId = availableMaterials.find(material => material.matName === matName)?.matId || null;
                    return { matId, matName, quantity };
                });
                setAddedMaterials(materials);
            }
        }
    }, [log, availableMaterials]);

    const addMaterialToLog = () => {
        if (selectedMaterial && quantity) {
            // Check if the material is already added
            if (!addedMaterials.some((item) => item.matId === selectedMaterial)) {
                const selectedMat = availableMaterials.find((m) => m.matId === selectedMaterial);
                setAddedMaterials((prev) => [
                    ...prev,
                    { matId: selectedMaterial, matName: selectedMat?.matName, quantity }
                ]);
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
        setAddedMaterials((prev) => prev.filter((material) => material.matId !== materialId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedLog = {
            ...log,
            description,
            dateLogged,
            materialsUsed: addedMaterials
                .map((material) => `${material.matName}: ${material.quantity}`)
                .join(', ')
        };
        
        onUpdate(updatedLog);
        onClose();
    };

    const handleCancel = () => {
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
