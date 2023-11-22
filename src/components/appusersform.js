import React, { useState, useEffect } from 'react';
import axios from 'axios';

// styles
import "../styles/appusers-form.scss";

// Compiled CSS Styles files
//import "../../apps-script/styles_compiled/appusers-form.css";


const AppusersForm = ({ prop_handleUserAction, prop_userAction, prop_companies, prop_intCompUser }) => { 
  console.log("🚀ACTION Prop: ",prop_userAction.action)
  //console.log('❓Received companies:', prop_companies);
  const url = process.env.REACT_APP_Backend_URL;
  const [formUser, setFormUser] = useState({
    id: null, firstName: "", lastName: "", email: "", type: "", status: "active", companyId: [] // companyId: ""
  });
  const [cancelled, setCancelled] = useState(null)
  const [visuals, setVisuals] = useState({
    btnText: `${prop_userAction.action} User`, showButton: true, formError: null, formSuccess: null
  });

   useEffect(() => {
    console.log("🚀prop_Action: ", prop_userAction.action)
    console.log("👤prop_User: ", prop_userAction.user)
    if (prop_userAction.user) {
      setFormUser({ ...prop_userAction.user });
        if (prop_userAction.action !== "Add") { // Get company IDs associated with the user
          const userCompanyIds = prop_intCompUser
            .filter(rowObj => rowObj.userId === prop_userAction.user.id)
            .map(rowObj => rowObj.companyId.toString());

            // prevState_FormUser: the current state BEFORE this update
            setFormUser(prevState_FormUser => ({ ...prevState_FormUser, companyId: userCompanyIds }));
      }

      setVisuals(i => ({ ...i, btnText: `${prop_userAction.action} User` }));
    } else {
      setFormUser({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        type: "",
        status: "active",
        companyId: [], 
      });

      setVisuals(i => ({ ...i, btnText: 'Add User', formError: null }));
    }
  }, [prop_userAction, prop_intCompUser]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (cancelled) {
      console.log("Action Canceled");
      clearForm(true);
      return;
    }

    setVisuals(i => ({ ...i, showButton: false }));

    const userPayload = { ...formUser };
    console.log("userPayload: ", userPayload);

    if (prop_userAction.action === "Add") {
      axios.post(`${url}/api/users`, userPayload)
        .then(response => {
          console.log('User added successfully:', response.data);
          
          // Process intCompanyUser DB Action
          if (userPayload.companyId && userPayload.companyId.length > 0) {
            // 👉Process intCompanyUser DB Action for multiple companies
            const userId = response.data.id;
            const companyAssignments = userPayload.companyId.map(companyId => 
              processCompanyToUserAssignment("Add", companyId, userId)
              );
              console.log('STAGE ONE REACHED!');
              return Promise.all(companyAssignments); // Wait for ALL assignments

            // 👉Process Single intCompanyUser DB 
            // console.log("CompanyId: ", userPayload.companyId)
            // console.log("New UserId:" , response.data.id)
            // return processCompanyToUserAssignment("Add", userPayload.companyId, response.data.id);
          }
          return Promise.resolve(); // If no company assignment is needed, resolve the promise chain
        })
        .then(() => {
          console.log('STAGE TWO REACHED!');
          if (userPayload.companyId && userPayload.companyId.length > 0) {
            console.log('User && CompanyUser success.');
          } else {
            console.log('User success (withouth CompanyUser)');
          }
          console.log('STAGE THREE REACHED!');
          prop_handleUserAction(prop_userAction.action); // Refresh the users list
          clearForm(); // Clear form
        })
        .catch(error => {
          console.log('STAGE FOUR REACHED!');
          console.error('Add Failed: ', error);
          console.error('Error:', error.response ? error.response.data : error.message);
          setVisuals(i => ({ ...i, formError: 'Add Failed', showButton: true }));
        });


    } else if (prop_userAction.action === "Edit" && formUser.id) {
      axios.patch(`${url}/api/users/${prop_userAction.user.id}`, userPayload)
        .then(response => {
          console.log('User edited successfully:', response.data);
          prop_handleUserAction(prop_userAction.action);
          clearForm();
        })
        .catch(error => {
          console.error("Edit Failed", error);
          setVisuals(i => ({ ...i, formError: 'Edit Failed', showButton: true }));
        });

    } else if (prop_userAction.action === "Remove" && formUser.id) {
      axios.delete(`${url}/api/users/${prop_userAction.user.id}`)
        .then(response => {
          console.log('User removed successfully:', response.data);
          prop_handleUserAction(prop_userAction.action);
          clearForm();
        })
        .catch(error => {
          console.error('Remove Failed', error);
          setVisuals(i => ({ ...i, formError: 'Remove Failed', showButton: true }));
        });
    } else {
      console.error("prop_userAction.action???: ", prop_userAction.action)
      setVisuals(i => ({ ...i, formError: 'Add Failed', showButton: true }));
    }
  };

// Intermediary tables
const processCompanyToUserAssignment = (backendAction, companyId, userId) => {
  let endpoint = `${url}/api/intCompanyUser`;
  if (backendAction === "Add" && companyId) {
    return axios.post(endpoint, { companyId, userId }) // Return promise
        .then(response => {
          console.log('intCompanyUser added successfully:', response.data);
        })
        .catch(error => {
          console.error('Error adding intCompanyUser:', error);
          throw error; // Need to propagate the error
        });
  } else if (backendAction === "Remove" && companyId) {
    return axios.delete(endpoint, { data: { companyId, userId } }) // Return promise
    .then(response => {
        console.log('Relationship deleted successfully:', response.data);
        // Update UI or state as necessary
    })
    .catch(error => {
      console.error('Error adding intCompanyUser:', error);
      throw error; // Need to propagate the error
    });

  }else {
    console.log("Only ADD actions have been setup for now.");
    return Promise.reject('Missing companyId?? or invalid action??'); // Reject to propagate
  }
};


  const canSubmitForm = () => {
    return formUser.firstName != "" && formUser.lastName != "" && formUser.email != ""
    && ["admin", "usuario"].includes(formUser.type) && ["active", "inactive"].includes(formUser.status)  
    //&& formUser.type != "" && formUser.status != "";
  };

  // Function to clear form and reset state
  const clearForm = (wasCancelled) => {
    setFormUser({
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      type: '',
      status: 'active',
      companyId: '',
    });

    if (wasCancelled) {
      setVisuals({
        btnText: 'Add User',
        showButton: true,
        formError: null,
        formSuccess: null
      });
    } else {
      setVisuals({
        ...visuals,
        formError: null,
        showButton: true,
        formSuccess: `👍 ${prop_userAction.action} User 👍`
      });

      setTimeout(() => {
        setVisuals({
          ...visuals,
          formError: null,
          formSuccess: null,
          btnText: 'Add User'
        });
      }, 1500);
    }
    prop_userAction.action = "Add"
  };

  return (
    <div>
      {/* <h1>{formUser.type} {formUser.status} </h1> */}
      <h2>[SQL] CRUD User</h2>
      <div className="form-container">
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <label>First Name: <input type="text" value={formUser.firstName} onChange={(e) => setFormUser({ ...formUser, firstName: e.target.value })} /> </label>
            <label>Last Name: <input type="text" value={formUser.lastName} onChange={(e) => setFormUser({ ...formUser, lastName: e.target.value })} /> </label>
            <label>Email: <input type="text" value={formUser.email} onChange={(e) => setFormUser({ ...formUser, email: e.target.value })} /> </label>
            {/* <label>Type: <input type="text" value={formUser.type} onChange={(e) => setFormUser({ ...formUser, type: e.target.value })} /> </label>
            <label>Status: <input type="text" value={formUser.status} onChange={(e) => setFormUser({ ...formUser, status: e.target.value })} /> </label> */}
            <label>Type: <select value={formUser.type} onChange={(e) => setFormUser({ ...formUser, type: e.target.value })}>
                            <option value="">Select type</option>
                            <option value="admin">admin</option>
                            <option value="usuario">usuario</option>
                          </select>
            </label>
            <label>Status: <select value={formUser.status} onChange={(e) => setFormUser({ ...formUser, status: e.target.value })}>
                            <option value="">Select status</option>
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                          </select>
            </label>
            {/* <label>Company: <select value={formUser.companyId} onChange={(e) => setFormUser({ ...formUser, companyId: e.target.value })} 
                            disabled={formUser.type === '' || formUser.status === 'inactive'}>
                            <option value="">Select a company</option>
                            {prop_companies.map(company => {
                              //console.log('Mapping company:', company); // Debug!
                              return (
                                <option key={company.companyId} value={company.companyId}>
                                  {company.companyName}
                                </option>
                                  );
                              })}
                            </select>
            </label> */}
            <label>Customers: [{formUser.companyId.length}] <select multiple value={formUser.companyId} // 'multiple' will now make this an array
                            onChange={(e) => { const selectedCompanyIds = Array.from(e.target.selectedOptions, option => option.value);
                              setFormUser({ ...formUser, companyId: selectedCompanyIds });
                              console.log("Selected Companies❓: ", selectedCompanyIds);
                            }}
                            disabled={formUser.type === '' || formUser.status === 'inactive'} >
                            {prop_companies.map(company => {
                              return (
                                <option key={company.companyId} value={company.companyId}>
                                  {company.companyName}
                                </option>
                                  );
                            })}
                            </select>
            </label>
          </div>
          <div>
            {visuals.formError && <div className='errorWarning'>{visuals.formError}</div>}
            {visuals.formSuccess && <div className='successWarning'>{visuals.formSuccess}</div>}
            {visuals.showButton && <button className='button advance' type="submit" disabled={!canSubmitForm()} onClick={() => setCancelled(false)} >{visuals.btnText}</button>}
            {visuals.showButton && <button className='button cancel' type="submit" onClick={() => setCancelled(true)}  >Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppusersForm;
