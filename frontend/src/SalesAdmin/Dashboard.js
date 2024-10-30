import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Header from '../BG/SalesAdminHeader';
import Sidebar from '../BG/SalesAdminSidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from "moment";

function Dashboard() {
    return (
        <div className="container">
            <Sidebar />
            <Header />
        </div>
    );
}

export default Dashboard;
