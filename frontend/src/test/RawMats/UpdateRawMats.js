import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../BG/Header';
import Sidebar from '../BG/Sidebar';

function UpdateInventory() {
  const navigate = useNavigate();
  const { matId } = useParams(); // Correctly using matId
  const [rawMats, setRawMats] = useState({
    matName: '',
    quantity: '',
    category: ''
  });
  
  const backClick = () => {
    navigate('/RawMats');
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/updatemats/${matId}`);
        setRawMats(response.data);
      } catch (error) {
        console.log("Error fetching item data: ", error);
      }
    };
    if (matId) {
      fetchItem();
    }
  }, [matId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRawMats(prevInventory => ({
      ...prevInventory,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/updatemats/${matId}`, rawMats);
      navigate('/RawMats');
    } catch (error) {
      console.log("Error updating item data: ", error);
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
                  onChange={handleChange} value={rawMats.matName} /><br />
                      
                <label>Quantity:</label><br />
                  <input type="number" id="quantity" name="quantity"
                  onChange={handleChange} value={rawMats.quantity} min="1" /><br /><br />
                    
                <label>Category:</label><br />
                  <input type="text" id="category" name="category" onChange={handleChange}
                  value={rawMats.category} rows="4" cols="50" /><br />
                    
                  
                    <button className ="btn" type="submit" value="Submit" >Submit</button>
              </form> 
          </div>
        </div>
      </div> 
    </div>
  );
}

export default UpdateInventory;
