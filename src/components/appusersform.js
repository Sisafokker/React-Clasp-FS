import React, { useState, useEffect } from 'react';
import axios from 'axios';

// styles
//import "../styles/appusers-form.scss";

// Compiled CSS Styles files
import "../../apps-script/styles_compiled/appusers-form.css";


const AppusersForm = ({ prop_handleUserAction, prop_userAction }) => { // prop_selectedUser, prop_action
  const [formUser, setFormUser] = useState({
    id: null, firstName: "", lastName: "", email: "", type: "", status: "active"
  });
  const [cancelled, setCancelled] = useState(null)
  const [visuals, setVisuals] = useState({
    btnText: `${prop_userAction.action} User`, showButton: true, formError: null, formSuccess: null
  });

  useEffect(() => {
    console.log("prop_Action: ", prop_userAction.action)
    console.log("prop_User: ", prop_userAction.user)
    if (prop_userAction.user) {
      setFormUser({ ...prop_userAction.user });
      setVisuals(i => ({ ...i, btnText: `${prop_userAction.action} User` }));
    } else {
      setFormUser({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        type: "",
        status: "active",
      });

      setVisuals(i => ({ ...i, btnText: 'Add User', formError: null }));
    }
  }, [prop_userAction]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (cancelled) { // Do nothing 
      console.log("CANCELADO");
      clearForm(true);
      return;
    }

    setVisuals(i => ({ ...i, showButton: false }));

    const userPayload = { ...formUser };
    console.log("userPayload: ", userPayload);

    const url = process.env.REACT_APP_Backend_URL;
    if (prop_userAction.action === "Add") {
      //const url = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api/users`;
      axios.post(`${url}/api/users`, userPayload)
        .then(response => {
          console.log('User added successfully:', response.data);
          prop_handleUserAction(prop_userAction.action); // Call the prop_handleUserAction prop to trigger a refresh of the users list
          clearForm(); // Clear form
        })
        .catch(error => {
          console.error('Add Failed ', error);
          setVisuals(i => ({ ...i, formError: 'Add Failed', showButton: true }));
        });
    } else if (prop_userAction.action === "Edit" && formUser.id) {
      //const url = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api/users/${prop_userAction.user.id}`;
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
    } else if (prop_userAction.action === "Remove" && id) {
      //const url = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api/users/${prop_userAction.user.id}`;
      const url = `${url}/api/users/${prop_userAction.user.id}`;
      axios.delete(url)
        .then(response => {
          console.log('User removed successfully:', response.data);
          prop_handleUserAction(prop_userAction.action);
          clearForm();
        })
        .catch(error => {
          console.error('Remove Failed', error);
          setVisuals(i => ({ ...i, formError: 'Remove Failed', showButton: true }));
        });
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

      prop_userAction.action = "Add"
    }
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
