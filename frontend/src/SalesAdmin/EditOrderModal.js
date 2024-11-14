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
    const [batches, setBatches] = useState([]);  // State for batches
    const [inventory, setInventory] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');  // State for selected batch
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
        if (selectedItemId) {
            // Fetch inventory data for the selected item
            const fetchInventory = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/inventory-by-items/${selectedItemId}`);
                    setInventory(response.data); // Assuming response contains batch data
                    setSelectedBatch(''); // Reset batch when item changes
                } catch (error) {
                    console.error('Error fetching inventory data:', error);
                }
            };
            fetchInventory();
        }
    }, [selectedItemId]);

    useEffect(() => {
        if (isOpen && order && items.length > 0 && !isOrderInitialized) {
            setCustomerName(order.customerName || '');
            setLocation(order.location || '');
            setModeOfPayment(order.modeOfPayment || '');
            setPaymentStatus(order.paymentStatus || 'unpaid');

            if (order.itemNames && order.quantities) {
                const itemNamesArray = order.itemNames.split(', ');
                const itemQuantitiesArray = order.quantities.split(', ');
                console.log(order.inventoryId)
                const itemBatchesArray = order.inventoryId.split(', ');

                const itemsList = itemNamesArray.map((itemName, index) => {
                    const item = items.find(item => item.itemName === itemName) || {};
                    const quantity = itemQuantitiesArray[index] || '0';
                    const batch = itemBatchesArray[index] || '0';
                    return {
                        itemId: item.itemId || null,
                        itemName: item.itemName || '',
                        quantity,
                        price: item.price || 0,
                        inventoryId: batch || ''
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
            fetchBatches(selectedItemId);  // Fetch batches when item changes
        }
    }, [selectedItemId, items]);

    const fetchBatches = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/batches?itemId=${itemId}`);
            setBatches(response.data);
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    const calculateTotalPrice = (products) => {
        const totalPrice = products.reduce((total, product) => total + (product.quantity * product.price), 0);
        setTotal(totalPrice);
    };

    if (!isOpen) return null;

    const addProductToOrder = () => {
        if (selectedItemId && quantity > 0 && selectedBatch) {
            const selectedItemIdNumber = Number(selectedItemId);
            if (!orderProducts.some(item => item.itemId === selectedItemIdNumber)) {
                const selectedItem = items.find(item => item.itemId === selectedItemIdNumber);
                const product = {
                    itemId: selectedItemIdNumber,
                    itemName: selectedItem?.itemName || '',
                    quantity,
                    price: selectedItem?.price || 0,
                    batch: selectedBatch  // Include selected batch
                };
                const updatedProducts = [...orderProducts, product];
                console.log(updatedProducts)
                setOrderProducts(updatedProducts);
                setQuantity('');
                setSelectedItemId('');
                setSelectedBatch('');
                calculateTotalPrice(updatedProducts);
            } else {
                alert('This product has already been added.');
            }
        } else {
            alert('Please select a product, batch, and enter a quantity.');
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
                batch: product.batch,  // Include batch in order details
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
                        {selectedItemId && (
                            <>
                                <select
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    required
                                >
                                    <option value="">Select Batch</option>
                                    {inventory.map(batch => (
                                        <option key={batch.inventoryId} value={batch.inventoryId}>
                                            Batch#{batch.inventoryId} - Quantity: {batch.quantity}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Quantity"
                            required
                            max={inventory.find(batch => batch.inventoryId === selectedBatch)?.quantity || 0}
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
                                            {item ? item.itemName : 'Product not found'} - Batch#{product.batch}  ({product.quantity}) x ₱{item.price.toFixed(2)}
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
