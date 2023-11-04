import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AppUsersForm from "./appusersform";
function Appusers() {
    const [app_users, setApp_users] = useState([]);

    useEffect(() => {
        // Make API Request to Fetch Student Data
        axios.get(`http://localhost:${process.env.REACT_APP_PORT}/api/students`)
          .then(response => {
            setApp_users(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }, []);

    return <div>
    <div>
       <h1>AppUsers Page...</h1>
       <h3>Ideas:</h3>
       <ul>
        <li>Google API admin console</li>
        <li>CRUD Google Workspace Users</li>
        <li>CRUD Google Cloud SQL Database</li>
       </ul>
    </div>
    <div>
      <h1>SQL AppUsers List</h1>
      <AppUsersForm />
      <ul>
        {app_users.map(u => (
          <li key={u.students_id}>{u.students_firstName} {u.students_lastName}</li>
        ))}
      </ul>
    </div>
    </div>
}

export default Appusers