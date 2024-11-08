import React, { useState } from 'react';
import '../css/style.css';
import axios from 'axios'; // For making HTTP requests
import { useNavigate , Link} from 'react-router-dom';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';

function AddInventory() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState({
        name: '',
        price: '',
        quantity: '',
        category: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInventory(prevInventory => ({
            ...prevInventory, [name]: value
        }));
    };

    
    const backClick = () => {
        navigate('/inventory');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/addinventory', {
                itemName: inventory.name,
                price: inventory.price,
                quantity: inventory.quantity,
                category: inventory.category // Make sure category is included if needed
            });
            navigate('/inventory');
        } catch (error) {
            console.error("Error adding inventory item: ", error.response ? error.response.data : error.message);
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
                                        value={inventory.name}
                                        onChange={handleChange}
                                    /><br />

                                    <label>Price:</label><br />
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={inventory.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        required
                                    /><br />

                                    <label>Quantity:</label><br />
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={inventory.quantity}
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
                                        value={inventory.category}
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
