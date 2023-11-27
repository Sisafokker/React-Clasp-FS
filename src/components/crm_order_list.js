// crm_order_list.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// styles
import "../styles/crm_order_list.scss";


const CRMOrderList = ({ props_companyId, props_OrderSelect}) => {
    const url = process.env.REACT_APP_Backend_URL
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${url}/api/users`);
                const userMap = {};
                response.data.forEach(user => {
                    userMap[user.id] = user.email; // Store emails by userId
                });
                setUsers(userMap);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        console.log("crm_order_list.js props_companyId: ", props_companyId)
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${url}/api/orders/company/${props_companyId}`);
                console.log("crm_order_list.js OrderList: ", response.data)
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setOrders([]); // Orders set to an empty array
            }
        };

        if (props_companyId) {
            fetchOrders();
        }
    }, [props_companyId]);

    const handleOrderClick = orderId => {
        props_OrderSelect(orderId); // Invokes handleOrderSelect() in crm.js & passing orderId as argument.
    };

    return (
        <div className="list">
            <h3>Orders</h3>
            {orders && orders.length > 0 ? (
                <table className='horizontal-table'>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId} onClick={() => handleOrderClick(order.orderId)}>
                                <td>{order.orderId}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{users[order.userId]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : ( <p>No orders available.</p> )}
        </div>
    );
};

export default CRMOrderList;
