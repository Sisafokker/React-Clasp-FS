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
    const [userAction, setUserAction] = useState({ user: null, action: "Add" });
    const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'ascending' });  // keep track of current sorting
    const [companies, setCompanies] = useState([]);
    const [intCompUser, setIntCompUser] = useState([]);
    const url = process.env.REACT_APP_Backend_URL

    useEffect(() => {
        fetchAppUsers();
        fetchCompanies();
        fetchIntCompanyUser();
    }, []); // Fetch data on initial component mount
    
      const fetchCompanies = () => {
        axios.get(`${url}/api/companies`)
            .then(response => {
                setCompanies(response.data);
                console.log('Companies: ', response.data);
            })
            .catch(console.error);
      };

      const fetchIntCompanyUser = () => {
        axios.get(`${url}/api/intCompanyUSer`)
            .then(response => {
                setIntCompUser(response.data);
                console.log('IntCompUser: ', response.data);
            })
            .catch(console.error);
      };

    const fetchAppUsers = useCallback(() => {  // useCallback => React Hook that lets you cache a function definition between re-renders.
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
        fetchIntCompanyUser();
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
        <div>
            <AppusersForm 
                prop_handleUserAction={handleUserAction} 
                prop_userAction={userAction} 
                prop_companies={companies}
                prop_intCompUser={intCompUser}
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