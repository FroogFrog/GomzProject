import React, { useState } from 'react';
import '../css/style.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';
import axios from 'axios';

function AddInventory() {
    const navigate = useNavigate();
    const [rawMats, setRawMats] = useState({
        itemName: '',
        quantity: '',
        category: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRawMats(prevInventory => ({
            ...prevInventory, [name]: value
        }));
    };

    const backClick = () => {
        navigate('/RawMats');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/addmats', {
                itemName: rawMats.itemName,
                category: rawMats.category,
                quantity: rawMats.quantity
            });
            navigate('/RawMats'); // Adjust the path if needed
        } catch (error) {
            console.error('Error adding inventory item:', error);
        }
    };

    return (
        <div className="wrapper">
            <div className='sidebar'>
                <Sidebar />
            </div>
            <div className='main-content'>
                <Header />
                <div className='container'>
                        <div className="content">
                            <button className="btn" onClick={backClick}>Back</button>
                            <form onSubmit={handleSubmit}>
                                <label>Name:</label><br />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={rawMats.itemName}
                                    onChange={handleChange}
                                /><br />

                                <label>Quantity:</label><br />
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={rawMats.quantity}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                /><br />
                                
                                <label>Category:</label><br />
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    required
                                    value={rawMats.category}
                                    onChange={handleChange}
                                /><br /><br />

                                <button className ="btn" type="submit" value="Submit" >Submit</button>
                            </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddInventory;
