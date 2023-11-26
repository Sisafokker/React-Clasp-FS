// crm_order_list.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CRMOrderList = ({ prop_companyId, prop_OrderSelect }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`api/orders/${prop_companyId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [prop_companyId]);

    return (
        <div>
            <h3>Orders</h3>
            <ul>
                {orders.map(order => (
                    <li key={order.orderId} onClick={() => prop_OrderSelect(order.orderId)}>
                        {order.orderDate} - {order.status} - {order.userId}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CRMOrderList;
