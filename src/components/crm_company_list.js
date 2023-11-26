// crm_company_list.js child-component
import React, { useState, useEffect } from 'react';

// styles
import "../styles/crm_company_list.scss";


// The child does NOT manage state, it just informs the parent about user interactions
// The parent then manages the state as needed.
const CRMCompanyList = ({ props_companies, props_companySelect }) => {
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedIndustry, setSelectedIndustry] = useState('All');
    const [industries, setIndustries] = useState([]);

    useEffect(() => {
        // Unique Comp.Industry for Dropdown options
        const uniqueIndustries = ['All', ...new Set(props_companies.map(company => company.industry))];
        console.log("uniqueIndustries: ", uniqueIndustries)
        setIndustries(uniqueIndustries);
    }, [props_companies, props_companySelect]);

    // Filter by multiple conditions
    const filteredCompanies = props_companies.filter(company => {
        let statusMatch = selectedStatus === 'All' || company.status === selectedStatus;
        let industryMatch = selectedIndustry === 'All' || company.industry === selectedIndustry;
        return statusMatch && industryMatch;
    });

    const resetFilters = () => {
        setSelectedStatus('All');
        setSelectedIndustry('All');
    };

    const handleCompanyClick = (companyId) => {
        props_companySelect(companyId); // Invokes handleCompanySelect() in crm.js & passing companyId as argument.
    };

    return (
        <div className="crm-company-list">
            <div className='section-title'>Customers</div>
            <div className='company-filter'>
                <div className='filter'>
                    <label>Status filter</label>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="All">All</option>
                    </select>
                </div>
                <div className='filter'>
                    <label>Industry filter</label>
                    <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)}>
                        {industries.map(industry => <option key={industry} value={industry}>{industry}</option>)}
                    </select>
                </div>
            </div>
            <div className='section-btns'>
                <div>
                    <button className='btn' onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>
            <div className='filtered-companies'>
                {filteredCompanies.map((company) => (
                    <div key={company.companyId} className="company-item" onClick={() => handleCompanyClick(company.companyId)} >
                        <p>{`${company.companyName} | ${company.industry} [${company.status}]`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CRMCompanyList;