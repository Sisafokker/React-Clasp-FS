// crm.js parent-component
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../Context";
import axios from 'axios';

import CRMCompanyList from "./crm_company_list";
import CRMCompanyDetail from "./crm_company_detail";
import CRMOrderList from "./crm_order_list";
import CRMOrderDetail from "./crm_order_detail";

// styles
import "../styles/crm.scss";

const CRM = () => {
    const url = process.env.REACT_APP_Backend_URL
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
            const response = await axios.get(`${url}/api/companies`);
                console.log("CRM👍get_companies: ",response)
            // Filter companies based User.type  🚩🚩 => pending user.status. What to do if status unverified or inactive?
            // Think... Should I create a filter fx for every SQL? 
            let filteredCompanies;
            if (response.status === 200) {
                if (user && user.userType === 'usuario') {
                    filteredCompanies = response.data.filter(company => company.userId === userId) 
                } else {
                    filteredCompanies = response.data;
                }  
                setCompanies(filteredCompanies);
                console.log("User👍Prop_Companies: ",companies)
            } else {
                console.error("CRM ❌")
                setCompanies(null);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            setCompanies(null);
        }
    };

    const handleCompanySelect = async (companyId) => {
        setSelectedCompany(companyId); // Changes state of companyClicked in child <CRMCompanyList>
        // Get Order_List of selected Company
    };

    const handleOrderSelect = (orderId) => {
        setSelectedOrder(orderId); // Changes state of orderClicked in child <CRMOrderList>
        // Get crm_order_details of selected Order
    };

    return (
        <div className='container'>
            {/* <h1>CRM Dashboard</h1> */}
            <div className="crm-main">
                <div className="crm-companies">
                    <div className="crm-company-list">
                        <CRMCompanyList props_companies={companies} props_companySelect={handleCompanySelect} />
                    </div>
                    {selectedCompany && (
                        <div className="crm-company-details">
                            <CRMCompanyDetail props_companyId={selectedCompany}/>
                        </div>
                    )}
                </div>
                <div className="crm-orders">
                    {selectedCompany && (
                        <div className="crm-order-list">
                            <CRMOrderList props_companyId={selectedCompany} prop_OrderSelect={handleOrderSelect} />
                        </div>
                    )}
                    {selectedOrder && (
                        <div className="crm-order-detail">
                            <CRMOrderDetail props_orderId={selectedOrder} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CRM;
