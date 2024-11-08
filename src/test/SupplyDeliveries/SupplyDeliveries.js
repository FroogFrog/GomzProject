import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';

function SupplyDeliveries() {
    const [supDeli, setSupDeli] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    const addClick = () => {
        navigate('/SupplyDeliveries/add'); // Replace '/target-route' with the route you want to navigate to
    };

    const editClick = (id) => {
        navigate(`/supDeli/update/${id}`); // Replace '/target-route' with the route you want to navigate to  
    };

    const getSupply = (id) => {
        const supplier = suppliers.find(supplier => supplier.supplyId === id); // Use the exact field name from the API response
        return supplier ? supplier.supplyName : 'Unknown Supplier'; // Adjust 'supplyName' if needed
    };

    const getItem = (id) => {
        const item = items.find(item => item.itemId === id); // Use the exact field name from the API response
        return item ? item.itemName : 'Unknown Item'; // Adjust 'itemName' if needed
    };

    // Function to format date to MM-DD-YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/supDeli');
            const response2 = await fetch('http://localhost:5000/api/supplier');
            const response3 = await fetch('http://localhost:5000/api/inventory');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const data2 = await response2.json();
            const data3 = await response3.json();

            setSupDeli(data);
            setSuppliers(data2);
            setItems(data3);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/deleteSupDeli/${id}`);
            console.log(response.data);
            alert("Successfully deleted");
            // Reload the data after deletion
            fetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="wrapper">
            <div className='sidebar'>
                <Sidebar />
            </div>
            <div className='main-content'>
                <Header />
                <div className="info">
                    SUPPLY DELIVERY
                    <div className="search-container">
                        <button className="btn" onClick={addClick}>
                            <i className="fa-solid fa-add"></i>Add
                        </button>
                        <button className="btn" id="sortButton">
                            <i className="fa-solid fa-sort"></i> Sort
                        </button>

                        <div className="search-wrapper">
                            <input type="text" className="search-input" placeholder="Search..." />
                            <i className="fa-solid fa-magnifying-glass search-icon"/>
                        </div>
                        <button id="searchButton" className="btn">Search</button>
                    </div>
                    <div className="table-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Supplier Name</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Cost</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {supDeli.map((supDeli, index) => (
                                    <tr key={supDeli.supDeliId}>
                                        <td>{index + 1}</td>
                                        <td>{getSupply(supDeli.supplyId)}</td>
                                        <td>{supDeli.itemName}</td>
                                        <td>{supDeli.quantity}</td>
                                        <td>₱{supDeli.cost}</td>
                                        <td>{formatDate(supDeli.date)}</td>
                                        <td>
                                            <button className="btn" onClick={() => deleteItem(supDeli.supDeliId)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="btn" onClick={() => editClick(supDeli.supDeliId)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplyDeliveries;
