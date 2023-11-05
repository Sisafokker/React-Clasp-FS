import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AppusersForm from "./appusersform";

function Appusers() {
    const [app_users, setApp_users] = useState([]);

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

    // After a new user is added
    const handleUserAdded = () => {
        fetchAppUsers();
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
            <AppusersForm prop_handleUserAdded={handleUserAdded} /> {/* 'prop_handleUserAdded' prop passed to 'AppUsersForm' */}
            <h1>[SQL] Current AppUsers:</h1>
            <ul>
                {app_users.map(u => (
                    <li key={u.students_id}>{u.students_lastName}, {u.students_firstName} 📧 {u.students_email} </li>
                ))}
            </ul>
        </div>
    </div>
}

export default Appusers