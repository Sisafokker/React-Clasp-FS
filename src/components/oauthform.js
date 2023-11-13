// OAuthForm.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '../Context';

const OAuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { setUser } = useContext(Context);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordOne: '',
    passwordTwo: '',
    firstName: '',
    lastName: ''
  });

  const [feedback, setFeedback] = useState({ error: null, success: null });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (isSignUp && formData.passwordOne !== formData.passwordTwo) {
      setFeedback({ error: 'Both Passwords do not match', success: null });
      return;
    }

    const requestData = isSignUp
      ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.passwordOne
      }
      : {
        email: formData.email,
        password: formData.password
      };

    const url = `http://localhost:${process.env.REACT_APP_PORT}/api/${isSignUp ? 'signup' : 'login'}`;

    try {
      const response = await axios.post(url, requestData);
      console.log("Success!")
      console.log(response.data.user)

      const userObj = {
        name: response.data.user.firstName + " " + response.data.user.lastName,
        email: response.data.user.email
      };

      setUser(userObj);
      setFeedback({ success: 'Success!', error: null });
    } catch (error) {
      setFeedback({ error: error.response.data.message, success: null });
    }
  };

  const updateFormData = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        {isSignUp && (
          <>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={updateFormData('firstName')} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={updateFormData('lastName')} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={updateFormData('email')} required />
            <input type="password" name="passwordOne" placeholder="Password" value={formData.passwordOne} onChange={updateFormData('passwordOne')} required />
            <input type="password" name="passwordTwo" placeholder="Repeat Password" value={formData.passwordTwo} onChange={updateFormData('passwordTwo')} required />
          </>
        )}

        {!isSignUp && (
          <>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={updateFormData('email')} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={updateFormData('password')} required />
          </>
        )}

        <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
        {isSignUp ? (
          <a href="#login" onClick={() => setIsSignUp(false)}>Or Log In here</a>
        ) : (
          <a href="#signup" onClick={() => setIsSignUp(true)}>Or Sign Up here</a>
        )}
      </form>
      {feedback.error && <div className="error">{feedback.error}</div>}
      {feedback.success && <div className="success">{feedback.success}</div>}
    </div>
  );

};

export default OAuthForm;
