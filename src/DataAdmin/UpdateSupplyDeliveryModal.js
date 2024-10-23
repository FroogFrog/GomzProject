import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css'; // You can style your modal here

function UpdateSupplyDeliveryModal({ isOpen, onClose, suppliers, items, setItems, deliveryId, onUpdate }) {
    const [delivery, setDelivery] = useState({
        supplyId: '',
        itemName: '',
        quantity: '',
        cost: '',
        date: '',
    });

    const suppliersLoaded = useRef(false);
    const initialFetchComplete = useRef(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (isOpen && deliveryId && !initialFetchComplete.current) {
            const fetchDelivery = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/supplydelivery/${deliveryId}`);
                    setDelivery({
                        ...response.data,
                        date: formatDate(response.data.date),
                    });
                    initialFetchComplete.current = true;
                } catch (error) {
                    console.error('Error fetching delivery:', error);
                }
            };
            fetchDelivery();
        }
    }, [isOpen, deliveryId]);

    useEffect(() => {
        if (suppliers.length > 0 && delivery.supplyId && !suppliersLoaded.current) {
            handleSupplierChange({ target: { value: delivery.supplyId } });
            suppliersLoaded.current = true;
        }
    }, [suppliers, delivery.supplyId]);

    const handleSupplierChange = async (event) => {
        const { value } = event.target;
        const selectedSupplier = suppliers.find(s => parseInt(s.supplyId, 10) === parseInt(value, 10));

        if (selectedSupplier) {
            let productsArray = [];
            try {
                productsArray = Array.isArray(selectedSupplier.product) ? 
                    selectedSupplier.product : JSON.parse(selectedSupplier.product);
            } catch (error) {
                console.error('Error parsing products:', error);
            }
            setDelivery(prevState => ({
                ...prevState,
                supplyId: selectedSupplier.supplyId,
                itemName: '',
            }));
            setItems(productsArray);
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
            onClose();  // Close the modal
        } catch (error) {
            console.error('Error updating supply delivery:', error);
        }
    };

    return (
        isOpen && (
            <div className="modal">
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
                                onChange={handleSupplierChange}
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
                                name="itemName"
                                required
                                value={delivery.itemName}
                                onChange={handleChange}
                            >
                                <option value="">Select an item</option>
                                {items.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
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

                        <div className='form-group'>
                            <label>Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={delivery.date}
                                readOnly
                            />
                        </div>

                        <button className="btn" type="submit">Update</button>
                    </form>
                </div>
            </div>
        )
    );
}

export default UpdateSupplyDeliveryModal;
