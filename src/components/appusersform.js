import React, { useState } from 'react';
import axios from 'axios';

const AppUsersForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make API Request to Add AppUser
    axios.post(`http://localhost:${process.env.REACT_APP_PORT}/api/students`, {
        students_firstName: firstName,
        students_lastName: lastName,
        students_email: email
    })
      .then(response => {
        console.log('AppUser added successfully:', response.data);
        // Handle success, e.g., redirect to the appusers list page
      })
      .catch(error => {
        console.error(error);
        // Handle error, show error message to the user
      });
  };

  return (
    <div>
      <h2>Add AppUser</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button type="submit">Add AppUser</button>
      </form>
    </div>
  );
};

export default AppUsersForm;
