// customers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faSort } from '@fortawesome/free-solid-svg-icons';

// Hooks
import { useSortableData } from '../actions/sortingTables';

//styles
import "../styles/appusers_form.scss";
import "../styles/appusers.scss";

const Customers = () => {
    const url = `${process.env.REACT_APP_Backend_URL}/api/companies`;
    const [customers, setCustomers] = useState([]);

    // Hooks Passing the data array for sorting. 
    const { items: sortedCustomers, requestSort, sortConfig } = useSortableData(customers, { key: 'companyName', direction: 'ascending' });

    useEffect(() => {
        axios.get(url)
            .then(response => {
                setCustomers(response.data);
                console.log("Handle success: ", response.data)
            })
            .catch(error => console.error('Error getting customers:', error));
    }, []);

    const addCustomer = (customerData) => {
        axios.post(url, customerData)
            .then(response => { console.log("Handle success: ", response.data) })
            .catch(error => { console.log("❌ Handle Error") });
    };

    const editCustomer = (customerId, updatedData) => {
        axios.patch(`${url}/${customerId}`, updatedData)
            .then(response => { console.log("Handle success: ", response.data) })
            .catch(error => { console.log("❌ Handle Error") });
    };

    const deleteCustomer = (customerId) => {
        axios.delete(`${url}/${customerId}`)
            .then(response => { console.log("Handle success: ", response.data) })
            .catch(error => { console.log("❌ Handle Error") });
    };

    // Adding an indicator when sorting th is clicked... 
    // const getSortDirectionText = (key) => {
    //     if (sortConfig.key === key) {
    //         return sortConfig.direction === 'ascending' ? ' ⬇⬇' : ' ⬆⬆';
    //     }
    //     return '';
    // };

    const renderTableRows = sortedCustomers.map(c => (
        <tr key={c.companyId}>
            <td> <FontAwesomeIcon icon={faPenToSquare} className='clickable' onClick={() => handleAction(u, 'Edit')} /> </td>
            <td> <FontAwesomeIcon icon={faTrash} className='clickable' onClick={() => handleAction(u, 'Remove')} /> </td>
            <td>{c.companyId}</td>
            <td>{c.companyName}</td>
            <td>{c.companyAddress}</td>
            <td>{c.industry}</td>
        </tr>
    ))


    return (
        <div className='container'>
            <div className='section-title'>Customers - Admin-Only Page</div>
            <div className='tasks-wrapper'>
                <div>
                    <h3>Ideas:</h3>
                    <ul>
                        <li>CRUD Google Cloud SQL Database</li>
                        <li>Action buttons (send email, etc) </li>
                        <li>List of PO's</li>
                    </ul>
                </div>
                <div>
                    <h3>Pending:</h3>
                    <ul>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
            <div className='component-wrapper'>
                <div className='form-container'>
                    {/* <AppusersForm 
                    prop_handleUserAction={handleUserAction} 
                    prop_userAction={userAction} 
                    prop_companies={companies}
                    prop_intCompUser={intCompUser}
                /> */}
                </div>
                <div className='horizontal-table-container'>
                    <div className='section-title'>Customers</div>
                    <table className='horizontal-table'>
                        <thead>
                            <tr>
                                <th>Edit</th>
                                <th>Delete</th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('companyId')}>Corp. Id <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('companyName')}>Corp. Name <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('companyAddress')}>Address <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('industry')}>Industry <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default Customers