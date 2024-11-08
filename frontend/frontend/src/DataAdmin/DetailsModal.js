import React from 'react';
import '../css/style.css';

const DetailsModal = ({ isOpen, onClose, item, productionDetails }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                {item && (
                    <div>
                        <h2>{item.itemName}</h2>
                        <p><strong>Status:</strong> {item.status}</p>
                        <p><strong>Last Updated:</strong> {item.lastUpdated}</p>
                        <h3>Production Details</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity Produced</th>
                                    <th>Date</th>
                                    <th>Staff</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionDetails.length > 0 ? (
                                    productionDetails.map((prod) => (
                                        <tr key={prod.productionId}>
                                            <td>{item.itemName}</td>
                                            <td>{prod.quantityProduced}</td>
                                            <td>{prod.productionDate}</td>
                                            <td>{prod.staffName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No production details available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsModal;
