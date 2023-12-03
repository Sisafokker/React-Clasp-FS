// src/components/appusers.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Context } from "../Context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faKey, faTrash, faSort } from '@fortawesome/free-solid-svg-icons';
import AppusersForm from "./appusersform";
import PopupPassword from './popupPassword.js';

// Hooks
import { useSortableData } from '../actions/sortingTables';

// styles
import "../styles/appusers.scss";
import "../styles/popupPassword.scss";
// Compiled CSS Styles files
// import "../../apps-script/styles_compiled/appusers-table.css";

function Appusers() {
    const url = process.env.REACT_APP_Backend_URL;
    const { isMenuOpen } = useContext(Context);
    const [appUsers, setAppUsers] = useState([]);
    const [userAction, setUserAction] = useState({ user: null, action: "Add" });
    const [companies, setCompanies] = useState([]);
    const [intCompUser, setIntCompUser] = useState([]);
    const [popupState, setPopupState] = useState({ 
        showPasswordPopup: false, 
        selectedUser: null 
    });
    
    const { items: sortedAppUsers, requestSort, sortConfig } = useSortableData(appUsers, { key: 'lastName', direction: 'ascending' }); // Hooks Passing data for sorting. 

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
        if (action === "Password") {
            console.log("OPEN PASSWORD POPUP: ", user.id ,user.email)
            setPopupState({ 
                showPasswordPopup: true, 
                selectedUser: user 
            });
        } else {
            setUserAction({ user, action });
        }
    };

    const handleClosePopup = () => {
        setPopupState({ showPasswordPopup: false, selectedUser: null });
    };

    const handleResetPassword = (userId, newPassword) => {
        console.log("Reset Pass for userId:", userId);
        
        const passwordPayload = { id: userId, newPassword };
        axios.post(`${url}/api/users/reset`, passwordPayload)
            .then(response => {
                console.log('Password reset successfully:', response.data);
                const message = "👍 Password reset successfully"
                setPopupState({ ...popupState, successMessage: message, errorMessage: null }); 

                setTimeout(() => { handleClosePopup() }, 2000);
            })
            .catch(error => {
                console.error('Error resetting password:', error.response?.data?.error || error.message);
                const message = '❌ Error resetting password';
                setPopupState({ ...popupState, successMessage: null, errorMessage: message }); 
            });
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
        //console.log("RES: ", result);
        return result;
    };


    const renderTableRows = sortedAppUsers.map(u => (
        <tr key={u.id}>
            <td> <FontAwesomeIcon icon={faPenToSquare} className='clickable' title="Edit User" onClick={() => handleAction(u, 'Edit')} /> </td>
            <td> <FontAwesomeIcon icon={faKey} className='clickable' title="Change Password" onClick={() => handleAction(u, 'Password')} /> </td>
            <td> <FontAwesomeIcon icon={faTrash} className='clickable' title="Remove Password" onClick={() => handleAction(u, 'Remove')} /> </td>
            <td>{u.lastName}</td>
            <td>{u.firstName}</td>
            <td>{u.email}</td>
            {/* <td>{u.password}</td> */}
            <td>{u.type}</td>
            <td>{u.status}</td>
            {/* <td>{u.createdAt}</td> */}
            {/* <td>{u.updatedAt}</td> */}
            <td> {getCompanyNamesForUser(u.id)} </td>
        </tr>
    ));

    return (
        <div className="container" style={{ paddingTop: isMenuOpen ? '140px' : '5px' }}>
            {/* <div className='section-title'>Users - Admin-Only Page</div> */}
            <div className='tasks-wrapper'>
                <div className='task-col'>
                    <h3>Crud Form</h3>
                    <p>Added, Edit & Remove users</p>
                    <p>Password edits</p>
                </div>
                <div className='task-col'>
                    <h3>User's List</h3>
                    <p>Added, Edit & Remove</p>
                    <p>Password edits</p>
                </div>
            </div>
            <div className='component-wrapper'>
                <div className='form-container'>
                    <AppusersForm
                        prop_handleUserAction={handleUserAction}
                        prop_userAction={userAction}
                        prop_companies={companies}
                        prop_intCompUser={intCompUser}
                    />
                </div>
                <div className='horizontal-table-container'>
                    <div className='section-title'>Users</div>
                    <table className='horizontal-table appusers-table'>
                        <thead>
                            <tr>
                                <th>Edit</th>
                                <th>Pass</th>
                                <th>Del</th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('lastName')}>Last Name <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('firstName')}>First Name <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('email')}>Email <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('type')}>Type <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th className="sortable" title="Click to Sort" onClick={() => requestSort('status')}>Status <span className="sort-indicator"><FontAwesomeIcon icon={faSort} /></span></th>
                                <th>Customers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows}
                        </tbody>
                    </table>
                </div>
            </div>
            {popupState.showPasswordPopup && popupState.selectedUser && (
                <PopupPassword 
                    props_user={popupState.selectedUser} 
                    props_onClose={handleClosePopup} 
                    props_onReset={handleResetPassword}
                    props_successMessage={popupState.successMessage}
                    props_errorMessage={popupState.errorMessage}
                />
            )}
        </div>
    )
}

export default Appusers