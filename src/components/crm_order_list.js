// crm_order_list.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort} from '@fortawesome/free-solid-svg-icons';

// Components
import Download from "../actions/download";

// Hooks
import { useSortableData } from '../actions/sortingTables';

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

    // For totals & downloads
    const [orderTotals, setOrderTotals] = useState({});
    const [orderDetailsForDownload, setOrderDetailsForDownload] = useState([]);

    // Enrich AND filter orders
    const enrichedAndFilteredOrders = orders.map(order => ({
        ...order,
        userEmail: users[order.userId] || '',
        totalPrice: orderTotals[order.orderId] || 0
    })).filter(order => {
        let statusMatch = selectedStatus === 'All' || order.status === selectedStatus;
        let userMatch = selectedUserFilter === 'All' || order.userId === userEmail.find(u => u.email === selectedUserFilter)?.id;
        return statusMatch && userMatch;
    });

    // Apply sorting hook on enrichedFilteredOrders
    const { items: sortedFilteredOrders, requestSort, sortConfig } = useSortableData(enrichedAndFilteredOrders, { key: 'orderId', direction: 'ascending' });
  

    let downloadName, companyDetails
    if (props_companyDetails) {
        companyDetails = Object.entries(props_companyDetails);
        downloadName = `CRM_Download_${props_companyDetails.companyName}_${(new Date()).toLocaleDateString()}`;
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
                //console.log("🟡 ALL SQL USERS: ", userMap)
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
            let allOrderDetails = [["OrderId", "CustomerId", "Order Placed","itemId", "Qty", "Unit Price (U$D)", "Total (Qty * U.Price)"]];

            for (const order of orders) {
                const orderDetails = await fetchOrderDetails(order.orderId);
                if (orderDetails) {
                    let total = orderDetails.reduce((acc, detail) => acc + detail.quantity * detail.unitPrice_usd, 0);
                    newOrderTotals[order.orderId] = total.toFixed(2);
                 
                    // Format Deatails for download
                    orderDetails.forEach(detail => {
                        allOrderDetails.push([
                            order.orderId,
                            order.companyId,
                            new Date(order.orderDate).toLocaleDateString(),
                            detail.itemId,
                            detail.quantity,
                            detail.unitPrice_usd.toFixed(2),
                            (detail.quantity * detail.unitPrice_usd).toFixed(2)
                        ]);
                    });
            }
        }
        setOrderTotals(newOrderTotals);
        setOrderDetailsForDownload(allOrderDetails);
    };

    if (orders.length > 0) {
        fetchAndCalculateTotals();
    }
    }, [orders]);
    
    
    // Helper function to fetch order details
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`${url}/api/intOrderItem/${orderId}`);
            if (response.status === 200) {
                return response.data;
            } else {
                console.error(`Error: Response status ${response.status} for orderId ${orderId}`);
                return null;
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            return null;
        }
    };


    // Create a reverse map from emails to userIds
    // const emailToUserId = Object.fromEntries(Object.entries(users).map(([id, email]) => [email, id]));

    // Filter by multiple conditions
    const filteredOrders = orders.filter(order => {
        let statusMatch = selectedStatus === 'All' || order.status === selectedStatus;
        let userMatch = selectedUserFilter === 'All' || order.userId === userEmail.find(u => u.email === selectedUserFilter)?.id;
        return statusMatch && userMatch;
    });

    // Sorting logic
    // const getSortDirectionText = (key) => {
    //     if (sortConfig.key === key) {
    //         return sortConfig.direction === 'ascending' ? ' ⬇⬇' : ' ⬆⬆';
    //     }
    //     return '';
    // };

    const resetFilters = () => {
        setSelectedStatus('All');
        setSelectedUserFilter('All');
    };

    const handleOrderClick = orderId => {
        props_OrderSelect(orderId); // Invokes handleOrderSelect() in crm.js & passing orderId as argument.
    };

    const orderTableHeaders = ["OrderId", "Order Status", "Order Creation", "Order Creator"];
    const ordersForDownload = filteredOrders.map(order => [
        order.orderId,
        order.status,
        new Date(order.orderDate).toLocaleDateString(),
        users[order.userId]
    ])
    if (ordersForDownload && ordersForDownload.length > 0)  { 
        ordersForDownload.unshift(orderTableHeaders); 
    }

    //if (!orders) return <div>Select an order to see details</div>;
    const payload = { 
        btnName: "Download Orders",
        btnTitle: "Orders List and Details (Drive & CSV)",
        ssName: downloadName, 
        data: [ 
            { swName: "Order_List", values: ordersForDownload },  
            { swName: "Order_Details", values: orderDetailsForDownload  },  
            //{ swName: "Orders_second", values: ordersForDownload }, // One of these objs for each sheet of data
            ], 
        }

    const renderTableRows = sortedFilteredOrders.map(order => (
        <tr key={order.orderId} className="order-item" onClick={() => handleOrderClick(order.orderId)}>
            <td>{order.orderId}</td>
            <td>{order.status}</td>
            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
            <td>{users[order.userId]}</td>
            <td>${orderTotals[order.orderId]}</td>
        </tr>
    ));

    return (
        <div className="crm-order-list">
            <div className='section-title'>Customer's Orders</div>
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
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('orderId')}>Order ID <span className="sort-indicator"> <FontAwesomeIcon icon={faSort}/></span></th>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('status')}>Status <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('orderDate')}>Date <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('userEmail')}>User <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('totalPrice')}>Total Price (USD) <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                    </tr>
                    </thead>
                    <tbody>
                        {renderTableRows}
                    </tbody>
                </table>
                </div>
                </>
            ) : ( props_companyId ? 
                <div className='not-found'>        
                    <div>No Orders for this Customer</div>    
                    <div>Please select another Customer.</div> 
                </div>
                :
                <div className='not-found no-companyId'>        
                    <div>Please select a Customer.</div> 
                </div> 
            )}
        </div>
    );
};

export default CRMOrderList;
