// crm_order_list.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

// Components
import Download from "./download";

// styles
import "../styles/crm_order_list.scss";


const CRMOrderList = ({ props_companyId, props_companyDetails ,props_OrderSelect}) => {
    const url = process.env.REACT_APP_Backend_URL
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});

    // For Filters
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedUserEmail, setSelectedUserEmail] = useState('All');
    const [userEmail, setUserEmail] = useState([]);

    let downloadName, companyDetails
    if (props_companyDetails) {
        companyDetails = Object.entries(props_companyDetails);
        downloadName = `ReactApp_${props_companyDetails.companyName} ${(new Date()).toLocaleDateString()}`;
        console.log("downloadName", downloadName);
    }

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
                setOrders([]); // empty
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

    const tableHeaders = ["OrderId", "Order Status", "Order Creation", "Order Creator"];
    const ordersForDownload = orders.map(order => [
        order.orderId,
        order.status,
        new Date(order.orderDate).toLocaleDateString(),
        users[order.userId]
    ])
    if (ordersForDownload && ordersForDownload.length > 0)  { ordersForDownload.unshift(tableHeaders); }

    //if (!orders) return <div>Select an order to see details</div>;
    const payload = { 
        btnName: "Save Orders", 
        ssName: downloadName, 
        data: [ 
            { swName: "Orders_original", values: ordersForDownload },
            { swName: "Orders_second", values: ordersForDownload },
            { swName: "Orders_third", values: ordersForDownload }, 
            ], 
        }

    return (
        <div className="crm-order-list">
            <div className='section-title'>List of Orders</div>
            <div className='order-filter'>
                <div className='filter'>
                    <label><FontAwesomeIcon icon={faFilter}/> Status </label>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} disabled={!orders || orders.length === 0}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="All">All</option>
                    </select>
                </div>
                <div className='filter'>
                    <label><FontAwesomeIcon icon={faFilter}/>User</label>
                    <select value={selectedUserEmail} onChange={(e) => setSelectedUserEmail(e.target.value)} disabled={!orders || orders.length === 0}>
                        {userEmail.map(email => <option key={email} value={email}>{email}</option>)}
                    </select>
                </div>
            </div>
            {orders && orders.length > 0 ? (
                <>
                <div className='section-btns'>
                    <button className='btn' title="Show All Orders" onClick={resetFilters} >Show All Orders</button>
                    <Download props_ssPayload={payload}/>
                    {/* <button className='btn' onClick={props_resetCompanyList}>Show All</button>  */}
                </div>
                <div className='filtered-orders'>
                <table className='horizontal-table'>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>User</th>
                            <th>Total Price (USD)</th>
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
                </div>
                </>
            ) : ( <p>No orders available for this customer</p> )}
            
        </div>
    );
};

export default CRMOrderList;
