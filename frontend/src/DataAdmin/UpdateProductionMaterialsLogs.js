import React, { useEffect, useState } from 'react';
import '../css/AddItemModal.css';
import axios from 'axios';

function UpdateProductionMaterialLogs({ isOpen, onClose, log, onUpdate }) {
    const [description, setDescription] = useState('');
    const [dateLogged, setDateLogged] = useState('');
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [availableBatches, setAvailableBatches] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [quantity, setQuantity] = useState('');
    const [addedMaterials, setAddedMaterials] = useState([]);
    const [selectedMaterialQuantity, setSelectedMaterialQuantity] = useState(null);
    const [selectedBatchQuantity, setSelectedBatchQuantity] = useState(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const materialResponse = await axios.get('http://localhost:5000/api/rawmats');
                setAvailableMaterials(materialResponse.data);
            } catch (error) {
                console.error('Error fetching raw materials:', error);
            }
        };

        const fetchBatches = async () => {
            try {
                const batchResponse = await axios.get('http://localhost:5000/api/rawmatsinv');
                setAvailableBatches(batchResponse.data);
            } catch (error) {
                console.error('Error fetching batches:', error);
            }
        };

        if (isOpen) {
            fetchMaterials();
            fetchBatches();
        }

    }, [isOpen]);

    // Ensure availableMaterials is populated before accessing it
    useEffect(() => {
        if (log && availableMaterials.length > 0) {
            setDescription(log.description || '');
            setDateLogged(log.dateLogged || ''); 
            
            if (log.matNames && log.quantities && log.batchNumbers) {
                const materialNames = log.matNames.split(', ');
                const materialQuantities = log.quantities.split(', ');
                const materialInventoryId = log.batchNumbers.split(', ');

                const materials = materialNames.map((matName, index) => {   
                    const material = availableMaterials.find((material) => material.matName === matName);
                    const matId = material ? material.matId : null;
                    const quantity = materialQuantities[index] || '0';
                    const inventoryId = materialInventoryId[index] || '0';
                    return { matId, matName, quantity, inventoryId };
                });
                setAddedMaterials(materials);
            }
        }
    }, [log, availableMaterials]);

    const handleMaterialChange = (e) => {
        setSelectedMaterial(e.target.value);
        const material = availableMaterials.find((m) => m.matId === Number(e.target.value));
        if (material) {
            setSelectedMaterialQuantity(material.availableQuantity);
        } else {
            setSelectedMaterialQuantity(null);
        }
    };

    const handleBatchChange = (e) => {
        setSelectedBatch(e.target.value);
        const batch = availableBatches.find((b) => b.inventoryId === Number(e.target.value));
        if (batch) {
            setSelectedBatchQuantity(batch.quantity);
        } else {
            setSelectedBatchQuantity(null);
        }
    };

    const addMaterialToLog = () => {
        if (selectedMaterial && selectedBatch && quantity) {
            const selectedMatId = Number(selectedMaterial);
            const selectedMat = availableMaterials.find((m) => m.matId === selectedMatId);
            const selectedBatchId = Number(selectedBatch);
            const selectedBatchData = availableBatches.find((b) => b.inventoryId === selectedBatchId);

            if (selectedMat && selectedBatchData) {
                if (parseInt(quantity, 10) > selectedBatchQuantity) {
                    alert('Entered quantity exceeds available batch quantity.');
                    return;
                }

                if (!addedMaterials.some((item) => item.matId === selectedMatId && item.inventoryId === selectedBatchId)) {
                    setAddedMaterials((prev) => [
                        ...prev,
                        { matId: selectedMatId, matName: selectedMat.matName, inventoryId: selectedBatchId, quantity }
                    ]);
                    setQuantity(''); // reset quantity after adding
                    setSelectedBatch(''); // reset batch after adding
                    setSelectedBatchQuantity(null); // reset batch quantity
                } else {
                    alert('This material with this batch has already been added.');
                }
                setSelectedMaterial(''); // reset selected material after adding
                setSelectedMaterialQuantity(null); // reset material quantity
            }
        } else {
            alert('Please select a material, batch, and enter a quantity.');
        }
    };

    const handleRemoveMaterial = (materialId, batchId) => {
        setAddedMaterials((prev) => prev.filter((material) => material.matId !== materialId || material.inventoryId !== batchId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!log.logId || !description || addedMaterials.length === 0) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const updatedLog = {
            logId: log.logId,
            description,
            dateLogged: dateLogged || new Date().toISOString().split('T')[0],
            materials: addedMaterials.map((material) => ({
                matId: material.matId,
                inventoryId: material.inventoryId,
                quantity: Number(material.quantity),
            })),
        };

        onUpdate(updatedLog);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Production Material Log</h2>
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
                            onChange={handleMaterialChange}
                        >
                            <option value="">Select a Material</option>
                            {availableMaterials.length > 0 && availableMaterials.map((material) => (
                                <option key={material.matId} value={material.matId}>
                                    {material.matName}
                                </option>
                            ))}
                        </select>

                        {selectedMaterial && (
                            <select
                                value={selectedBatch}
                                onChange={handleBatchChange}
                            >
                                <option value="">Select a Batch</option>
                                {availableBatches.filter((batch) => batch.matId === Number(selectedMaterial))
                                    .map((batch) => (
                                        <option key={batch.inventoryId} value={batch.inventoryId}>
                                            Batch #{batch.inventoryId} - Quantity: {batch.quantity}
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
                        <button
                            type="button"
                            onClick={addMaterialToLog}
                            disabled={parseInt(quantity, 10) > parseInt(selectedBatchQuantity, 10)}
                        >
                            Add Material
                        </button>
                    </div>

                    <div className="added-materials">
                        <h4>Added Materials:</h4>
                        {addedMaterials.length === 0 ? (
                            <p>No materials added yet.</p>
                        ) : (
                            <ul>
                                {addedMaterials.map((item, index) => {
                                    const material = availableMaterials.find(
                                        (m) => m.matId.toString() === item.matId.toString()
                                    );
                                    const batch = availableBatches.find(
                                        (b) => b.inventoryId === item.inventoryId
                                    );
                                    return (
                                        <li key={index}>
                                            {material?.matName} - Batch#{item?.inventoryId} - {item.quantity} units
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMaterial(item.matId, item.inventoryId)}
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

                    <button type="submit">Update Log</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProductionMaterialLogs;
