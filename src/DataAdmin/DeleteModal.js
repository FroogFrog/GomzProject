// DeleteModal.js
import React from 'react';
import '../css/AddItemModal.css'; // You can style your modal here

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
if (!isOpen) return null;
  return (
    <div id="addModal" className="modal-overlay">
        <div className="modal-content">
            
                <h2>Are you sure you want to delete?</h2>
                <p>This action cannot be undone.</p>
                <button onClick={onConfirm} className="modalBtn confirm">Confirm</button>
                <button onClick={onClose} className="modalBtn cancel">Cancel</button>
            
            
        </div>
    </div>
    
  );
};

export default DeleteModal;
