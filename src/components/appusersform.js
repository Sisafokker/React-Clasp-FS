import React, { useState, useEffect } from 'react';
import axios from 'axios';

// styles
import "../styles/appusers-form.scss";

const AppusersForm = ({ prop_handleUserAction, prop_selectedUser, prop_action }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState(null);
    const [action, setAction] = useState('Add');
    const [btnText, setBtnText] = useState(`${action} User`);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        if (prop_selectedUser) {
            setId(prop_selectedUser.students_id);
            setFirstName(prop_selectedUser.students_firstName);
            setLastName(prop_selectedUser.students_lastName);
            setEmail(prop_selectedUser.students_email);
            setAction(prop_action);
            setBtnText(`${prop_action} user`);
            setFormSuccess(null);
        } else {
            setFirstName('');
            setLastName('');
            setEmail('');
        }
    }, [prop_selectedUser, prop_action]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setShowButton(false);
        if (action === "Add") {
            axios.post(`http://localhost:${process.env.REACT_APP_PORT}/api/students`, {
                students_firstName: firstName,
                students_lastName: lastName,
                students_email: email
            })
                .then(response => {
                    console.log('AppUser added successfully:', response.data);
                    prop_handleUserAction(action);// Call the prop_handleUserAction prop to trigger a refresh of the App Users list
                    clearForm(); // Clear form
                })
                .catch(error => {
                    console.error(error);
                    setFormError('Add Failed. Please try again.');
                    setShowButton(true);
                });
        } else if (action === "Edit" && id) {
            console.log("Edit ID:",id)
            axios.patch(`http://localhost:${process.env.REACT_APP_PORT}/api/students/${id}`, {
                students_firstName: firstName,
                students_lastName: lastName,
                students_email: email
            })
                .then(response => {
                    console.log('AppUser edited successfully:', response.data);
                    prop_handleUserAction(action);
                    clearForm();
                })
                .catch(error => {
                    console.error(error);
                    setFormError('Edit Failed. Please try again.');
                    setShowButton(true);
                });
        } else if (action === "Remove" && id) {
            console.log("Remove ID:",id)
            axios.delete(`http://localhost:${process.env.REACT_APP_PORT}/api/students/${id}`)
                .then(response => {
                    console.log('AppUser removed successfully:', response.data);
                    prop_handleUserAction(action);
                    clearForm();
                })
                .catch(error => {
                    console.error(error);
                    setFormError('Remove Failed. Please try again.');
                    setShowButton(true);
                });
        }
    };

    const clearForm = () => {
        setId(null);
        setFirstName('');
        setLastName('');
        setEmail('');
        setFormError(null);
        setFormSuccess(`👍 ${action} User 👍`);
        
        setTimeout(() => {
            setFormSuccess(null);
            setAction('Add');
            setBtnText('Add user');
            setShowButton(true);
        }, 1500);
    }

    return (
        <div>
            <h2>[SQL] Add AppUser</h2>
            <div className="form-container">
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label>
                            First Name:
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Email:
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        {formError && <div className='errorWarning'>{formError}</div>}
                        {formSuccess && <div className='successWarning'>{formSuccess}</div>}
                        {showButton && <button className='button' type="submit">{btnText}</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppusersForm;
