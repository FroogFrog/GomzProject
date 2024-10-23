import React, { useState, useEffect, useRef } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // useParams to get deliveryId from route
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';

function UpdateSupDeli() {
    const navigate = useNavigate();
    const { deliveryId } = useParams(); // Get the deliveryId from the route

    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [delivery, setDelivery] = useState({
        supplyId: '',
        itemName: '',
        quantity: '',
        cost: '',
        date: '',
    });

    // Refs to track if suppliers and delivery have been initialized
    const suppliersLoaded = useRef(false);
    const initialFetchComplete = useRef(false);

    // Date formatting function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Convert to yyyy-MM-dd format
    };

    const getSupplier = async () => {
        console.log("getSupplier called");
        try {
            console.log("Fetching suppliers...");
            const response = await axios.get('http://localhost:5000/api/supplier'); // Ensure endpoint matches backend
            console.log("Suppliers fetched:", response.data);
            setSuppliers(response.data);
            suppliersLoaded.current = true; // Mark suppliers as loaded
        } catch (error) {
            console.error('Error fetching suppliers: ', error);
        }
    };

    // Fetch the existing delivery details by ID
    useEffect(() => {
        console.log("useEffect triggered for deliveryId:", deliveryId);
        // Only fetch once to prevent double fetching
        if (!initialFetchComplete.current) {
            getSupplier();

            const fetchDelivery = async () => {
                console.log("fetchDelivery called");
                try {
                    console.log(`Fetching delivery with ID: ${deliveryId}`);
                    const response = await axios.get(`http://localhost:5000/api/supplydelivery/${deliveryId}`);
                    console.log("Delivery fetched:", response.data);
                    setDelivery({
                        ...response.data,
                        date: formatDate(response.data.date), // Format the date
                    });
                    initialFetchComplete.current = true; // Mark initial fetch as complete
                } catch (error) {
                    console.error('Error fetching delivery details:', error);
                }
            };

            if (deliveryId) {
                fetchDelivery();
            } else {
                console.warn('deliveryId is undefined');
            }
        }
    }, [deliveryId]);

    // Trigger handleSupplierChange when both suppliers and delivery data are available
    useEffect(() => {
        console.log("useEffect for suppliers and delivery:", { suppliers, delivery });

        // Ensure suppliers are loaded and delivery has a valid supplyId
        if (suppliersLoaded.current && delivery.supplyId) {
            console.log("Triggering handleSupplierChange with supplyId:", delivery.supplyId);
            handleSupplierChange({ target: { value: delivery.supplyId } });
            suppliersLoaded.current = false; // Reset to prevent re-triggering
        }
    }, [suppliers, delivery.supplyId]);

    // Fetch items/products when the supplier changes
    const handleSupplierChange = async (event) => {
        console.log("handleSupplierChange called with value:", event.target.value);
        const { value } = event.target;

        // Ensure suppliers are loaded
        if (suppliers.length === 0) {
            console.warn('Suppliers not yet loaded:', suppliers);
            return;
        }

        // Find the selected supplier
        const selectedSupplier = suppliers.find(
            (s) => parseInt(s.supplyId, 10) === parseInt(value, 10) // Ensure consistent type comparison
        );

        if (selectedSupplier) {
            console.log("Selected supplier found:", selectedSupplier);
            setDelivery((prevState) => ({
                ...prevState,
                supplyId: selectedSupplier.supplyId,
                itemName: '',
            }));

            let productsArray;
            try {
                // Parse the products if it's a string
                if (Array.isArray(selectedSupplier.product)) {
                    productsArray = selectedSupplier.product;
                } else if (typeof selectedSupplier.product === 'string') {
                    productsArray = JSON.parse(selectedSupplier.product);
                } else {
                    productsArray = [];
                }
                console.log("Parsed products array:", productsArray);
            } catch (error) {
                console.error('Error parsing products:', error);
                productsArray = [];
            }

            setItems(productsArray);
        } else {
            // Log more details to help debugging
            console.warn('No supplier found with the given supplierId:', value);
            console.warn('Available suppliers:', suppliers);
            setItems([]);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(`handleChange: Setting ${name} to ${value}`);
        setDelivery((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handleSubmit: Submitting delivery:", delivery);
        try {
            await axios.put(`http://localhost:5000/api/updatesupplydelivery/${deliveryId}`, delivery);
            console.log("Update successful, navigating to /SupplyDeliveries");
            navigate('/SupplyDeliveries');
        } catch (error) {
            console.error('Error updating supply delivery: ', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const backClick = () => {
        console.log("Back button clicked, navigating to /SupplyDeliveries");
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

                            <button className="btn" type="submit">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateSupDeli;
