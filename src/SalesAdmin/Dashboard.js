import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Header from '../BG/SystemAdminHeader';
import Sidebar from '../BG/SystemAdminSidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from "moment";

function Dashboard() {
    return (
        <div className="wrapper">
            <div className='sidebar'>
                <Sidebar />
            </div>
            <div className='main-content'>
                <Header />
            </div>
        </div>
    );
}

export default Dashboard;
