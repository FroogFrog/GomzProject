import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css';

const AddOrderModal = ({ isOpen, onClose, onAdd }) => {
    const [customerName, setCustomerName] = useState('');
    const [location, setLocation] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [items, setItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemPrice, setSelectedItemPrice] = useState(0);
    const [date, setDate] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();

        const today = new Date().toISOString().split('T')[0];
        setDate(today);
    }, []);

    useEffect(() => {
        const numericItemId = parseInt(selectedItemId, 10);
        const selectedItem = items.find(item => item.itemId === numericItemId);
        
        if (selectedItem) {
            const itemPrice = selectedItem.price || 0;
            setSelectedItemPrice(itemPrice);
            const calculatedTotal = itemPrice * quantity;
            setTotal(calculatedTotal);
        } else {
            setSelectedItemPrice(0);
            setTotal(0);
        }
    }, [selectedItemId, items, quantity]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newOrder = { 
            itemId: selectedItemId,
            customerName,
            date,
            location,
            modeOfPayment,
            paymentStatus,
            price: total,
            quantity
        };
        await onAdd(newOrder); 
        onClose(); 

        // Clear all fields after adding the order
        setCustomerName('');
        setLocation('');
        setModeOfPayment('');
        setPaymentStatus('');
        setQuantity(1);
        setSelectedItemId(null);
        setSelectedItemPrice(0);
        setTotal(0);
    };

    return (
        <div id="addModal" className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Order</h2>
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
                    <select 
                        value={selectedItemId || ""} 
                        onChange={(e) => setSelectedItemId(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Select Item</option>
                        {items.map(item => (
                            <option key={item.itemId} value={item.itemId}>
                                {item.itemName}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        required
                    />
                    <div className="price-display">
                        <strong>Total Price:</strong> ₱{total.toFixed(2)}
                    </div>
                    <button type="submit">Add Order</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddOrderModal;
