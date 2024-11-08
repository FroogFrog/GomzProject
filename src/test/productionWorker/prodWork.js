import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';

function ProdWork() { // Capitalize component name
    const [suppliers, setSuppliers] = useState([]); // Correct the state name to match the data
    const navigate = useNavigate();

    const addClick = () => {
        navigate('/ProdWork/add');
    };

    const editClick = (id) => {
        console.log(id);
        navigate(`/supplier/update/${id}`); // Correctly append the ID
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/supplier');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Parse product from JSON if it's a string
            const suppliersWithParsedProduct = data.map(supplier => ({
                ...supplier,
                product: typeof supplier.product === 'string' ? JSON.parse(supplier.product) : supplier.product
            }));
            setSuppliers(suppliersWithParsedProduct); // Correct state setter to match state name
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteSupplier = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/deletesupplier/${id}`);
            console.log(response.data);
            alert("Successfully deleted");
            fetchData();
        } catch (error) {
            console.error('Error deleting supplier:', error);
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
                    STAFF
                    <div className="search-container">
                        <button className="btn" onClick={addClick}>
                            <i className="fa-solid fa-plus"></i> Add
                        </button>
                        <button className="btn" id="sortButton">
                            <i className="fa-solid fa-sort"></i> Sort
                        </button>

                        <div className="search-wrapper">
                            <input type="text" className="search-input" placeholder="Search..." />
                            <i className="fa-solid fa-magnifying-glass search-icon" />
                        </div>
                        <button id="searchButton" className="btn">Search</button>
                    </div>
                    <div className="table-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Station</th> {/* Change "Address" to "Station" */}
                                    <th>Contact No.</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supply, index) => ( // Use the correct state
                                    <tr key={supply.supplyId}> {/* Ensure 'supplyId' is correct */}
                                        <td>{index + 1}</td>
                                        <td>{supply.supplyName}</td> {/* "Name" field */}
                                        <td>{supply.station || 'N/A'}</td> {/* Use 'station' field if it exists, default to 'N/A' */}
                                        <td>{supply.contact}</td> {/* "Contact Number" field */}
                                        <td>
                                            <button className="btn" onClick={() => deleteSupplier(supply.supplyId)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="btn" onClick={() => editClick(supply.supplyId)}>
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

export default ProdWork; // Capitalize component name
