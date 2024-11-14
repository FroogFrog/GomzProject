import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css';

const EditOrderModal = ({ isOpen, onClose, order, onUpdate }) => {
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

    const [isOrderInitialized, setIsOrderInitialized] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items');
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
        if (isOpen && order && items.length > 0 && !isOrderInitialized) {
            setCustomerName(order.customerName || '');
            setLocation(order.location || '');
            setModeOfPayment(order.modeOfPayment || '');
            setPaymentStatus(order.paymentStatus || 'unpaid');

            if (order.itemNames && order.quantities) {
                const itemNamesArray = order.itemNames.split(', ');
                const itemQuantitiesArray = order.quantities.split(', ');

                const itemsList = itemNamesArray.map((itemName, index) => {
                    const item = items.find(item => item.itemName === itemName) || {};
                    const quantity = itemQuantitiesArray[index] || '0';
                    return {
                        itemId: item.itemId || null,
                        itemName: item.itemName || '',
                        quantity,
                        price: item.price || 0
                    };
                });

                setOrderProducts(itemsList);
                calculateTotalPrice(itemsList);
                setIsOrderInitialized(true);
            }
        }
    }, [isOpen, order, items, isOrderInitialized]);

    useEffect(() => {
        const selectedItem = items.find(item => item.itemId.toString() === selectedItemId);
        if (selectedItem) {
            setSelectedItemPrice(selectedItem.price || 0);
        }
    }, [selectedItemId, items]);

    const calculateTotalPrice = (products) => {
        const totalPrice = products.reduce((total, product) => total + (product.quantity * product.price), 0);
        setTotal(totalPrice);
    };

    if (!isOpen) return null;

    const addProductToOrder = () => {
        if (selectedItemId && quantity > 0) {
            const selectedItemIdNumber = Number(selectedItemId);
            if (!orderProducts.some(item => item.itemId === selectedItemIdNumber)) {
                const selectedItem = items.find(item => item.itemId === selectedItemIdNumber);
                const product = {
                    itemId: selectedItemIdNumber,
                    itemName: selectedItem?.itemName || '',
                    quantity,
                    price: selectedItem?.price || 0,
                };
                const updatedProducts = [...orderProducts, product];
                setOrderProducts(updatedProducts);
                setQuantity('');
                setSelectedItemId('');
                calculateTotalPrice(updatedProducts);
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
        calculateTotalPrice(updatedProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const updatedOrder = {
            orderId: order.orderId,
            customerName,
            date: order.date || new Date().toISOString().split('T')[0],
            price: total,
            status: order.status || 'preparing',
            lastUpdateDate: new Date().toISOString(),
            location,
            paymentStatus,
            modeOfPayment,
            orderProducts: orderProducts.map(product => ({
                orderId: order.orderId,
                itemId: product.itemId,
                quantity: product.quantity,
            }))
        };
    
        console.log(updatedOrder.orderProducts);
    
        await onUpdate(updatedOrder);  // Pass updatedOrder with orderProducts inside it
        onClose();
        setCustomerName('');
        setLocation('');
        setModeOfPayment('');
        setPaymentStatus('unpaid');
        setOrderProducts([]);
        console.log('Order updated successfully');
    };
    

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
                                    return (
                                        <li key={index}>
                                            {product.itemName} - {product.quantity} x ₱{product.price.toFixed(2)}
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

export default EditOrderModal;
