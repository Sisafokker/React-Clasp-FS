// src/components/popupPassword.js
import React, { useState } from 'react';

const PopupPassword = ({ props_user, props_onClose, props_onReset, props_successMessage,  props_errorMessage}) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localErrMessage, setLocalErrMessage] = useState('');
    
    const handlePassReset = () => {
        if ( (newPassword === confirmPassword) && newPassword.length >= 6 && newPassword.length <=20 ) {
            props_onReset(props_user.id, newPassword);
            setLocalErrMessage(null)
        } else {
            if (newPassword !== confirmPassword) {
                setLocalErrMessage("❌ Both Passwords should match!");
                return;
            } else {
                setLocalErrMessage("❌ Password must be between 6 and 20 characters long");
                return;
            }       
        }
    };

    const handleNewPassChange = (e) => {
        setNewPassword(e.target.value);
        setLocalErrMessage('');
    };

    const handleConfirmPassChange = (e) => {
        setConfirmPassword(e.target.value);
        setLocalErrMessage('');
    };
    

    return (
        <div className="popup-container">
            <div className="popup-header">
                <h3>{props_user.email}</h3>
            </div>
            <div className="popup-content">
            <h4>Password Reset</h4>
                <input 
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handleNewPassChange}
                    
                />
                <input 
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={handleConfirmPassChange}
                />
                {props_successMessage && <p className="success-message">{props_successMessage}</p>}
                {props_errorMessage && <p className="error-message">{props_errorMessage}</p>}
                {localErrMessage && <p className="error-message">{localErrMessage}</p>}   
            </div>
            <div className="popup-footer">
                <button className="btn reset" onClick={handlePassReset}>Reset Password</button>
                <button className="btn close" onClick={props_onClose}>Close</button>
            </div>
        </div>
    );
};

export default PopupPassword;
