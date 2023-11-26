// customers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

//styles
import "../styles/appusers-form.scss";
import "../styles/appusers-table.scss";

const Customers = () => {
    const url = `${process.env.REACT_APP_Backend_URL}/api/companies`;
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get(url)
            .then(response => {
                setCustomers(response.data);
                console.log("Handle success: ",response.data)
            })
            .catch(error => console.error('Error getting customers:', error));
    }, []);

    const addCustomer = (customerData) => {
        axios.post(url, customerData)
            .then(response => { console.log("Handle success: ",response.data) } )
            .catch(error => {   console.log("❌ Handle Error")}    );
    };

    const editCustomer = (customerId, updatedData) => {
        axios.patch(`${url}/${customerId}`, updatedData)
            .then(response => { console.log("Handle success: ",response.data) } )
            .catch(error => {   console.log("❌ Handle Error")}    );
    };

    const deleteCustomer = (customerId) => {
        axios.delete(`${url}/${customerId}`)
            .then(response => { console.log("Handle success: ",response.data) } )
            .catch(error => {   console.log("❌ Handle Error")}    );
    };   
    
    
    return <div className='container'>
    <h1>Customers...</h1>
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
        <h2>Customers SQL</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Industry</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {customers.map(customer => (
                    <tr key={customer.companyId}>
                        <td>{customer.companyId}</td>
                        <td>{customer.companyName}</td>
                        <td>{customer.companyAddress}</td>
                        <td>{customer.industry}</td>
                        <td> <FontAwesomeIcon icon={faPenToSquare} className='clickable'onClick={() => handleAction(u, 'Edit')} /> </td>
                        <td> <FontAwesomeIcon icon={faTrash} className='clickable' onClick={() => handleAction(u, 'Remove')} /> </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default Customers