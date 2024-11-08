import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Header from '../BG/SalesAdminHeader';
import Sidebar from '../BG/SalesAdminSidebar';
import axios from 'axios';
import moment from "moment";

function Dashboard() {
    const [chartUrl, setChartUrl] = useState('');
    const [selectedRange, setSelectedRange] = useState('week'); // default to 'week'
    const [rangeData, setRangeData] = useState([]);
    
    const fetchOrderSummary = async (range) => {
        try {
            let startDate, endDate;
            let labels = [];
    
            // Handle "This Week" selection
            if (range === 'week') {
                startDate = moment().startOf('week').format('YYYY-MM-DD');
                endDate = moment().endOf('week').format('YYYY-MM-DD');
                labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            }
    
            // Handle "This Month" selection
            if (range === 'month') {
                startDate = moment().startOf('month').format('YYYY-MM-DD');
                endDate = moment().endOf('month').format('YYYY-MM-DD');
                
                // Generate labels for each day of the current month
                const daysInMonth = moment().daysInMonth();
                labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
            }
    
            // Fetch orders from the API within the selected date range
            const response = await axios.get('http://localhost:5000/api/sales/summary', {
                params: { range, startDate, endDate }
            });
    
            const orderData = response.data;
    
            // Prepare data for the chart
            const data = labels.map(label => {
                const dayData = orderData.find(order => order.day_of_month === parseInt(label));
                return dayData ? dayData.order_count : 0; // Return order count for the day or 0 if no orders
            });
    
            // Generate the QuickChart URL
            const url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Delivered Orders by Day',
                        data: data,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }]
                },
                options: {
                    scales: {
                        x: { title: { display: true, text: range === 'week' ? 'Day of Week' : 'Day of Month' } },
                        y: { beginAtZero: true, title: { display: true, text: 'Number of Orders' } }
                    },
                    plugins: {
                        legend: { display: true, position: 'top' }
                    }
                }
            }))}`;
    
            setChartUrl(url); // Set the chart URL for rendering
            setRangeData(orderData); // Save order data for further processing if needed
        } catch (error) {
            console.error('Error fetching order summary:', error);
        }
    };
    
    

    useEffect(() => {
        fetchOrderSummary(selectedRange);
    }, [selectedRange]);

    // Function to handle range change
    const handleRangeChange = (event) => {
        setSelectedRange(event.target.value);
    };

    return (
        <div className="container">
            <Sidebar />
            <Header />
            <div className="main-content">
                <div className="page-title">Delivered Orders Overview</div>
                
                {/* Date Range Selector */}
                <div className="range-selector">
                    <select onChange={handleRangeChange} value={selectedRange}>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                <div className="chart-container">
                    {chartUrl && (
                        <img src={chartUrl} alt="Delivered Orders Chart" style={{ maxWidth: '80%', height: 'auto' }} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
