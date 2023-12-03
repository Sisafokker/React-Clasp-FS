import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faSquareMinus } from '@fortawesome/free-solid-svg-icons';

// styles
import "../styles/appusers_form.scss";

// Compiled CSS Styles files
//import "../../apps-script/styles_compiled/appusers-form.css";


const AppusersForm = ({ prop_handleUserAction, prop_userAction, prop_companies, prop_intCompUser }) => {
  console.log("👤ACTION Prop: ", prop_userAction.action)
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
    console.log("👤prop_Action: ", prop_userAction.action)
    console.log("👤prop_User: ", prop_userAction.user)
    if (prop_userAction.user) {
      setFormUser({ ...prop_userAction.user });
      if (prop_userAction.action !== "Add") { // Get company IDs associated with the user
        const userCompanyIds = prop_intCompUser
          .filter(rowObj => rowObj.userId === prop_userAction.user.id)
          .map(rowObj => rowObj.companyId.toString());

        // Callback function to ensure I am working with the most current state.
        /* In the context of React's state setter functions (like setFormUser, setCancelled, etc), when you use a callback fx, 
           the first argument of that callback fx automatically represents the previous state of the associated state variable. */
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
  }, [prop_userAction]);

  const handleCancel = () => {
    console.log("👤Action Canceled");
    clearForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    console.log("1 - Form Submit Initiated");

    if (cancelled) {
      return;
    }

    console.log("2 - Processing Form: ", formUser);
    setVisuals(i => ({ ...i, showButton: false }));

    const userPayload = { ...formUser };
    console.log("👤userPayload: ", userPayload);

    if (prop_userAction.action === "Add") {
      console.log("3.1 Adding User...");
      axios.post(`${url}/api/users`, userPayload)
        .then(response => {
          console.log('👤User added successfully:', response.data);

          // Process intCompanyUser DB Action
          if (userPayload.companyId && userPayload.companyId.length > 0) {
            // 👉Process intCompanyUser DB Action for multiple companies
            const userId = response.data.id;
            const companyAssignments = userPayload.companyId.map(companyId =>
              processCompanyToUserAssignment("Add", companyId, userId)
            );
            console.log('👤STAGE ONE REACHED!');
            return Promise.all(companyAssignments); // Wait for ALL assignments
          }
          return Promise.resolve(); // If no company assignment is needed, resolve the promise chain
        })
        .then(() => {
          console.log('👤STAGE TWO REACHED!');
          if (userPayload.companyId && userPayload.companyId.length > 0) {
            console.log('👤User && CompanyUser success.');
          } else {
            console.log('👤User success (withouth CompanyUser)');
          }

          prop_handleUserAction(prop_userAction.action); // Refresh the users list
          clearForm(); // Clear form
        })
        .catch(error => {
          console.error('👤Add Failed: ', error);
          console.error('👤Error:', error.response ? error.response.data : error.message);
          setVisuals(i => ({ ...i, formError: 'Add Failed', showButton: true }));
        });


    }
    else if (prop_userAction.action === "Edit" && formUser.id) {
      axios.patch(`${url}/api/users/${prop_userAction.user.id}`, userPayload)
        .then(response => {
          console.log('👤User edited successfully:', response.data);

          // Remove company-user relationships for this user
          const deletePromises = prop_intCompUser
            .filter(rowObj => rowObj.userId === prop_userAction.user.id)
            .map(rowObj => processCompanyToUserAssignment("Remove", rowObj.companyId, prop_userAction.user.id));

          return Promise.all(deletePromises);
        })
        .then(() => {
          // Create new company-user relationships for this user
          const addPromises = userPayload.companyId.map(companyId =>
            processCompanyToUserAssignment("Add", companyId, prop_userAction.user.id));

          return Promise.all(addPromises);
        })
        .then(() => {
          console.log('👤CompanyUser relationships updated successfully');
          prop_handleUserAction(prop_userAction.action); // Refresh the users list
          clearForm();
        })
        .catch(error => {
          console.error("👤Edit Failed", error);
          setVisuals(i => ({ ...i, formError: 'Edit Failed', showButton: true }));
        });
    }

    else if (prop_userAction.action === "Remove" && formUser.id) {
      console.log("3.3 Deleting User...");
      axios.delete(`${url}/api/users/${prop_userAction.user.id}`)
        .then(response => {
          console.log('👤User removed successfully:', response.data);
          prop_handleUserAction(prop_userAction.action);
          clearForm();
        })
        .catch(error => {
          console.error('👤Remove Failed', error);
          setVisuals(i => ({ ...i, formError: 'Remove Failed', showButton: true }));
        });
    } else {
      console.log("3.❌ Unknown action...");
      console.error("👤prop_userAction.action???: ", prop_userAction.action)
      setVisuals(i => ({ ...i, formError: 'Add Failed', showButton: true }));
    }
  };

  // Intermediary tables
  const processCompanyToUserAssignment = (backendAction, companyId, userId) => {
    let endpoint = `${url}/api/intCompanyUser`;
    if (backendAction === "Add" && companyId) {
      return axios.post(endpoint, { companyId, userId })
        .then(response => {
          console.log('👤intCompanyUser added successfully:', response.data);
        })
        .catch(error => {
          console.error('👤Error adding intCompanyUser:', error);
          throw error;
        });
    } else if (backendAction === "Remove" && companyId) {
      return axios.delete(endpoint, { data: { companyId, userId } })
        .then(response => {
          console.log('👤Relationship deleted successfully:', response.data);
        })
        .catch(error => {
          console.error('👤Error adding intCompanyUser:', error);
          throw error;
        });

    } else {
      console.log("👤Only ADD actions have been setup for now.");
      return Promise.reject('Missing companyId?? or invalid action??'); // Reject to propagate
    }
  };

  const canSubmitForm = () => {
    let isValidEmail = formUser.email && /\S+@\S+\.\S+/.test(formUser.email);
    if (prop_userAction.action === "Remove") {
      return isValidEmail;
    } else {
      let isValidFirstName = formUser.firstName && formUser.firstName.length >= 3;
      let isValidLastName = formUser.lastName && formUser.lastName.length >= 3;
      let isValidType = ["admin", "usuario"].includes(formUser.type);
      let isValidStatus = ["active", "inactive"].includes(formUser.status);

      return isValidFirstName && isValidLastName && isValidEmail && isValidType && isValidStatus;
    }
  }

  // Function to clear form and reset state
  const clearForm = (wasCancelled) => {
    console.log("👤Clearing Form ----------")
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
      setVisuals({ btnText: 'Add User', showButton: true, formError: null, formSuccess: null });
    } else {
      setVisuals({ ...visuals, formError: null, showButton: true, formSuccess: `User ${prop_userAction.action}ed ✔` });

      setTimeout(() => {
        setVisuals({ ...visuals, formError: null, formSuccess: null, btnText: 'Add User' });
      }, 1500);
    }
    prop_userAction.action = "Add"
  };

  const selectElement = document.querySelector('.multi-selector');
  const addAllCompanies = () => {
    Array.from(selectElement.options).forEach(option => option.selected = true);
  };

  const removeAllCompanies = () => {
    Array.from(selectElement.options).forEach(option => option.selected = false);
  };

  return (
    <div>
      {/* <h1>{formUser.type} {formUser.status} </h1> */}
      <div className="form-container">
        <div className='section-title'> CRUD Users</div>
        <form onSubmit={handleFormSubmit}>
          <div className="buttons-and-warnings">
            <div className="buttons-container">
              {visuals.showButton && <button className='button advance' type="submit" disabled={!canSubmitForm()}
                title={!canSubmitForm() ? "Missing or incorrect values" : prop_userAction.action} onClick={() => setCancelled(false)} >{visuals.btnText}</button>}
              {visuals.showButton && <button className='button cancel' type="button" onClick={handleCancel}>Cancel</button>}
            </div>
            <div className="warnings-container">
              {visuals.formError && <div className='errorWarning'>{visuals.formError}</div>}
              {visuals.formSuccess && <div className='successWarning'>{visuals.formSuccess}</div>}
            </div>
          </div>
          <div className="input-group">
            <label>First Name: <input type="text" value={formUser.firstName} onChange={(e) => setFormUser({ ...formUser, firstName: e.target.value })} /> </label>
            <label>Last Name: <input type="text" value={formUser.lastName} onChange={(e) => setFormUser({ ...formUser, lastName: e.target.value })} /> </label>
            <label>Email: <input type="text" value={formUser.email} onChange={(e) => setFormUser({ ...formUser, email: e.target.value })} /> </label>
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
            <div className="customer-select">
              <div>
                <FontAwesomeIcon className="faicon" icon={faSquareCheck} onClick={addAllCompanies} title='Select ALL'>All</FontAwesomeIcon>
                <span title='Use "Shift"/"Ctrl" for multi selection'>⇐ selection ⇒ </span>
                <FontAwesomeIcon className="faicon" icon={faSquareMinus} onClick={removeAllCompanies} title='Select NONE'>None</FontAwesomeIcon>
              </div>
            </div>
            <label className='label-multi-selector'>Customers: [{formUser.companyId.length}]
              <select multiple className='multi-selector' value={formUser.companyId}
                onChange={(e) => {
                  const selectedCompanyIds = Array.from(e.target.selectedOptions, option => option.value);
                  setFormUser({ ...formUser, companyId: selectedCompanyIds });
                }}
                disabled={formUser.type === '' || formUser.status === 'inactive'} >
                {prop_companies.map(company => (
                  <option key={company.companyId} value={company.companyId}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppusersForm;
