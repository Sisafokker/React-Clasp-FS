import React, { useState } from 'react';
import axios from 'axios';

const AppusersForm = ({ prop_handleUserAdded }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:${process.env.REACT_APP_PORT}/api/students`, {
            students_firstName: firstName,
            students_lastName: lastName,
            students_email: email
        })
            .then(response => {
                console.log('AppUser added successfully:', response.data);
                prop_handleUserAdded();// Call the prop_handleUserAdded prop to trigger a refresh of the App Users list
                clearForm(); // Clear form
            })
            .catch(error => {
                console.error(error);
                setFormError('Form Failed. Please try again.'); 
            });
    };

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setFormError(null);
        setFormSuccess("👍 New Users was added");
    }

    return (
        <div>
            <h2>[SQL] Add AppUser</h2>
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
                <button type="submit">Add AppUser</button>
                </div>
            </form>
        </div>
    );
};

export default AppusersForm;
