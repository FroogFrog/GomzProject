import React, { useState, useEffect } from 'react';
import '../css/AddItemModal.css';
import axios from 'axios';

const AddOrderModal = ({ isOpen, onClose, onAdd }) => {
    const [customerName, setCustomerName] = useState('');
    const [location, setLocation] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('unpaid');
    const [quantity, setQuantity] = useState('');
    const [orderProducts, setOrderProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [selectedItemPrice, setSelectedItemPrice] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items'); // Fetch items from backend
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        if (isOpen) {
            fetchItems();
        }
    }, [isOpen]);

    useEffect(() => {
        const selectedItem = items.find(item => item.itemId.toString() === selectedItemId);
        if (selectedItem) {
            setSelectedItemPrice(selectedItem.price || 0);
        }
    }, [selectedItemId, items]);

    useEffect(() => {
        const calculatedTotal = orderProducts.reduce((sum, product) => {
            return sum + product.quantity * selectedItemPrice;
        }, 0);
        setTotal(calculatedTotal);
    }, [orderProducts, selectedItemPrice]);

    if (!isOpen) return null;

    const addProductToOrder = () => {
        if (selectedItemId && quantity > 0) {
            const selectedItemIdNumber = Number(selectedItemId);
            if (!orderProducts.some(item => item.itemId === selectedItemIdNumber)) {
                const product = {
                    itemId: selectedItemIdNumber, 
                    quantity: quantity,
                };
                setOrderProducts(prev => [...prev, product]);
                setQuantity(''); 
                setSelectedItemId('');
            } else {
                alert('This product has already been added.');
            }
        } else {
            alert('Please select a product and enter a quantity.');
        }
    };

    const removeProductFromOrder = (productId) => {
        const updatedProducts = orderProducts.filter(product => product.itemId !== productId);
        setOrderProducts(updatedProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data for tblorders
        const newOrder = {
            customerName,
            date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
            price: total,
            status: 'preparing',
            lastUpdateDate: new Date().toISOString(),
            location,
            paymentStatus,
            modeOfPayment,
        };

        // Prepare data for tblorderproducts
        const orderProductsData = orderProducts.map(product => ({
            orderId: null, // Order ID will be generated in the backend
            itemId: product.itemId,
            quantity: product.quantity,
        }));

        // Log data to check for undefined values
        console.log('Order Data:', newOrder);
        console.log('Order Products Data:', orderProductsData);

        await onAdd(newOrder, orderProductsData);  // Pass both new order and order products to the parent method

        onClose(); 
        setCustomerName('');
        setLocation('');
        setModeOfPayment('');
        setPaymentStatus('unpaid');
        setOrderProducts([]);
    };

    return (
        <div className="modal-overlay">
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
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                    </select>

                    <div className="product-selection">
                        <select
                            value={selectedItemId}
                            onChange={(e) => setSelectedItemId(e.target.value)}
                            required
                        >
                            <option value="">Select a Product</option>
                            {items.map(item => (
                                <option key={item.itemId} value={item.itemId}>
                                    {item.itemName}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Quantity"
                            required
                        />
                        <button type="button" onClick={addProductToOrder}>
                            Add Product
                        </button>
                    </div>

                    <div className="added-products">
                        <h4>Added Products</h4>
                        {orderProducts.length === 0 ? (
                            <p>No products added yet.</p>
                        ) : (
                            <ul>
                                {orderProducts.map((product, index) => {
                                    const item = items.find(i => i.itemId === product.itemId);
                                    return (
                                        <li key={index}>
                                            {item ? item.itemName : 'Product not found'} - {product.quantity} x ₱{item.price.toFixed(2)}
                                            <button
                                                type="button"
                                                onClick={() => removeProductFromOrder(product.itemId)}
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

                    <div className="total-price">
                        <p>Total Price: ₱{total.toFixed(2)}</p>
                    </div>

                    <button type="submit">Save Order</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddOrderModal;
