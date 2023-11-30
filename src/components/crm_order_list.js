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
    const [selectedUserFilter, setSelectedUserFilter] = useState('All');
    const [userEmail, setUserEmail] = useState([]);

    // For totals
    const [orderTotals, setOrderTotals] = useState({});

    let downloadName, companyDetails
    if (props_companyDetails) {
        companyDetails = Object.entries(props_companyDetails);
        downloadName = `ReactApp_${props_companyDetails.companyName} ${(new Date()).toLocaleDateString()}`;
        console.log("downloadName", downloadName);
    }

    useEffect(() => {
        console.log("🟡🟡crm_order_list.js props_companyId: ", props_companyId)
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${url}/api/orders/company/${props_companyId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('🟡Error fetching orders:', error);
                setOrders([]);
            }
        };
    
        if (props_companyId) {
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [props_companyId]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${url}/api/users`);
                const userMap = response.data.reduce((map, user) => {
                    map[user.id] = user.email;
                    return map;
                }, {});
                setUsers(userMap);
                console.log("🟡 ALL SQL USERS: ", userMap)
            } catch (error) {
                console.error('🟡Error fetching users:', error);
            }
        };
    
        fetchUsers();
    }, []);
    
    useEffect(() => {
        const userEmailObjects = orders.reduce((acc, order) => {
            if (!acc.some(user => user.id === order.userId)) {
                acc.push({ id: order.userId, email: users[order.userId] });
            }
            return acc;
        }, [{ id: 'All', email: 'All' }]);
        setUserEmail(userEmailObjects);
        console.log("🟡 userEmailObjects: ",userEmailObjects )


        // Fetch and calculate totals for each order
        const fetchAndCalculateTotals = async () => {
            let newOrderTotals = {};
            for (const order of orders) {
                const orderDetails = await fetchOrderDetails(order.orderId);
                let total = orderDetails.reduce((acc, detail) => acc + detail.quantity * detail.unitPrice_usd, 0);
                newOrderTotals[order.orderId] = total.toFixed(2);
            }
            setOrderTotals(newOrderTotals);
        };
    
        if (orders.length > 0) {
            fetchAndCalculateTotals();
        }
    }, [orders]);
    
   
    
    // Helper function to fetch order details
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`${url}/api/intOrderItem/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            return [];
        }
    };

    // Create a reverse map from emails to userIds
    const emailToUserId = Object.fromEntries(Object.entries(users).map(([id, email]) => [email, id]));

    // Filter by multiple conditions
    const filteredOrders = orders.filter(order => {
        let statusMatch = selectedStatus === 'All' || order.status === selectedStatus;
        let userMatch = selectedUserFilter === 'All' || order.userId === userEmail.find(u => u.email === selectedUserFilter)?.id;
        return statusMatch && userMatch;
    });

    const resetFilters = () => {
        setSelectedStatus('All');
        setSelectedUserFilter('All');
    };

    const handleOrderClick = orderId => {
        props_OrderSelect(orderId); // Invokes handleOrderSelect() in crm.js & passing orderId as argument.
    };

    const tableHeaders = ["OrderId", "Order Status", "Order Creation", "Order Creator"];
    const ordersForDownload = filteredOrders.map(order => [
        order.orderId,
        order.status,
        new Date(order.orderDate).toLocaleDateString(),
        users[order.userId]
    ])
    if (ordersForDownload && ordersForDownload.length > 0)  { ordersForDownload.unshift(tableHeaders); }

    //if (!orders) return <div>Select an order to see details</div>;
    const payload = { 
        btnName: "Download Orders",
        btnTitle: "Download VISIBLE Orders to Drive",
        ssName: downloadName, 
        data: [ 
            { swName: "Orders", values: ordersForDownload },
/*             { swName: "Orders_second", values: ordersForDownload },
            { swName: "Orders_third", values: ordersForDownload },  */
            ], 
        }

    return (
        <div className="crm-order-list">
            <div className='section-title'>List of Orders</div>
            <div className='order-filter'>
                <div className='filter'>
                    <label><FontAwesomeIcon icon={faFilter}/> Status </label>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} disabled={!orders || orders.length === 0}>
                        <option value="valid">Valid</option>
                        <option value="invalid">Invalid</option>
                        <option value="All">All</option>
                    </select>
                </div>
                <div className='filter'>
                    <label><FontAwesomeIcon icon={faFilter}/>User</label>
                    <select value={selectedUserFilter} onChange={(e) => setSelectedUserFilter(e.target.value)} disabled={!orders || orders.length === 0}>
                    {userEmail.map(user => <option key={user.id} value={user.email}>{user.email}</option>)}
                    </select>
                </div>
            </div>
            {orders && orders.length > 0 ? (
                <>
                <div className='section-btns'>
                    <button className='btn' title="Reset all filters"
                        onClick={resetFilters} disabled={selectedStatus === "All" && selectedUserFilter === "All"}>
                        <FontAwesomeIcon icon={faFilter}/> Reset Filters 
                    </button>
   {/*                  <button className='btn' title="Show All Orders" disabled={selectedStatus === "All" && selectedUserFilter === "All"}
                        onClick={resetFilters} >All Orders</button> */}
                    <Download props_ssPayload={payload}/>
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
                        {filteredOrders.map(order => (
                            <tr key={order.orderId} className="order-item" onClick={() => handleOrderClick(order.orderId)}>
                                <td>{order.orderId}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{users[order.userId]}</td>
                                <td>${orderTotals[order.orderId]}</td>
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
