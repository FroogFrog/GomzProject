import React, { useEffect, useState } from "react";
import Header from "../BG/Header";
import Sidebar from "../BG/Sidebar";
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../css/style.css';

function RawMats(){
    const [rawMats, setRawMats] = useState([]);
    const navigate = useNavigate();

    const addClick = () => {
        navigate('/RawMats/add'); // Replace '/target-route' with the route you want to navigate to
    };

    const editClick = (id) => {
        navigate(`/RawMats/update/`+id); // Replace '/target-route' with the route you want to navigate to  
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rawmats'); // Adjust the URL if necessary
            setRawMats(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/deletemats/${id}`);
            console.log(response.data);
            alert("Successfully deleted")
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
                    RAW MATERIALS
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
                                    <th>Quantity</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rawMats.map((mats, index) => (
                                    <tr key={mats.matsId}>
                                        <td>{index + 1}</td>
                                        <td>{mats.matName}</td>
                                        <td>{mats.quantity}</td>
                                        <td>{mats.category}</td>
                                        <td>
                                            <button className="btn" onClick={() => deleteItem(mats.matsId)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <button className="btn" onClick={() => editClick(mats.matsId)}>
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

export default RawMats;
