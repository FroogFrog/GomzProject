import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';
import '../css/style.css';

function UpdateInventory() {
  const navigate = useNavigate();
  const { itemId } = useParams(); // Assuming userId is the parameter in the route
  
  const [inventory, setInventory] = useState({
    category: '',
    price: 0,
    quantity: 1,
    itemName: '',

  });
  
  const backClick = () => {
    navigate('/inventory');
  }

  useEffect(() => {
    const fetchItem = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/updateinventory/${itemId}`);            
            const itemData = response.data;
            setInventory(itemData);
        } catch (error) {
            console.log("Error fetching item data: ", error);
        }
    };
    
    if (itemId) {
        fetchItem();
    }
}, [itemId]);




  const handleChange = (event) => {
    const { name, value } = event.target;
    setInventory(prevInventory => ({
      ...prevInventory,
      [name]: value
    })); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/updateinventory/${itemId}`, inventory);
      navigate("/inventory");
    } catch (error) {
      console.error("Error updating inventory item: ", error);
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
                  <input type="text" id="itemName" name="itemName" required
                  onChange={handleChange} value={inventory.itemName} /><br />
                    
                <label>Price:</label><br />
                  <input type="number" id="price" name="price"
                  onChange={handleChange} value={inventory.price} min="0" step="0.01" /><br />
                    
                <label>Quantity:</label><br />
                  <input type="number" id="quantity" name="quantity"
                  onChange={handleChange} value={inventory.quantity} min="1" /><br /><br />
                    
                <label>Category:</label><br />
                  <input type="text" id="category" name="category" onChange={handleChange}
                  value={inventory.category} rows="4" cols="50" /><br />
                    
                  
                    <button className ="btn" type="submit" value="Submit" >Submit</button>
              </form> 
          </div>
        </div>
      </div> 
    </div>
  );
}

export default UpdateInventory;