import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css'; // You can style your modal here

function RawMatsDetailsModal({ isOpen, onClose, rawMat }) {
    const [RawMatsDetails, setRawMatsDetails] = useState([]);

    useEffect(() => {
        if (isOpen && rawMat) {
            fetchRawMatsDetails(rawMat.matId); // Fetch RawMatsDetails when the modal is opened and an rawMat is selected
        }
    }, [isOpen, rawMat]);

    const fetchRawMatsDetails = async (matId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/rawmatsinv/${matId}`);
            setRawMatsDetails(response.data);
        } catch (error) {
            console.error('Error fetching details:', error);
        }    };

    if (!isOpen || !rawMat) {
        return null; // Don't render the modal if it is not open or no rawMat is selected
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Raw Materials Details for {rawMat.matName}</h2>
                <table className='modal-table'>
                    <thead>
                        <tr>
                            <td>#</td>
                            <th>Batch ID</th>
                            <th>Quantity</th>
                            <th>Date</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RawMatsDetails.map((detail, index) => (
                            <tr key={detail.matId}>
                                <td>{index + 1}</td>
                                <td>{'Batch#' + detail.inventoryId}</td>
                                <td>{detail.quantity}</td>
                                <td>{new Date(detail.date).toLocaleDateString()}</td>
                                <td>{new Date(detail.lastUpdated).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default RawMatsDetailsModal;
