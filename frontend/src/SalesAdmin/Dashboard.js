import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Header from '../BG/SalesAdminHeader';
import Sidebar from '../BG/SalesAdminSidebar';
import axios from 'axios';
import moment from 'moment';

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
    
                // Generate labels with both day names and dates for the current week
                labels = Array.from({ length: 7 }, (_, i) => {
                    const date = moment().startOf('week').add(i, 'days');
                    return `${date.format('dddd')} (${date.format('MM/DD')})`; // e.g., "Monday (09/11)"
                });
            }
    
            // Handle "This Month" selection
            if (range === 'month') {
                startDate = moment().startOf('month').format('YYYY-MM-DD');
                endDate = moment().endOf('month').format('YYYY-MM-DD');
    
                // Generate labels for each day of the current month
                const daysInMonth = moment().daysInMonth();
                labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
            }
    
            // Handle "This Year" selection
            if (range === 'year') {
                startDate = moment().startOf('year').format('YYYY-MM-DD');
                endDate = moment().endOf('year').format('YYYY-MM-DD');
                labels = moment.months(); // Get the names of all months (January, February, etc.)
            }
    
            // Fetch orders from the API within the selected date range
            const response = await axios.get('http://localhost:5000/api/sales/summary', {
                params: { range, startDate, endDate }
            });
    
            const orderData = response.data;
    
            // Prepare data for the chart based on the selected range
            const data = labels.map((label, index) => {
                if (range === 'week') {
                    const dayData = orderData.find(order => order.day_of_week === index);
                    return dayData ? dayData.order_count : 0;
                }

                if (range === 'month') {
                    const dayData = orderData.find(order => order.day_of_month === parseInt(label));
                    return dayData ? dayData.order_count : 0;
                }

                if (range === 'year') {
                    const monthData = orderData.find(order => order.month_of_year === index + 1);
                    return monthData ? monthData.order_count : 0;
                }

                return 0; // Fallback in case of unexpected range
            });

    
            // Generate the QuickChart URL for the chart
            const url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
                type: 'bar',
                data: {
                    labels: [...labels, ''],  // Add '0' at the end of the labels
                    datasets: [{
                        label: 'Sales this ' + (range === 'year' ? 'Year' : range.charAt(0).toUpperCase() + range.slice(1)),
                        data: [...data, 0],  // Add 0 at the end of the data
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }]
                },
                options: {
                    scales: {
                        x: { 
                            beginAtZero: true, 
                            title: { 
                                display: true, 
                                text: range === 'week' ? 'Day (Date)' : range === 'month' ? 'Day of Month' : 'Month' 
                            },
                            ticks: {
                                stepSize: 1, // Ensure steps are in whole numbers
                                callback: function(value) {
                                    return value % 1 === 0 ? value : ''; // Ensure only integers are shown
                                }
                            }
                        },
                        y: { 
                            beginAtZero: true, 
                            title: { 
                                display: true, 
                                text: 'Number of Orders' 
                            },
                            ticks: {
                                callback: function(value) {
                                    return value % 1 === 0 ? value : ''; // Ensure only integers are shown
                                },
                                min: 0  // Force Y-axis to start from 0
                            }
                        }
                    },
                    plugins: {
                        legend: { 
                            display: true, 
                            position: 'top' 
                        }
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
