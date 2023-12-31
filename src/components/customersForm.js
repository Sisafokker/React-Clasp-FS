// crm/components/customersForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// styles
import "../styles/appusers_form.scss";

const CustomersForm = ({ prop_handleCustomerAction, prop_customerAction, prop_customers }) => {
   // console.log("🏫ACTION Prop: ", prop_customerAction.action);
    const backendUrl = process.env.REACT_APP_Backend_URL;
    const url = `${backendUrl}/api/companies`

    const [formCustomer, setFormCustomer] = useState({ companyId: '', companyName: '',companyAddress: '', industry:'', country: '', state: '', status:'active'});
    const [visuals, setVisuals] = useState({ btnText: `${prop_customerAction.action} Customer`, showButton: true, formError: null, formSuccess: null });

    useEffect(() => {
      //  console.log("🏫prop_Action: ", prop_customerAction.action);
       // console.log("🏫prop_Customer: ", prop_customerAction.customer);
    
        if (prop_customerAction.customer) {
            setFormCustomer({
                companyId: prop_customerAction.customer.companyId || '',
                companyName: prop_customerAction.customer.companyName || '',
                companyAddress: prop_customerAction.customer.companyAddress || '',
                industry: prop_customerAction.customer.industry || '',
                country: prop_customerAction.customer.country || '',
                state: prop_customerAction.customer.state || '',
                status: prop_customerAction.customer.status || 'active'
            });
            setVisuals(v => ({ ...v, btnText: `${prop_customerAction.action} Customer` }));
        } else {
            setFormCustomer({ companyId:'', companyName:'', companyAddress:'', industry: '', country: '', state: '', status: 'active' });
            setVisuals(v => ({ ...v, btnText: 'Add Customer', formError: null }));
        }
    }, [prop_customerAction]);


    const handleCancel = () => {
      //  console.log("🏫Action Canceled");
        clearForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCustomer(prevState => ({ ...prevState, [name]: value }));
    };

    // Refactored using Swith. If you have time do the same in appusersform (more complex due to intCompUser)
    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        if (!canSubmitForm()) {
            setVisuals(v => ({ ...v, formError: 'All fields must be filled and > 2 characters long', showButton: true }));
            return;
        }
    
        const customerPayload = { ...formCustomer };
        //console.log("customerPayload: ", customerPayload);
    
        switch (prop_customerAction.action) {
            case "Add":
                axiosCall('post', `${url}`, customerPayload, 'Customer added successfully', 'Add');
                break;
            case "Edit":
                axiosCall('patch', `${url}/${formCustomer.companyId}`, customerPayload, 'Customer edited successfully', 'Edit');
                break;
            case "Remove":
                axiosCall('delete', `${url}/${formCustomer.companyId}`, null, 'Customer removed successfully', 'Remove');
                break;
            default:
                setVisuals(v => ({ ...v, formError: 'Unknown Action', showButton: true }));
                setTimeout(() => { setVisuals(v => ({ ...v, formError: null })); }, 1500);
                break;
        }
    };
    
    const axiosCall = (method, endpoint, payload, successMessage, action) => {
        axios[method](endpoint, payload)
            .then(response => {
                console.log(`Customer ${action}ed successfully:`, response.data);
                prop_handleCustomerAction(action);
                clearForm()
                setVisuals(v => ({ ...v, formSuccess: successMessage, formError: null }));
                setTimeout(() => { setVisuals(v => ({ ...v, formSuccess: null })); }, 1500);
            })
            .catch(error => {
                console.error(`${action} Failed: `, error);
                setVisuals(v => ({ ...v, formError: `${action} Failed`, showButton: true }))
                setTimeout(() => { setVisuals(v => ({ ...v, formError: null })); }, 1500)
            });
    };
    

    const canSubmitForm = () => {
        const fields = ['companyName', 'companyAddress', 'industry', 'country', 'state', 'status'];
        for (let field of fields) {
            if (!formCustomer[field] || formCustomer[field].trim().length < 2) {
                return false;
            }
        }
        return true;
    };

    // Clear form and reset state
    const clearForm = (wasCancelled) => {
       // console.log("🏫Clearing Form ----------");
        setFormCustomer({ companyId: '', companyName: '', companyAddress: '', industry: '', country: '', state: '' ,status: 'active' });

        const newVisuals = {
            btnText: 'Add Customer',
            showButton: true,
            formError: null,
            formSuccess: wasCancelled ? null : `Customer ${prop_customerAction.action}ed ✔`
        };

        if (!wasCancelled) {
            setTimeout(() => {
                setVisuals({ ...newVisuals, formSuccess: null, btnText: 'Add Customer' });
            }, 1500);
        } else {
            setVisuals(newVisuals);
        }
        prop_customerAction.action = "Add";
    };

    return (
        <div>
            <div className="form-container">
                <div className='section-title'> CRUD Customers</div>
                <form onSubmit={handleFormSubmit}>
                    <div className="buttons-and-warnings">
                        <div className="buttons-container">
                            {visuals.showButton && (
                                <button className='button advance' type="submit" disabled={!canSubmitForm()}>
                                    {visuals.btnText}
                                </button>
                            )}
                            <button className='button cancel' type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                        <div className="warnings-container">
                            {visuals.formError && <div className='errorWarning'>{visuals.formError}</div>}
                            {visuals.formSuccess && <div className='successWarning'>{visuals.formSuccess}</div>}
                        </div>
                    </div>

                    <label> Company Name:<input type="text" name="companyName" value={formCustomer.companyName}  onChange={handleChange} /></label>
                    <label> Address: <input type="text" name="companyAddress" value={formCustomer.companyAddress} onChange={handleChange} /> </label>
                    <label> State:<input type="text" name="state"  value={formCustomer.state} onChange={handleChange} /></label>
                    <label> Country: <input type="text" name="country" value={formCustomer.country} onChange={handleChange} /> </label>
                    <label> Industry: <input type="text" name="industry" value={formCustomer.industry} onChange={handleChange} /> </label>
                    <label> Status: <select name="status" value={formCustomer.status} onChange={handleChange}>
                            <option value="">Select status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                </form>
            </div>
        </div>
    );
};

export default CustomersForm;
