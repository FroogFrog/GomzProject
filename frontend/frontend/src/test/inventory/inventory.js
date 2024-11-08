import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { Link , useNavigate} from 'react-router-dom';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Inventory() {
    const [inventory, setInventory] = useState([]);
    const navigate = useNavigate();

    const addClick = () => {
        navigate('/inventory/add'); // Replace '/target-route' with the route you want to navigate to
    };

    const editClick = (id) => {
        navigate(`/inventory/update/${id}`); // Replace '/target-route' with the route you want to navigate to  
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/inventory'); // Or '/api/inventory' if proxy is configured
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setInventory(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/deleteinventory/${id}`);
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
                    INVENTORY
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
                                    <th>Item Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item, index) => (
                                    <tr key={item.itemId}>
                                        <td>{index + 1}</td>
                                        <td>{item.itemName}</td>
                                        <td>₱{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            <button className="btn" onClick={() => deleteItem(item.itemId)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="btn" onClick={() => editClick(item.itemId)}>
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

export default Inventory;
