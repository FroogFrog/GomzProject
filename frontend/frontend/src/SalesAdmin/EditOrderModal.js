import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css';

const EditOrderModal = ({ isOpen, onClose, order, onUpdate }) => {
    const [customerName, setCustomerName] = useState('');
    const [location, setLocation] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [quantity, setQuantity] = useState('');
    const [items, setItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [selectedItemPrice, setSelectedItemPrice] = useState(0); // Price of selected item
    const [total, setTotal] = useState(0); // State for total price

    useEffect(() => {
        if (isOpen && order) {
            setSelectedItemId(order.itemId);
            setCustomerName(order.customerName);
            setLocation(order.location);
            setModeOfPayment(order.modeOfPayment);
            setPaymentStatus(order.paymentStatus);
            setQuantity(order.quantity);
            setSelectedItemPrice(order.price); // Set initial price
            setTotal(order.price * order.quantity); // Calculate initial total
        }
    }, [order, isOpen]);

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5000/api/items')
                .then(response => {
                    setItems(response.data);
                })
                .catch(error => {
                    console.error('Error fetching items:', error);
                });
        }
    }, [isOpen]);

    // Update the price and total when the selected item changes
    useEffect(() => {
        const selectedItem = items.find(item => item.itemId === selectedItemId);
        if (selectedItem) {
            setSelectedItemPrice(selectedItem.price);
            setTotal(quantity ? selectedItem.price * quantity : 0);
        }
    }, [selectedItemId, items, quantity]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedOrder = { 
            itemId: selectedItemId,
            customerName,
            date: new Date().toISOString().split('T')[0], // Use the automatically set date
            location,
            modeOfPayment,
            paymentStatus,
            price: selectedItemPrice,
            quantity
        };
        onUpdate(updatedOrder);
        // Reset all values after updating
        setCustomerName('');
        setLocation('');
        setModeOfPayment('');
        setPaymentStatus('');
        setQuantity('');
        setSelectedItemId('');
        setTotal(0);
        setSelectedItemPrice(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Order</h2>
                <form onSubmit={handleSubmit}>
                    
                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Mode of Payment"
                        value={modeOfPayment}
                        onChange={(e) => setModeOfPayment(e.target.value)}
                        required
                    />
                    <select 
                        value={paymentStatus} 
                        onChange={(e) => setPaymentStatus(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Select Payment Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Not Paid">Unpaid</option>
                    </select>
                    
                    {/* Display item name as plain text */}
                    <div className="item-name-display">
                        <strong>Item Name:</strong> {order.itemName || 'N/A'}
                    </div>
                    {/* Display the price of the selected item */}
                    <div className="price-display">
                        <strong>Price per Unit:</strong> ₱{selectedItemPrice.toFixed(2)}
                    </div>
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                    {/* Display the calculated total */}
                    <div className="total-display">
                        <strong>Total:</strong> ₱{total.toFixed(2)}
                    </div>
                    <button type="submit">Update Order</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditOrderModal;
