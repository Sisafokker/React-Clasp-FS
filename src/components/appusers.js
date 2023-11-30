// src/components/appusers.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faSort } from '@fortawesome/free-solid-svg-icons';
import AppusersForm from "./appusersform";

// Hooks
import { useSortableData } from '../actions/sortingTables';

// styles
import "../styles/appusers-table.scss";
// Compiled CSS Styles files
// import "../../apps-script/styles_compiled/appusers-table.css";

function Appusers() {
    const [appUsers, setAppUsers] = useState([]);
    const [userAction, setUserAction] = useState({ user: null, action: "Add" });
    const [companies, setCompanies] = useState([]);
    const [intCompUser, setIntCompUser] = useState([]);
    const url = process.env.REACT_APP_Backend_URL

    const { items: sortedAppUsers, requestSort, sortConfig } = useSortableData(appUsers, { key: 'lastName', direction: 'ascending' }); // Hooks Passing the data array for sorting. 

    // initial mount
    useEffect(() => {
        fetchAppUsers();
        fetchCompanies();
        fetchIntCompanyUser();
    }, []); 
    

    // Fetches all users
    const fetchAppUsers = useCallback(() => {
        axios.get(`${url}/api/users`)
        .then(response => {
            setAppUsers(response.data);
        })
      .catch(console.error);
    }, [url]);

    
    // Fetches all companies
    const fetchCompanies = useCallback(() => {
        axios.get(`${url}/api/companies`)
        .then(response => {
            setCompanies(response.data);
        })
        .catch(console.error);
    }, [url]);

    
    // Fetches all company-user intermediary relations
    const fetchIntCompanyUser = useCallback(() => {
        axios.get(`${url}/api/intCompanyUser`)
        .then(response => {
            setIntCompUser(response.data);
        })
        .catch(console.error);
    }, [url]);   


     // After a new user is added / edited / removed
     const handleUserAction = useCallback(() => {
        fetchAppUsers();
        fetchIntCompanyUser();
    }, [fetchAppUsers]);

    const handleAction = (user, action) => {
        setUserAction({ user, action });
    };

    const getCompanyNamesForUser = (userId) => {
        
        // Find all company-user relationships for this user
        const userCompanies = intCompUser.filter(rowObj => rowObj.userId === userId);
        
        // Map the company IDs to company names
        const companyNames = userCompanies.map(rowObj => {
            const company = companies.find(company => company.companyId === rowObj.companyId);
            return company ? company.companyName : '';
        });
        
        const result = companyNames.join(', ');
        console.log("RES: ", result)
        return result;
    };
      

    const renderTableRows = sortedAppUsers.map(u => (
        <tr key={u.id}>
            <td>{u.lastName}</td>
            <td>{u.firstName}</td>
            <td>{u.email}</td>
            {/* <td>{u.password}</td> */}
            <td>{u.type}</td>
            <td>{u.status}</td>
            {/* <td>{u.createdAt}</td> */}
            {/* <td>{u.updatedAt}</td> */}
            <td> {getCompanyNamesForUser(u.id)} </td>
            <td> <FontAwesomeIcon icon={faPenToSquare} className='clickable'onClick={() => handleAction(u, 'Edit')} /> </td>
            <td> <FontAwesomeIcon icon={faTrash} className='clickable' onClick={() => handleAction(u, 'Remove')} /> </td>
        </tr>
    ));

    return <div className='container'>
        <h1>AppUsers Page...</h1>
        <div className='tasks-wrapper'>
            <div>
                <h3>Methods:</h3>
                <ul>
                    <li>Google API admin console</li>
                    <li>CRUD Google Workspace Users</li>
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
        <div className='users-wrapper'>
            <AppusersForm 
                prop_handleUserAction={handleUserAction} 
                prop_userAction={userAction} 
                prop_companies={companies}
                prop_intCompUser={intCompUser}
            />
            <h2>[SQL] Signed-Up Users:</h2>
            <table className='horizontal-table'>
                <thead>
                    <tr>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('lastName')}>Last Name <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('firstName')}>First Name <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('email')}>Email <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('type')}>Type <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                        <th className="sortable" title="Click to Sort" onClick={() => requestSort('status')}>Status <span className="sort-indicator"><FontAwesomeIcon icon={faSort}/></span></th>
                        <th>Customers</th>
                        <th>Edit</th>
                        <th>Del</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows}
                </tbody>
            </table>
        </div>
    </div>
}

export default Appusers