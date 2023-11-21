// appusers.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import AppusersForm from "./appusersform";

// styles
import "../styles/main.scss";
import "../styles/appusers-table.scss";


// Compiled CSS Styles files
// import "../../apps-script/styles_compiled/main.css";
// import "../../apps-script/styles_compiled/appusers-table.css";


function Appusers() {
    const [appUsers, setAppUsers] = useState([]);
    const [userAction, setUserAction] = useState({ user: null, action: null });
    const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'ascending' });  // keep track of current sorting

    useEffect(() => {
        fetchAppUsers();
    }, []); // Fetch data on initial component mount

    // Get Student Data
    const fetchAppUsers = useCallback(() => {  // useCallback => React Hook that lets you cache a function definition between re-renders.
        //const url = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api/users`;
        const url = process.env.REACT_APP_Backend_URL
        axios.get(`${url}/api/users`)
            .then(response => {
                setAppUsers(response.data);
                console.log("Fetched app users");
            })
            .catch(console.error);
    }, []);

     // After a new user is added / edited / removed
     const handleUserAction = useCallback(() => {
        fetchAppUsers();
    }, [fetchAppUsers]);

    const handleAction = (user, action) => {
        setUserAction({ user, action });
    };

    // Sorting
    // const sortedAppUsers = useMemo(() => {
    //     // useMemo hook: used to version of sorted appUsers array, recalculated only when appUsers changes. Better for performance.
    //     return [...appUsers].sort((a, b) => a.lastName.localeCompare(b.lastName));
    // }, [appUsers]);

    const onSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortDirectionText = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ⬇⬇' : ' ⬆⬆';
        }
        return '';
    };

    const sortedAppUsers = useMemo(() => {
        let sortableUsers = [...appUsers];
        if (sortConfig !== null) {
            sortableUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [appUsers, sortConfig]);


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
                    <li>CRUD Google Cloud SQL Database</li>
                    <li>Google API admin console</li>
                    <li>CRUD Google Workspace Users</li>
                </ul>
            </div>
            <div>
                <h3>Pending:</h3>
                <ul>
                    <li>Sorting before rendering</li>
                    <li>Sorting Table by Column</li>
                </ul>
            </div>
        </div>
        <div>
            <AppusersForm 
                prop_handleUserAction={handleUserAction} 
                prop_userAction={userAction} 
            />
            <h2>[SQL] Signed-Up Users:</h2>
            <table>
                <thead>
                    <tr>
                        <th className="sortable" title="Click to Sort" onClick={() => onSort('lastName')}>Last Name <span className="sort-indicator">{getSortDirectionText('lastName')}</span> </th>
                        <th className="sortable" title="Click to Sort" onClick={() => onSort('firstName')}>First Name <span className="sort-indicator">{getSortDirectionText('firstName')}</span> </th>
                        <th className="sortable" title="Click to Sort" onClick={() => onSort('email')}>Email <span className="sort-indicator">{getSortDirectionText('email')}</span> </th>
                        {/* <th>Password</th> */}
                        <th className="sortable" title="Click to Sort" onClick={() => onSort('type')}>Type <span className="sort-indicator">{getSortDirectionText('type')}</span> </th>
                        <th className="sortable" title="Click to Sort" onClick={() => onSort('status')}>Status <span className="sort-indicator">{getSortDirectionText('status')}</span> </th>
                        {/* <th>Created</th> */}
                        {/*  <th>Updated</th> */}
                        <th>Edit</th>
                        <th>Delete</th>
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