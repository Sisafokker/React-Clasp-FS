// customers.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from "../Context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faSort } from '@fortawesome/free-solid-svg-icons';
import CustomersForm from "./customersForm";

// Hooks
import { useSortableData } from '../actions/sortingTables';

//styles
import "../styles/appusers_form.scss";
import "../styles/appusers.scss";

const Customers = () => {
    const url = `${process.env.REACT_APP_Backend_URL}/api/companies`;
    const { isMenuOpen } = useContext(Context);
    const [customers, setCustomers] = useState([]);
    const [customerAction, setCustomerAction] = useState({ customer: null, action: "Add" });

    // Hooks Passing the data array for sorting. 
    const { items: sortedCustomers, requestSort, sortConfig } = useSortableData(customers, { key: 'companyName', direction: 'ascending' });

    useEffect(() => {
        axios.get(url)
            .then(response => {
                setCustomers(response.data);
                //console.log("👍customers.js Get All Customers: ", response.data)
            })
            .catch(error => console.error('Error getting customers:', error));
    }, []);

    const handleCustomerAction = () => {
        axios.get(url)
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => console.error('Error getting customers:', error));
    };

    const handleAction = (customer, action) => {
        setCustomerAction({ customer, action });
    };

    const renderTableRows = sortedCustomers.map(c => (
        <tr key={c.companyId}>
            <td> <FontAwesomeIcon icon={faPenToSquare} className='clickable' onClick={() => handleAction(c, 'Edit')} /> </td>
            <td> <FontAwesomeIcon icon={faTrash} className='clickable' onClick={() => handleAction(c, 'Remove')} /> </td>
            <td>{c.companyId}</td>
            <td>{c.companyName}</td>
            <td>{c.companyAddress}</td>
            <td>{c.industry}</td>
            <td>{c.status}</td>
            <td>{c.country}</td>
            <td>{c.state}</td>
        </tr>
    ));

    return (
        <div className="container" style={{ paddingTop: isMenuOpen ? '140px' : '5px' }}>
            {/* <div className='section-title'>Customers - Admin-Only Page</div> */}
            <div className='component-wrapper'>
                <div className='form-container'>
                    <CustomersForm
                        prop_handleCustomerAction={handleCustomerAction}
                        prop_customerAction={customerAction}
                        prop_customers={customers}
                    />
                </div>
                <div className='horizontal-table-container'>
                    <div className='section-title'>Customers</div>
                    {/* <div className='mobile-scroll-table'> */}
                    <table className='horizontal-table customers-table'>
                        <thead>
                            <tr>
                                <th>Edit</th>
                                <th>Delete</th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('companyId')}>Corp. Id <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('companyName')}>Corp. Name <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('companyAddress')}>Address <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('industry')}>Industry <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('status')}>Status <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('country')}>Country <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('state')}>State <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows}
                        </tbody>
                    </table>
                    {/*                     </div> */}
                </div>
            </div>
            <div className='tasks-wrapper'>
                <div className='task-col'>
                    <h3>CRUD Form Instructions</h3>
                    <ul>
                        <li>Select an action (Add, Edit, Remove) to modify records</li>
                        <li>Fill out / edit the form fields for the selected action</li>
                    </ul>
                </div>
                <div className='task-col'>
                    <h3>Table Interactions</h3>
                    <ul>
                        <li>Click on 'Edit'/'Delete' icons next to a customer to perform action</li>
                        <li>'Edit' populates the form with customer details for modification</li>
                    </ul>
                </div>
                <div className='task-col'>
                    <h3>Managing Data</h3>
                    <ul>
                        <li>Review customer details in the list view</li>
                        <li>'Delete' removes the customer after confirmation</li>
                    </ul>
                </div>
            </div>

        </div >
    )
}

export default Customers