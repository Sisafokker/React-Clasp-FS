// src/components/popupItem.js
import React from 'react';

const PopupItem = ({ props_itemData, props_onClose }) => {
  //  console.log("Popup props_ItemData: ", props_itemData)
    if (!props_itemData) {
     //   console.log("❌Popup props_ItemData")
        return null;
    }

    //console.log(props_itemData)
    //props_itemData.image = "https://m.media-amazon.com/images/I/91MxaEAOwnL.jpg"//"https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvYTAxMC1tYXJrdXNzLTA5MjYuanBn.jpg"

    return (
        <div className="popup-container">
            <div className="popup-header">
                <div><h3>PRODUCT INFO / DETAILS</h3>
                </div>
            </div>

            <div className="popup-content">
                <div className='product-name'> 
                    <div>{props_itemData.name}</div>
                    <div>${props_itemData.unitPrice_usd.toFixed(2)} p.u</div> 
                </div>
                <div className='product-description'>{props_itemData.description} </div>
                {props_itemData.itemImage && (
                    <div className='product-image'>
                        <img src={props_itemData.itemImage} alt={props_itemData.name} />
                    </div>
                )}
                <p><strong>Available?:</strong> {props_itemData.available ? 'Yes' : 'No'}</p>
                <p><strong>Selling since:</strong> {new Date(props_itemData.creationDate).toLocaleDateString()}</p>
                <p><strong>Item ID:</strong> {props_itemData.itemId}</p>
            </div>
            <div className="popup-footer">
                <div>
                    <button className="btn" onClick={props_onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default PopupItem;
