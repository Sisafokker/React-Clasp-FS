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
    const { isMenuOpen } = useContext(Context);
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
          //  console.log("CRM👍get_companies: ",response)
            let filteredCompanies;
            if (user && user.type === 'admin') {
                filteredCompanies = response.data;
              //  console.log("Admin 👍 props_Companies: ", filteredCompanies);
            } else {
                const intCompanyUserResponse = await axios.get(`${url}/api/intCompanyUser`); // Fetch the intCompanyUser data
                if (intCompanyUserResponse.status === 200) {
                    const userCompanies = intCompanyUserResponse.data
                        .filter(icu => icu.userId === user.id)
                        .map(icu => icu.companyId);
                    
                    filteredCompanies = response.data.filter(company => userCompanies.includes(company.companyId));
                  //  console.log("Non-Admin 👍 props_Companies: ", filteredCompanies);
                }
            }
                setCompanies(filteredCompanies);
                
        } catch (error) {
            console.error('Error fetching companies:', error);
            setCompanies(null);
        }
    };

    const handleCompanySelect = async (companyId) => {
       // console.log("CRM - Clicked in companyId:", companyId);
        
        setSelectedCompany(companyId);
        setSelectedOrder(null); // Reset the selected order
        const selected = companies.find(company => company.companyId === companyId);
        if (selected) {
            setCompanies([selected]);
        } else{
            console.error("❌crm.js selected is BLANK")
        }
    };

    function removeClassSelected(){   // Remove 'selected-company' class from all
        const previouslySelectedElement = document.querySelector('.company-item.selected-company');
        if (previouslySelectedElement) { previouslySelectedElement.classList.remove('selected-company'); }
   }

    const handleOrderSelect = (orderId) => {
        setSelectedOrder(orderId);
      //  console.log("crm.js 🚩selectedOrder🚩: ", orderId);
    };

    const resetCompanyList = async () => {
        removeClassSelected();
        await fetchCompanies();     // Get companylist
        setSelectedCompany(null);   // Clear the selected company
        setSelectedCompanyDetails(null); // Clear companydetails
        setSelectedOrder(null);     // Clear the selected order
    };

    return (
        <div className="container" style={{ paddingTop: isMenuOpen ? '140px' : '5px' }}>
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
                    <div className="crm-order-list">
                            <CRMOrderList props_companyId={selectedCompany} props_companyDetails={selectedCompanyDetails} props_OrderSelect={handleOrderSelect} />
                        </div>
                    
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
