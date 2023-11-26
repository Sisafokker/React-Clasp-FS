// crm_company_detail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CRMOrderDetail = ({ prop_orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`api/orderDetails/${prop_orderId}`);
                setOrderDetails(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [prop_orderId]);

    if (!orderDetails) return <div>Select an order to see details</div>;

    return (
        <div>
            <h3>Order Details</h3>
            {/* Display details of selectedOrder */}
            {/* ... */}
        </div>
    );
};

export default CRMOrderDetail;
