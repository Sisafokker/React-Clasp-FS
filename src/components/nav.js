// Nav.js
import React from "react";
import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <div className="nav-wrapper">
      <NavLink to="/crm" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>CRM</NavLink>
      <NavLink to="/customers" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Customers</NavLink>
      <NavLink to="/download" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Download</NavLink>
      <NavLink to="/appusers" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>AppUsers</NavLink>
      <NavLink to="/inventory" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Inventory</NavLink>
      <NavLink to="/tutorials" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Tutorials</NavLink>
    </div>
  );
}

export default Nav;
