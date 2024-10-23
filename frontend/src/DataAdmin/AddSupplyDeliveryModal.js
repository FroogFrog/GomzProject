import React, { useState } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css'; // You can style your modal here

const AddSupplyDeliveryModal = ({ isOpen, onClose, suppliers, onAdd }) => {
    const [supplyId, setSupplyId] = useState('');
    const [items, setItems] = useState([]); // Dynamically updated items list
    const [matId, setMatId] = useState(''); // ID of the selected raw material
    const [itemName, setItemName] = useState(''); // Selected item name
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set default date to today

    // Fetch items based on the selected supplier
    const handleSupplierChange = async (e) => {
        const selectedSupplyId = e.target.value;
        setSupplyId(selectedSupplyId);
        console.log('Selected Supplier ID:', selectedSupplyId);
    
        const selectedSupplier = suppliers.find((s) => s.supplyId === parseInt(selectedSupplyId, 10));
    
        if (selectedSupplier) {
            try {
                const response = await axios.get(`http://localhost:5000/api/getrawmaterials/${selectedSupplyId}`);
                console.log('API Response:', response.data); // Log the API response
    
                // Check if response data is in the expected format
                if (Array.isArray(response.data)) {
                    const fetchedItems = response.data.map(item => ({
                        id: item.matId, // Ensure this is correctly defined
                        name: item.matName  // Ensure this is correctly defined
                    }));
                    console.log('Fetched Items:', fetchedItems); // Log the fetched items
    
                    setItems(fetchedItems);
                    setItemName(''); // Reset item selection when supplier changes
                    setMatId(''); // Reset matId when supplier changes
                } else {
                    console.error('Unexpected response format:', response.data);
                    setItems([]); // Clear items if the format is unexpected
                }
            } catch (error) {
                console.error('Error fetching raw materials:', error);
                setItems([]); // Clear items on error
            }
        } else {
            setItems([]); // Clear items if no supplier found
        }
    };
    
    const handleItemChange = (e) => {
        const selectedItemName = e.target.value;
        setItemName(selectedItemName);
        console.log('Selected Item Name:', selectedItemName); // Log the selected item name

        // Find the matId corresponding to the selected itemName
        const selectedItem = items.find(item => item.name === selectedItemName);
        console.log('Selected Item:', selectedItem); // Log the selected item
        setMatId(selectedItem ? selectedItem.id : ''); // Set matId or reset if not found
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the new supply delivery object
        const newSupplyDelivery = { 
            supplyId, 
            matId, // Use matId here
            quantity, 
            cost, 
            date 
        };

        console.log('Submitting new supply delivery:', newSupplyDelivery); // Log submission data

        // Make POST request to add supply delivery
        try {
            await axios.post('http://localhost:5000/api/addsupplydelivery', newSupplyDelivery);
            onAdd(); // Refresh data after adding
            onClose(); // Close modal after successful add
        } catch (error) {
            console.error('Error adding supply delivery:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div id="addModal" className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Supply Delivery</h2>
                <form onSubmit={handleSubmit} id="addForm">
                    <div className="form-group">
                        <label htmlFor="supplier">Supplier:</label>
                        <select
                            id="supplier"
                            value={supplyId}
                            onChange={handleSupplierChange}
                            required
                        >
                            <option value="" disabled>Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.supplyId} value={supplier.supplyId}>
                                    {supplier.supplyName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="item">Item:</label>
                        <select
                            id="item"
                            value={itemName} // Use itemName for the item selection
                            onChange={handleItemChange} // Set itemName and find matId
                            required
                        >
                            <option value="" disabled>Select Item</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.name}> {/* Set the value to the item name */}
                                    {item.name} {/* Display the name */}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cost">Cost:</label>
                        <input
                            type="number"
                            id="cost"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="modalBtn">Add Supply Delivery</button>
                </form>
            </div>
        </div>
    );
};

export default AddSupplyDeliveryModal;
