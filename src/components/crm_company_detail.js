// crm_company_detail.js
import React from 'react';

// styles
import "../styles/crm_company_detail.scss";

const CRMCompanyDetail = ({ props_companyDetails }) => {
    if (!props_companyDetails) {
        return <div>Select a company to see details</div>;
    }

    // Convert props_companyDetails in array of [key, value] pairs
    const detailsArray = Object.entries(props_companyDetails);
    // console.log("🔴 crm_company_details CompanySelected: ", props_companyDetails.companyName)
    // console.log("🔴 crm_company_details CompanyDetails", detailsArray)

    function properName(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const tableClass = props_companyDetails.status === 'active' 
                       ? 'vertical-table' 
                       : 'vertical-table inactive-company';

    return (
        <div className="crm-company-details">
            {/* <div className='section-title sub'></div> */}
            <table className= {tableClass} >
                <tbody>
                    {detailsArray.map(([key, value]) => {
                        let displayKey = key; // New var for display purposes

                        if (key === "createdAt" || key === "updatedAt") {
                            const date = new Date(value);
                            value = date.toLocaleDateString();
                            if (key === "createdAt") {
                                displayKey = "Customer since";
                            } else {
                                displayKey = "Last Edited";
                            }
                        } else if (key === "companyId") {
                            displayKey = "Customer #";
                        } else if (key === "companyName") {
                            displayKey = "Customer Name";
                        } else if (key === "companyAddress") {
                            displayKey = "Main Address";
                        } else if (key === "createdBy") {
                            displayKey = "Created by";
                        } else if (key === "updatedBy") {
                            displayKey = "Updated By";
                        } else if (key === "createdAt") {
                            displayKey = "Last Edited";
                        } else {
                            displayKey = properName(key);
                        }

                        return (
                            <tr key={key}>
                                <td>{displayKey}</td>
                                <td>{value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default CRMCompanyDetail;