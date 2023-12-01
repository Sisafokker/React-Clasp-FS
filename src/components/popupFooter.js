// src/components/popupFooter.js
import React from 'react';

const PopupFooter = ({ props_isOpen, props_closePopup, props_title, children }) => {
  if (!props_isOpen) return null;

  return (
    <div className="fpopup-container">
      <div className="fpopup-header">
      <h2>Developer's Notes</h2>
        {props_title && <h3>{props_title}</h3>}
        <div className="fpopup-content">
          {children}
        </div>
        <button className="btn" onClick={props_closePopup}>Close</button>
      </div>
    </div>
  );
};

export default PopupFooter;
