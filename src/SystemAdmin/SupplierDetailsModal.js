import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AddItemModal.css'; // You can style your modal here

function SupplierDetailsModal({ isOpen, onClose, supplier }) {
    const [supplierDetails, setSupplierDetails] = useState([]);

    useEffect(() => {
        if (isOpen && supplier) {
            fetchSupplierDetails(supplier.supplyId);
        }
    }, [isOpen, supplier]);

    const fetchSupplierDetails = async (supplyId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/supDeli/${supplyId}`);
            setSupplierDetails(response.data);
        } catch (error) {
            console.error('Error fetching supplier details:', error);
        }
    };

    if (!isOpen || !supplier) {
        return null; // Don't render if the modal is not open
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Supplier Deliveries for {supplier.supplyName}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Material Name</th>
                            <th>Quantity</th>
                            <th>Cost</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supplierDetails.map((detail, index) => (
                            <tr key={detail.supDeliId}>
                                <td>{index + 1}</td>
                                <td>{detail.matName}</td>
                                <td>{detail.quantity}</td>
                                <td>{detail.cost}</td>
                                <td>{new Date(detail.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default SupplierDetailsModal;
