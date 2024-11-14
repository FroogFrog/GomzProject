import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import '../css/AddItemModal.css';

function UpdateSupplyDeliveryModal({ isOpen, onClose, suppliers, items, setItems, deliveryId, onUpdate }) {
    const [delivery, setDelivery] = useState({
        supplyId: '',
        matId: '',
        quantity: '',
        cost: '',
        date: '', // Date field managed in the background only
    });

    const initialFetchComplete = useRef(false);

    useEffect(() => {
        if (isOpen && deliveryId && !initialFetchComplete.current) {
            const fetchDelivery = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/supplydelivery/${deliveryId}`);
                    const fetchedDelivery = {
                        ...response.data,
                    };
                    setDelivery(fetchedDelivery);
                    initialFetchComplete.current = true;

                    // Fetch raw materials based on the fetched supplyId
                    if (fetchedDelivery.supplyId) {
                        handleSupplierChange({ target: { value: fetchedDelivery.supplyId } }, fetchedDelivery.matId);
                    }
                } catch (error) {
                    console.error('Error fetching delivery:', error);
                }
            };
            fetchDelivery();
        }
    }, [isOpen, deliveryId]);

    const handleSupplierChange = async (event, preselectedMatId = null) => {
        const selectedSupplyId = event.target.value;
        setDelivery(prevState => ({ ...prevState, supplyId: selectedSupplyId, matId: '' }));

        const selectedSupplier = suppliers.find(s => s.supplyId === parseInt(selectedSupplyId, 10));

        if (selectedSupplier) {
            try {
                const response = await axios.get(`http://localhost:5000/api/getrawmaterials/${selectedSupplyId}`);
                
                if (Array.isArray(response.data)) {
                    const fetchedItems = response.data.map(item => ({
                        id: item.matId,
                        name: item.matName,
                    }));
                    
                    setItems(fetchedItems);
                    
                    // Set matId to preselected value if it exists
                    setDelivery(prevState => ({
                        ...prevState,
                        matId: preselectedMatId || '', // Set matId only if preselectedMatId is provided
                    }));
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error('Error fetching raw materials:', error);
                setItems([]);
            }
        } else {
            setItems([]);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDelivery(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/updatesupplydelivery/${deliveryId}`, delivery);
            onUpdate(); // Callback to refresh the data
            onClose();  // Close the 
            toast.success("Supply delivery updated successfully!"); // Show sucmodalcess toast
        } catch (error) {
            console.error('Error updating supply delivery:', error);
            toast.error("Error updating supply delivery. Please try again."); // Show error toast
        }
    };
    //the edit is not displaying rigght when a new item is being edit    
    if (!isOpen) return null;

    return (
        <div id="addModal" className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Update Supply Delivery</h2>
                <form onSubmit={handleSubmit} id='updateForm'>
                    <div className='form-group'>
                        <label>Supplier Name:</label>
                        <select
                            name="supplyId"
                            required
                            value={delivery.supplyId}
                            onChange={(e) => handleSupplierChange(e)}
                        >
                            <option value="">Select a supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.supplyId} value={supplier.supplyId}>
                                    {supplier.supplyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group'>
                        <label>Item Name:</label>
                        <select
                            name="matId"
                            required
                            value={delivery.matId}
                            onChange={handleChange}
                        >
                            <option value="">Select an item</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='form-group'>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            name="quantity"
                            required
                            value={delivery.quantity}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Cost:</label>
                        <input
                            type="number"
                            name="cost"
                            required
                            value={delivery.cost}
                            onChange={handleChange}
                        />
                    </div>

                    <button className="btn" type="submit">Update</button>
                </form>
            </div>

            {/* ToastContainer to display toasts */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default UpdateSupplyDeliveryModal;
