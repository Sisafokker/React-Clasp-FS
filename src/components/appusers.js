import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import AppusersForm from "./appusersform";

// styles
import "../styles/main.scss";
import "../styles/appusers-table.scss";

function Appusers() {
    const [appUsers, setAppUsers] = useState([]);
    const [userAction, setUserAction] = useState({ user: null, action: null });

    useEffect(() => {
        fetchAppUsers();
    }, []); // Fetch data on initial component mount

    // Get Student Data
    const fetchAppUsers = useCallback(() => {  // useCallback => React Hook that lets you cache a function definition between re-renders.
        const url = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api/users`;
        axios.get(url)
            .then(response => {
                setAppUsers(response.data);
                console.log("Fetched app users");
            })
            .catch(console.error);
    }, []);

    // const fetchAppUsers = () => {
    //     axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api/users`)
    //         .then(response => {
    //             setApp_users(response.data);
    //             console.log("👍students")
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // };

     // After a new user is added / edited / removed
     const handleUserAction = useCallback(() => {
        fetchAppUsers();
    }, [fetchAppUsers]);

    const handleAction = (user, action) => {
        setUserAction({ user, action });
    };

    const renderTableRows = appUsers.map(u => (
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

    return <div>
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
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Email</th>
                        {/* <th>Password</th> */}
                        <th>Type</th>
                        <th>Status</th>
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