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
                    console.log("Fetching delivery for ID:", deliveryId); // Log delivery ID being fetched
                    const response = await axios.get(`http://localhost:5000/api/supplydelivery/${deliveryId}`);
                    console.log("Fetched delivery response:", response.data); // Log fetched delivery data
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
        console.log("Selected supplier ID:", value);
        const selectedSupplier = suppliers.find(s => parseInt(s.supplyId, 10) === parseInt(value, 10));

        console.log("Selected supplier:", selectedSupplier);

        if (selectedSupplier) {
            let productsArray = [];
            try {
                // Ensure products exist before attempting to parse
                if (selectedSupplier.products) {
                    console.log("Raw products data:", selectedSupplier.products);
                    productsArray = Array.isArray(selectedSupplier.products) ?
                        selectedSupplier.products : JSON.parse(selectedSupplier.products);
                    console.log("Parsed products array:", productsArray);
                } else {
                    console.warn("No products found for selected supplier."); // Handle case when no products are available
                }
            } catch (error) {
                console.error('Error parsing products:', error);
                console.log("Products data that caused the error:", selectedSupplier.products);
            }
            setDelivery(prevState => ({
                ...prevState,
                supplyId: selectedSupplier.supplyId,
                itemName: '',
            }));
            setItems(productsArray);
        } else {
            setItems([]);
            console.log("No supplier found for ID:", value);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(`Changing ${name} to ${value}`); // Log changes to inputs
        setDelivery(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting delivery update with data:", delivery); // Log the data being submitted
        try {
            await axios.put(`http://localhost:5000/api/updatesupplydelivery/${deliveryId}`, delivery);
            onUpdate(); // Callback to refresh the data
            onClose();  // Close the modal
        } catch (error) {
            console.error('Error updating supply delivery:', error);
        }
    };

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
                                {items.map((item, index) => (
                                    <option key={index} value={item.itemName}>{item.itemName}</option> 
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
}

export default UpdateSupplyDeliveryModal;


// the items is not showing right