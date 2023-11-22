// Popup.js
import React from 'react';

const Popup = ({ isOpen, closePopup, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup-wrapper">
        <button className="close-btn" onClick={closePopup}>Close</button>
        {title && <h3>{title}</h3>}
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
