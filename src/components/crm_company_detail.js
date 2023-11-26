// crm_company_detail.js
import React from 'react';

const CRMCompanyDetail = ({ props_selectedCompany }) => {
    if (!props_selectedCompany) return <div>Select a company to see details</div>;

    return (
        <div>
            <h3>Company Details</h3>
            {/* Display details of the selected company */}
            {/* ... */}
        </div>
    );
};

export default CRMCompanyDetail;
