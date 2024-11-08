import React, { useState, useEffect } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';

function AddSupDeli() {
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]); // Ensure this is initialized as an array
    const [delivery, setDelivery] = useState({
        supplyId: '',
        itemName: '',
        quantity: '',
        cost: '',
        date: new Date().toISOString().split('T')[0], // Initialize with today's date
    });

    useEffect(() => {
        // Fetch all suppliers for the dropdown
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/supplier'); // Ensure endpoint matches backend
                setSuppliers(response.data);
            } catch (error) {
                console.error('Error fetching suppliers: ', error);
            }
        };

        fetchSuppliers();
    }, []);

    // Fetch items/products when the supplier changes
    const handleSupplierChange = async (event) => {
        const { value } = event.target;
    
    
        // Find the selected supplier
        const selectedSupplier = suppliers.find((s) => s.supplyId === parseInt(value, 10));
    
    
        // Update the supplyId and item names in state
        if (selectedSupplier) {
            setDelivery((prevState) => ({
                ...prevState,
                supplyId: selectedSupplier.supplyId, // Save the supplyId
                itemName: '', // Reset itemName when the supplier changes
            }));
    
            let productsArray;
            try {
                // Check if `product` is already an array
                if (Array.isArray(selectedSupplier.product)) {
                    productsArray = selectedSupplier.product;
                } else if (typeof selectedSupplier.product === 'string') {
                    // If it's a string, attempt to parse it as JSON
                    productsArray = JSON.parse(selectedSupplier.product);
                } else {
                    // If neither, fallback to an empty array
                    productsArray = [];
                }
            } catch (error) {
                console.error('Error parsing products:', error);
                productsArray = []; // Default to an empty array if parsing fails
            }
    
            // Set the items state
            setItems(productsArray);
        } else {
            // Log if the supplier was not found
            console.warn('No supplier found with the given supplierId.');
            setItems([]); // Clear items if no supplier is found
        }
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setDelivery((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log('Submitting delivery:', delivery); // Log delivery data before sending
            await axios.post('http://localhost:5000/api/addsupplydelivery', delivery);
            navigate('/SupplyDeliveries');
        } catch (error) {
            console.error('Error adding supply delivery: ', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Request data:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
        }
    };

    const backClick = () => {
        navigate('/SupplyDeliveries');
    };

    return (
        <div className="wrapper">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="main-content">
                <Header />
                <div className="container">
                    <div className="content">
                        <button className="btn" onClick={backClick}>Back</button>
                        <form onSubmit={handleSubmit}>
                            <label>Supplier Name:</label><br />
                            <select
                                id="supplierId"
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
                            </select><br />

                            <label>Item Name:</label><br />
                            <select
                                id="itemName"
                                name="itemName"
                                required
                                value={delivery.itemName}
                                onChange={handleChange}
                            >
                                <option value="">Select an item</option>
                                {items.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select><br />

                            <label>Quantity:</label><br />
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                required
                                value={delivery.quantity}
                                onChange={handleChange}
                            /><br />

                            <label>Cost:</label><br />
                            <input
                                type="number"
                                id="cost"
                                name="cost"
                                required
                                value={delivery.cost}
                                onChange={handleChange}
                            /><br />

                            <label>Date:</label><br />
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={delivery.date}
                                readOnly // Makes the input field read-only
                            /><br /><br />

                            <button className="btn" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSupDeli;
