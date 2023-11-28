// CRM.js parent-component
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
    // const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            const selectedDetails = companies.find(company => company.companyId === selectedCompany);
            setSelectedCompanyDetails(selectedDetails);
        } else {
            setSelectedCompanyDetails(null);
        }
    }, [selectedCompany, companies]);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`${url}/api/companies`);
            console.log("CRM👍get_companies: ",response)
            let filteredCompanies;
            if (response.status === 200) {
                if (user && user.userType === 'usuario') {
                    filteredCompanies = response.data.filter(company => company.userId === userId) 
                } else {
                    filteredCompanies = response.data;
                }  
                setCompanies(filteredCompanies);
                console.log("User👍Props_Companies: ",companies)
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
        console.log("CRM - Clicked in companyId:", companyId);
        setSelectedCompany(companyId);
        setSelectedOrder(null); // Reset the selected order
        const selected = companies.find(company => company.companyId === companyId);
        if (selected) {
            setCompanies([selected]);
        } else{
            console.error("❌crm.js selected is BLANK")
        }
    };

    const handleOrderSelect = (orderId) => {
        setSelectedOrder(orderId);
        console.log("crm.js 🚩selectedOrder🚩: ", orderId);
    };

    const resetCompanyList = async () => {
        await fetchCompanies();     // Get companylist
        setSelectedCompany(null);   // Clear the selected company
        setSelectedCompanyDetails(null); // Clear companydetails
        setSelectedOrder(null);     // Clear the selected order
    };

    return (
        <div className='container'>
            <div className="crm-main">
                <div className="crm-companies">
                    <div className="crm-company-list">
                        <CRMCompanyList props_companies={companies} props_companySelect={handleCompanySelect} props_resetCompanyList={resetCompanyList} />
                    </div>
                    {selectedCompany && (
                        <div className="crm-company-detail">
                            <CRMCompanyDetail props_companyDetails={selectedCompanyDetails} />
                        </div>
                    )}
                </div>
                <div className="crm-orders">
                    {selectedCompany && (
                        <div className="crm-order-list">
                            <CRMOrderList props_companyId={selectedCompany} props_OrderSelect={handleOrderSelect} />
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
