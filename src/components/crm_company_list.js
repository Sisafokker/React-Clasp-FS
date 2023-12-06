// crm_company_list.js child-component
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

// styles
import "../styles/crm_company_list.scss";

// The child does NOT manage state, it just informs the parent about user interactions
// The parent then manages the state as needed.
const CRMCompanyList = ({ props_companies, props_companySelect, props_resetCompanyList  }) => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    
    // For Filters
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedIndustry, setSelectedIndustry] = useState('All');
    const [allIndustries, setAllIndustries] = useState([]);
    const [industriesFiltered, setIndustriesFiltered] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [disableFilters, setDisableFilters] = useState(null);

    useEffect(() => {
        const newFilteredCompanies = props_companies.filter(company => {
            let statusMatch = selectedStatus === 'All' || company.status === selectedStatus;
            let industryMatch = selectedIndustry === 'All' || company.industry === selectedIndustry;
            return statusMatch && industryMatch;
        });
        setFilteredCompanies(newFilteredCompanies);
    }, [props_companies, props_companySelect, selectedIndustry]);

    useEffect(() => {
        const uniqueAllIndustries = ['All', ...new Set(props_companies.map(company => company.industry))];
        setAllIndustries(uniqueAllIndustries);
        uniqueIndustry();
    }, [filteredCompanies]);

    function uniqueIndustry() {
        const uniqueIndustries = ['All', ...new Set(filteredCompanies.map(company => company.industry))];
        setIndustriesFiltered(uniqueIndustries);
    }

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
        setFilteredCompanies(props_companies);
    };

    const handleCompanyClick = (companyId) => {
        //console.log("🔵 CRM_company_list - Clicked in companyId: ", companyId)
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
            <div className='section-title'>Customer</div>
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
                    <label><FontAwesomeIcon icon={faFilter}/>Indus.</label>
                    <select value={selectedIndustry} disabled={disableFilters} 
                        onChange={(e) => { setSelectedIndustry(e.target.value), props_resetCompanyList() }}>
                        {selectedStatus === 'All'
                            ?  allIndustries.map(industry => <option key={industry} value={industry}>{industry}</option>) 
                            : industriesFiltered.map(industry => <option key={industry} value={industry}>{industry}</option>)}
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
                {filteredCompanies && filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => {
                        const inactiveClass = company.status === 'inactive' ? 'inactive-company' : '';

                        return (
                            <div key={company.companyId}
                                data-company-id={company.companyId}
                                className={`company-item ${inactiveClass}`}
                                onClick={() => handleCompanyClick(company.companyId)} >
                                <p>{`${company.companyName} | ${company.industry} [${company.status}]`}</p>
                            </div>
                        );
                    })
                ) : ( 
                    <div className='not-found companies'>                  
                        <div><FontAwesomeIcon icon={faTriangleExclamation}/> No Customers asigned to your user. <FontAwesomeIcon icon={faTriangleExclamation}/></div> 
                        <div>Please talk to your Admin.</div> 
                    </div>
                    )}
            </div>
        </div>
    );
};

export default CRMCompanyList;