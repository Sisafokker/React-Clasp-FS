import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../Context"; 

function Nav() {
  const { user } = useContext(Context);

  if (!user || user.status !== "active") {
    return null;
  }

  return (
    <div className="nav-wrapper">
      
      {user && user.type === "admin" && user.status === "active" && (
        <>
          <NavLink to="/crm" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>CRM</NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Customers</NavLink>
          <NavLink to="/appusers" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>App Users</NavLink>
        </>
      )}

      {user && user.type === "usuario" && user.status === "active" && (
        <>
         <NavLink to="/crm" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>CRM</NavLink>
        </>
      )}

    </div>
  );
}

export default Nav;
