// crm_order_list.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

// styles
import "../styles/crm_order_list.scss";


const CRMOrderList = ({ props_companyId, props_OrderSelect}) => {
    const url = process.env.REACT_APP_Backend_URL
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});

    // For Filters
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedUserEmail, setSelectedUserEmail] = useState('All');
    const [userEmail, setUserEmail] = useState([]);

    useEffect(() => {
        // Unique OrderUserEmails for Dropdown options
        const uniqueUserEmails = ['All', ...new Set(orders.map(order => order.userId))];
        console.log("uniqueUserEmails: ", uniqueUserEmails)
        setUserEmail(uniqueUserEmails);
    }, [props_companyId]);

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

    const resetFilters = () => {
        setSelectedStatus('All');
        setSelectedUserEmail('All');
    };

    const handleOrderClick = orderId => {
        props_OrderSelect(orderId); // Invokes handleOrderSelect() in crm.js & passing orderId as argument.
    };

    if (!orders) return <div>Select an order to see details</div>;

    return (
        <div className="crm-order-list">
            <div className='section-title'>Orders</div>
            <div className='order-filter'>
                <div className='filter'>
                    <label><FontAwesomeIcon icon={faFilter}/> Status </label>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="All">All</option>
                    </select>
                </div>
                <div className='filter'>
                    <label><FontAwesomeIcon icon={faFilter}/>User</label>
                    <select value={selectedUserEmail} onChange={(e) => setSelectedUserEmail(e.target.value)}>
                        {userEmail.map(email => <option key={email} value={email}>{email}</option>)}
                    </select>
                </div>
            </div>
            <div className='section-btns'>
                <div>
                    <button className='btn' onClick={resetFilters}>Show All</button>
                    {/* <button className='btn' onClick={props_resetCompanyList}>Show All</button>  */}
                </div>
            </div>
            <div className='filtered-orders'>
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
                            <tr key={order.orderId} className="order-item" onClick={() => handleOrderClick(order.orderId)}>
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
        </div>
    );
};

export default CRMOrderList;
