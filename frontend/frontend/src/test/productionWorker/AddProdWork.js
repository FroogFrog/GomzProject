import React, { useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';

function AddProdWork() {
    const navigate = useNavigate();
    
    const [supplier, setSupplier] = useState({
        supplyName: '',
        contact: '',
        address: '',
        product: '' // Will be a comma-separated string
    });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setSupplier((prevSupplier) => ({
            ...prevSupplier,
            [name]: value
        }));
    };

    const backClick = () => {
        navigate('/supplier');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const productArray = supplier.product.split(',').map(item => item.trim()); // Convert string to array
            await axios.post('http://localhost:5000/api/addsupplier', {
                ...supplier,
                product: productArray // Send array to backend
            });
            navigate('/supplier');
        } catch (error) {
            console.error("Error adding supplier: ", error.response ? error.response.data : error.message);
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
                            <label>Supplier Name:</label><br />
                            <input
                                type="text"
                                id="supplyName"
                                name="supplyName"
                                required
                                value={supplier.supplyName}
                                onChange={handleChange}
                            /><br />

                            <label>Contact Number:</label><br />
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                value={supplier.contact}
                                onChange={handleChange}
                                required
                            /><br />

                            <label>Address:</label><br />
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={supplier.address}
                                onChange={handleChange}
                                required
                            /><br />

                            <label>Product (comma-separated):</label><br />
                            <input
                                type="text"
                                id="product"
                                name="product"
                                value={supplier.product}
                                onChange={handleChange}
                                required
                            /><br /><br />

                            <button className="btn" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProdWork;
