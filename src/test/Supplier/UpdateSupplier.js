import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';
import '../css/style.css';

function UpdateSupplier() {
  const navigate = useNavigate();
  const { supplyId } = useParams(); // Use 'id' to match the backend endpoint
  const [supplier, setSupplier] = useState({
    supplyName: '',
    contact: '',
    address: '',
    product: ''
  });
  
  const backClick = () => {
    navigate('/Supplier');
}

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supplier/${supplyId}`);
        setSupplier(response.data);
      } catch (error) {
        console.error("Error fetching supplier data: ", error.response ? error.response.data : error.message);
      }
    };

    if (supplyId) {
      fetchSupplier();
    }
  }, [supplyId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSupplier(prevSupplier => ({
      ...prevSupplier,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        await axios.put(`http://localhost:5000/api/supplier/${supplyId}`, supplier);
        navigate('/supplier');
    } catch (error) {
        console.error("Error updating supplier: ", error.response ? error.response.data : error.message);
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
                required
                value={supplier.contact}
                onChange={handleChange}
              /><br />

              <label>Address:</label><br />
              <input
                type="text"
                id="address"
                name="address"
                required
                value={supplier.address}
                onChange={handleChange}
              /><br />

              <label>Product:</label><br />
              <input
                type="text"
                id="product"
                name="product"
                required
                value={supplier.product}
                onChange={handleChange}
              /><br /><br />

              <button className="btn" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateSupplier;
