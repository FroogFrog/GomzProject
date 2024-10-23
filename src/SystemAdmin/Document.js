import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from "moment";
import '@fortawesome/fontawesome-free/css/all.min.css';

function Document() {
    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className="main-content">
                <div className="page-title">DOCUMENT</div>
                <div className="info">
                    <div className="above-table">
                        <div className="above-table-wrapper">
                            <button title="Add File" id="addBtn "className="btn">
                            <i className="fa-solid fa-add"></i>Add
                            </button>
                            <button title="Delete" id="deleteBtn" className="btn">
                                <i className="fa-solid fa-trash-can"></i> Delete
                            </button>
                            <button id="sortBtn" className="btn">
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
                                    <th>
                                        <input type="checkbox" id="selectAllCheckbox" />
                                    </th>
                                    <th></th>
                                    <th>File Name</th>
                                    <th>Tags</th>
                                    <th>Date Uploaded</th>
                                    <th>Expiration Date</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-list">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="checkbox" className="selectCheckbox" />
                                    </td>
                                    <td>1</td>
                                    <td>Business Licence DTI Permit for Renewal.pdf</td>
                                    <td>Licence</td>
                                    <td>2-24-2023</td>
                                    <td>7-30-2026</td>
                                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td>
                                    <td>
                                        <button className="btn">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                        <button className="btn" >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
    );
}

export default Document;
