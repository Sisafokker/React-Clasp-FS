// crm_order_detail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// styles
import "../styles/crm_order_detail.scss";

const CRMOrderDetail = ({ props_orderId }) => {
    const url = process.env.REACT_APP_Backend_URL;
    const [orderDetails, setOrderDetails] = useState(null);
    const [items, setItems] = useState({});

    console.log("crm_order_detail.js 🚩props_orderId🚩",props_orderId)
    
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${url}/api/items`);
                console.log("crm_order_detail.js 🔵Items Response:", response);
                const itemMap = {};
                response.data.forEach(item => {
                    itemMap[item.itemId] = item.name; // Corrected from item.itemName to item.name
                });
                setItems(itemMap);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${url}/api/intOrderItem/${props_orderId}`);
                setOrderDetails(response.data);
                console.log("crm_order_detail.js 🔴inOrderItems🔴", response.data)
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        if (props_orderId) { 
            fetchOrderDetails(); 
        }
    }, [props_orderId]);

    if (!orderDetails) return <div>Select an order to see details</div>;

    return (
        <div className="detail">
            <h3>Order Details</h3>
            {orderDetails && orderDetails.length > 0 ? (
                <table className='horizontal-table'>
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price (USD)</th>
                            <th>Total Price (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.map(detail => (
                            <tr key={detail.itemId}>
                                <td>{detail.itemId}</td>
                                <td>{items[detail.itemId]}</td>
                                <td>{detail.quantity}</td>
                                <td>${detail.unitPrice_usd.toFixed(2)}</td>
                                <td>${(detail.quantity * detail.unitPrice_usd).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : ( <p>No order details available.</p> )}
        </div>
    );
};

export default CRMOrderDetail;