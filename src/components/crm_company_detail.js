// crm_company_detail.js
import React from 'react';

// styles
import "../styles/crm_company_detail.scss";

const CRMCompanyDetail = ({ props_companyDetails }) => {
    console.log("crm_company_details.js props_companyDetails", props_companyDetails )
    if (!props_companyDetails) {
        return <div>Select a company to see details</div>;
    }

    // Convert props_companyDetails in array of [key, value] pairs
    const detailsArray = Object.entries(props_companyDetails);

    return (
        <div className="crm-company-details">
            <div className='section-title'>Customer Details</div>
                <table className='vertical-table'>
                    <tbody>
                        {detailsArray.map(([key, value]) => (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};

export default CRMCompanyDetail;