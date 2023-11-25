import React, { useEffect, useState, useContext } from "react";
import { Context } from "../Context";
import axios from 'axios';

import CRMCompanyList from "./crm_company_list";
import CRMCompanyDetail from "./crm_company_detail";
import CRMOrderList from "./crm_order_list";
import CRMOrderDetail from "./crm_order_detail";


const CRM = () => {
    const { user } = useContext(Context);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('api/companies');
            // Filter companies based User.type  🚩🚩 => pending user.status. What to do if status unverified or inactive?
            // Think... Should I create a filter fx for every SQL? 
            let filteredCompanies;
            if (user && user.userType === 'usuario') {
                filteredCompanies = response.data.filter(company => company.userId === userId) 
            } else {
                filteredCompanies = response.data;
            }
            
            setCompanies(filteredCompanies);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleCompanySelect = async (companyId) => {
        setSelectedCompany(companyId);
        // Get Order_List of selected Company
        // ...
        // ...
        // ...
        // ...
    };

    const handleOrderSelect = (orderId) => {
        setSelectedOrder(orderId);
        // Get crm_order_details of selected Order
        // ...
        // ...
        // ...
        // ...
    };

    return (
        <div>
            <h1>CRM Dashboard</h1>
            <div>
                <h2>Companies</h2>
                {/* Render crm_company_list */}
                {companies.map(company => (
                    <div key={company.id} onClick={() => handleCompanySelect(company.id)}>
                        {company.name}
                    </div>
                ))}
            </div>

            {selectedCompany && (
                <div>
                    <h2>Orders for {selectedCompany}</h2>
                    {/* Render crm_order_list */}
                    {/* ... */}
                    {/* ... */}
                    {/* ... */}
                    {/* ... */}
                </div>
            )}

            {selectedOrder && (
                <div>
                    <h2>Order Details</h2>
                    {/* Render crm_order_details */}
                    {/* ... */}
                    {/* ... */}
                    {/* ... */}
                    {/* ... */}
                </div>
            )}
        </div>
    );
};

export default CRM;
