// OAuth_Form.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '../Context';

// Styles
import '../styles/oauth_form.scss';

const OAuth_Form = () => {
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
      setFeedback({ error: `❌ Both Passwords must be equal. Modify and try again`, success: null });
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
  
    //const url = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/api/${isSignUp ? 'signup' : 'login'}`;
    const url = `${process.env.REACT_APP_Backend_URL}/api/${isSignUp ? 'signup' : 'login'}`;
    try {
      const response = await axios.post(url, requestData);
      console.log("Success!")
      console.log(response.data.user)
      
      const userObj = {
        name: response.data.user.firstName + " " +response.data.user.lastName,
        email: response.data.user.email
      };

      if (isSignUp) {
        setFeedback({ 
          success: `👍👍 Congratulations ${userObj.name}, your email ${userObj.email} was approved. You can now login`, 
          error: null 
        });
  
        // Reset form & pass email for login
        setFormData({
          email: userObj.email,
          password: '',
          passwordOne: '',
          passwordTwo: '',
          firstName: '',
          lastName: ''
        });
  
        setIsSignUp(false); // Switch to the login form
  
      } else {
        // For login, set the user in context and clear feedback
        setUser(userObj);
        setFeedback({ success: 'SignIn Success!', error: null });
      }
  
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setFeedback({ error: error.response.data.error, success: null });
      } else {
        setFeedback({ error: 'An unexpected error occurred.', success: null });
      }
    }
  };
  

  const updateFormData = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <div className="oauth-form-container">
      <form onSubmit={handleFormSubmit}>
        {isSignUp && (
          <div className='signUp-wrapper'>
            <div className='input-group'>
              <label>Name: <input type="text" name="firstName" placeholder="Your First Name" value={formData.firstName} onChange={updateFormData('firstName')} required /> </label>
              <label>Last Name: <input type="text" name="lastName" placeholder="Your Last Name" value={formData.lastName} onChange={updateFormData('lastName')} required /> </label>
              <label>Email: <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={updateFormData('email')} required /> </label>
              <label>Password: <input type="password" name="passwordOne" placeholder="Your Password" value={formData.passwordOne} onChange={updateFormData('passwordOne')} required /> </label>
              <label>Confirm Password: <input type="password" name="passwordTwo" placeholder="Confirm Your Password" value={formData.passwordTwo} onChange={updateFormData('passwordTwo')} required /> </label>
            </div>
          </div>
        )}

        {!isSignUp && (
          <div className='logIn-wrapper'>
            <div className='input-group'>
            <label>Email: <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={updateFormData('email')} required /> </label>
            <label>Password: <input type="password" name="password" placeholder="Your Password" value={formData.password} onChange={updateFormData('password')} required /> </label>
            </div>
          </div>
        )}
        <div>
          <div className='signLogButton'>
            <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
            {isSignUp ? (
              <a href="#login" onClick={() => setIsSignUp(false)}>Or Log In here</a>
            ) : (
              <a href="#signup" onClick={() => setIsSignUp(true)}>Or Sign Up here</a>
            )}
            </div>
        </div>
      </form>
      {feedback.error && <div className="error">{feedback.error}</div>}
      {feedback.success && <div className="success">{feedback.success}</div>}
    </div>
  );

};

export default OAuth_Form;
