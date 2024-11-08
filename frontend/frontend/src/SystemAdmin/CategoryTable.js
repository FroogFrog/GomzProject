import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';

function CategoryTable() {
    const [documentCategories, setDocumentCategories] = useState([]);
    const [inventoryCategories, setInventoryCategories] = useState([]);
    const [rawMaterialCategories, setRawMaterialCategories] = useState([]);

    useEffect(() => {
        // Fetch categories from backend when component mounts
        axios.get('http://localhost:5000/api/categories')
        .then(response => {
            const documents = response.data.filter(cat => cat.type === 'Document');
            const inventoryItems = response.data.filter(cat => cat.type === 'Inventory');
            const rawMaterials = response.data.filter(cat => cat.type === 'RawMaterial');
    
            setDocumentCategories(documents);
            setInventoryCategories(inventoryItems);
            setRawMaterialCategories(rawMaterials);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
    
    }, []);

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className='main-content'>
            <div className="page-title">Products</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn" >
                                <i className="fa-solid fa-add"></i> Add
                            </button>
                            <button className="btn" id="sortButton">
                                <i className="fa-solid fa-sort"></i> Sort
                            </button>
                        </div>
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search..."
                                    size="40"
                                />
                            </div>
                            <div>
                                <button id="searchButton" className="btn">Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="t-head">
                        <table className="table-head">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Category Name</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                {documentCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan="2">No document categories available</td>
                                    </tr>
                                ) : (
                                    documentCategories.map((category,index) => (
                                        <tr key={category.id}>
                                            <td>{index+1}</td>
                                            <td>{category.categoryName}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            <div className="page-title">Inventory Category</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn" >
                                <i className="fa-solid fa-add"></i> Add
                            </button>
                            <button className="btn" id="sortButton">
                                <i className="fa-solid fa-sort"></i> Sort
                            </button>
                        </div>
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search..."
                                    size="40"
                                />
                            </div>
                            <div>
                                <button id="searchButton" className="btn">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="t-head">
                    <table className="table-head">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Category Name</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="table-list">
                    <table>
                        <tbody>
                            {inventoryCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="2">No inventory categories available</td>
                                </tr>
                            ) : (
                                inventoryCategories.map((category,index) => (
                                    <tr key={category.id}>
                                        <td>{index+1}</td>
                                        <td>{category.categoryName}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                    
                    
                <div className="page-title">Inventory Category</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button className="btn" >
                                <i className="fa-solid fa-add"></i> Add
                            </button>
                            <button className="btn" id="sortButton">
                                <i className="fa-solid fa-sort"></i> Sort
                            </button>
                        </div>
                        <div className="search-container">
                            <div className="search-wrapper">
                                <label>
                                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search..."
                                    size="40"
                                />
                            </div>
                            <div>
                                <button id="searchButton" className="btn">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="t-head">
                    <table className="table-head">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Category Name</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="table-list">
                    <table>
                        <tbody>
                            {rawMaterialCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="2">No raw material categories available</td>
                                </tr>
                            ) : (
                                rawMaterialCategories.map((category,index) => (
                                    <tr key={category.id}>
                                        <td>{index+1}</td>
                                        <td>{category.categoryName}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
    );
}

export default CategoryTable;