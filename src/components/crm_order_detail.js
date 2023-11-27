// crm_company_detail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CRMOrderDetail = ({ props_orderId }) => {
    const url = process.env.REACT_APP_Backend_URL;
    const [orderDetails, setOrderDetails] = useState(null);
    console.log("crm_company_detail.js 🚩props_orderId🚩",props_orderId)

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${url}/api/orderDetails/${props_orderId}`);
                setOrderDetails(response.data);
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
        <div>
            <h3>Order Details</h3>
            {/* Display order details */}
            {orderDetails && (
                <div>
                    {/* Render order details */}
                </div>
            )}
        </div>
    );
};

export default CRMOrderDetail;
