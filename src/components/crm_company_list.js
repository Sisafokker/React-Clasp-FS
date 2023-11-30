// crm_company_list.js child-component
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

// styles
import "../styles/crm_company_list.scss";

// The child does NOT manage state, it just informs the parent about user interactions
// The parent then manages the state as needed.
const CRMCompanyList = ({ props_companies, props_companySelect, props_resetCompanyList  }) => {
    // For Filters
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedIndustry, setSelectedIndustry] = useState('All');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [industries, setIndustries] = useState([]);
    const [disableFilters, setDisableFilters] = useState(null);

    useEffect(() => {
        // Unique Comp.Industry for Dropdown options
        uniqueIndustry()
    }, [props_companies, props_companySelect]);

    function uniqueIndustry() {
        const uniqueIndustries = ['All', ...new Set(filteredCompanies.map(company => company.industry))];
        console.log("🔵 uniqueIndustries: ", uniqueIndustries)
        setIndustries(uniqueIndustries);
    }

    // Filter by multiple conditions
    const filteredCompanies = props_companies.filter(company => {
        let statusMatch = selectedStatus === 'All' || company.status === selectedStatus;
        let industryMatch = selectedIndustry === 'All' || company.industry === selectedIndustry;
        return statusMatch && industryMatch;
    });


    useEffect(() => { 
        if (!selectedCompany) {
            resetFilters()
            setDisableFilters(false)
        } else {
            setDisableFilters(true)
        }
     }, [selectedCompany]);

    const resetFilters = () => {
        setSelectedStatus('All');
        setSelectedIndustry('All');
    };

    const handleCompanyClick = (companyId) => {
        console.log("🔵 CRM_company_list - Clicked in companyId: ", companyId)
        props_companySelect(companyId); // Invokes handleCompanySelect() in crm.js & passing companyId as argument.
        setSelectedCompany(true)

        // Add 'selected-company' class to clicked company!
        const selectedElement = document.querySelector(`.company-item[data-company-id="${companyId}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected-company');
        }

    };

    return (
        <div className="crm-company-list">
            <div className='section-title'>Customers</div>
            <div className='company-filter'>
                <div className='filter'>
                    <label><FontAwesomeIcon icon={faFilter}/> Status </label>
                    <select value={selectedStatus} disabled={disableFilters} 
                        onChange={(e) => { setSelectedStatus(e.target.value) , props_resetCompanyList()}}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="All">All</option>
                    </select>
                </div>
                <div className='filter'>
                    <label><FontAwesomeIcon icon={faFilter}/>Industry</label>
                    <select value={selectedIndustry} disabled={disableFilters} 
                        onChange={(e) => {setSelectedIndustry(e.target.value), props_resetCompanyList()}}>
                        {industries.map(industry => <option key={industry} value={industry}>{industry}</option>)}
                    </select>
                </div>
            </div>
            <div className='section-btns'>
                    <button className='btn' title="Reset all filters"
                        onClick={resetFilters} disabled={(selectedStatus === "All" && selectedIndustry === "All") || selectedCompany}>
                        <FontAwesomeIcon icon={faFilter}/> Reset Filters 
                        </button>
                    <button className='btn' title="Expand Customer's list" disabled={ !selectedCompany }
                        onClick={() => { props_resetCompanyList(); setSelectedCompany(null); }} >
                        All Customers
                    </button>
            </div>
            <div className='filtered-companies'>
                {filteredCompanies.map((company) => (
                    <div key={company.companyId}
                        data-company-id={company.companyId}
                        className="company-item" 
                        onClick={() => handleCompanyClick(company.companyId)} >
                        <p>{`${company.companyName} | ${company.industry} [${company.status}]`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CRMCompanyList;