import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

import AppusersForm from "./appusersform";

function Appusers() {
    const [app_users, setApp_users] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [action, setAction] =useState(null);

    useEffect(() => {
        fetchAppUsers();
    }, []); // Fetch data on initial component mount

    // Get Student Data
    const fetchAppUsers = () => {
        axios.get(`http://localhost:${process.env.REACT_APP_PORT}/api/students`)
            .then(response => {
                setApp_users(response.data);
                console.log("👍students")
            })
            .catch(error => {
                console.error(error);
            });
    };

    // After a new user is added / edited / removed
    const handleUserAction = () => {
        fetchAppUsers();
    };

    const handleEditClick = (u) => {
        console.log("EDIT clicked: ",u)
        setSelectedUser(u);
        setAction("Edit");
    };

    const handleRemoveClick = (u) => {
        console.log("REMOVE clicked: ",u)
        setSelectedUser(u);
        setAction("Remove");
    };
    
    return <div>
        <div>
            <h1>AppUsers Page...</h1>
            <h3>Ideas:</h3>
            <ul>
                <li>CRUD Google Cloud SQL Database</li>
                <li>Google API admin console</li>
                <li>CRUD Google Workspace Users</li>
            </ul>
        </div>
        <div>
            <AppusersForm prop_handleUserAction={handleUserAction} prop_selectedUser={selectedUser} prop_action={action}/>
            <h1>[SQL] Current AppUsers:</h1>
{/*             <ul>
                {app_users.map(u => (
                    <li key={u.students_id}>{u.students_lastName}, {u.students_firstName} 📧 {u.students_email} </li>
                ))}
            </ul> */}
            <table>
                    <thead>
                        <tr>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Email</th>
                            {/* <th>Id</th> */}
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {app_users.map(u => (
                            <tr key={u.students_id}>
                                <td>{u.students_lastName}</td>
                                <td>{u.students_firstName}</td>
                                <td>{u.students_email}</td>
                                {/* <td>{u.students_id}</td> */}
                                <td><FontAwesomeIcon icon={faPenToSquare} className='clickable' onClick={() => handleEditClick(u)}/> </td>
                                <td><FontAwesomeIcon icon={faTrash} className='clickable' onClick={() => handleRemoveClick(u)}/> </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    </div>
}

export default Appusers