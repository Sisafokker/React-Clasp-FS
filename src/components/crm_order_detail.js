// crm_ORDER_detail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faCameraRetro, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

// Hook
import { useSortableData } from '../actions/sortingTables';

// Component
import PopupItem from './popupItem';

// styles
import "../styles/crm_order_detail.scss";
// import '../styles/popup.scss';
import '../styles/popupItem.scss';

const CRMOrderDetail = ({ props_orderId }) => {
    const url = process.env.REACT_APP_Backend_URL;
    const [orderDetails, setOrderDetails] = useState(null);
    const [items, setItems] = useState({});
    const [itemsAll, setItemsAll] = useState({});
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Popup
    const [showPopup, setShowPopup] = useState(false); 
    const [currentItem, setCurrentItem] = useState(null); 

    console.log("crm_order_detail.js 🟢props_orderId🟢",props_orderId)
    
    // Initial Mount
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${url}/api/items`);
                setItemsAll(response.data);
                console.log("crm_order_detail.js 🟢Items Response:", response.data);
                const itemMap = {};
                response.data.forEach(item => {
                    itemMap[item.itemId] = item.name;
                });
                setItems(itemMap);
            } catch (error) {
                console.error('🟢Error fetching items:', error);
            }           
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${url}/api/intOrderItem/${props_orderId}`);
                const details = response.data;
                console.log("crm_order_detail.js 🟢inOrderItems🟢", details);
    
                // Enrich details with additional information
                const enrichedDetails = details.map(detail => ({
                    ...detail,
                    itemName: items[detail.itemId], // itemName added
                    totalPricePerItem: (detail.quantity * detail.unitPrice_usd).toFixed(2), // totalPricePerItem added
                }));
    
                setOrderDetails(enrichedDetails);
    
                // Calculate totals based on enrichedDetails
                let quantitySum = 0;
                let priceSum = 0;
                enrichedDetails.forEach(detail => { 
                    quantitySum += detail.quantity;
                    priceSum += detail.quantity * detail.unitPrice_usd;
                });
    
                setTotalQuantity(quantitySum);
                setTotalPrice(priceSum);
            } catch (error) {
                console.error('🟢Error fetching order details:', error);
            }
        };
    
        if (props_orderId) { 
            fetchOrderDetails(); 
        }
    
    }, [props_orderId, items]);

    const openItemPopup = (itemId) => {
        const selectedItem = itemsAll.find(item => item.itemId === itemId);
        setCurrentItem(selectedItem);
        setShowPopup(true);
    };

    const closeItemPopup = () => {
        setShowPopup(false);
        setCurrentItem(null);
    };

    // Apply hook to enrichedOrderDetails
      const { items: sortedOrderDetails, requestSort, sortConfig } = useSortableData(orderDetails || [], { key: 'itemId', direction: 'ascending' });

    if (!sortedOrderDetails) return <div>Select an order to see details</div>;

    const renderTableRows = sortedOrderDetails.map(detail => (
        <tr key={detail.itemId}>
            <td>{detail.itemId}</td>
            <td onClick={() => openItemPopup(detail.itemId)}><FontAwesomeIcon icon={faCameraRetro} style={{ color: "#026F7E", opacity: 0.5, cursor: 'pointer' }} /></td>
            <td>{detail.itemName}</td>
            <td>{detail.quantity}</td>
            <td>${detail.unitPrice_usd.toFixed(2)}</td>
            <td>${detail.totalPricePerItem}</td>
        </tr>
    ))

    return (
        <div className="crm-order-details">
            {props_orderId ? <div className='section-title sub'>Order # {props_orderId}  ⇒  ${totalPrice.toFixed(2)} </div>
            : <div className='section-title sub'>Order Details</div> }
            
            <div className='order-details'>
            {orderDetails && orderDetails.length > 0 ? (
                <table className='horizontal-table'>
                    <thead>
                        <tr>
                            <th className="sortable" onClick={() => requestSort('itemId')}>Item Id <FontAwesomeIcon icon={faSort}/></th>
                            <th>Info</th>
                            <th className="sortable" onClick={() => requestSort('itemName')}>Item Name <FontAwesomeIcon icon={faSort}/></th>
                            <th className="sortable" onClick={() => requestSort('quantity')}>Quantity <FontAwesomeIcon icon={faSort}/></th>
                            <th className="sortable" onClick={() => requestSort('unitPrice_usd')}>Unit Price (USD) <FontAwesomeIcon icon={faSort}/></th>
                            <th className="sortable" onClick={() => requestSort('totalPricePerItem')}>Total Price x Item (USD) <FontAwesomeIcon icon={faSort}/></th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableRows}
                    </tbody>
                    <tfoot>
                        <tr className='totals-row'>
                            <td colSpan="2">ORDER TOTAL:</td>
                            <td></td> 
                            <td>{totalQuantity}</td>
                            <td></td> 
                            <td>${totalPrice.toFixed(2)}</td>
                        </tr>
                        </tfoot>
                </table>
            ) : ( 
                <div className='not-found'>        
                    <div><FontAwesomeIcon icon={faTriangleExclamation}/> Something went wrong. <FontAwesomeIcon icon={faTriangleExclamation}/></div>
                    <div> Please refresh.</div> 
                </div>
            )}
            {showPopup && <PopupItem props_itemData={currentItem} props_onClose={closeItemPopup} />}
            </div>
        </div>
    );
};

export default CRMOrderDetail;