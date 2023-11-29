// Popup.js
import React from 'react';

const Popup = ({ isOpen, closePopup, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <div className="popup-wrapper">
        {title && <h3>{title}</h3>}
        <div className="popup-content">
          {children}
        </div>
        <button className="btn" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
