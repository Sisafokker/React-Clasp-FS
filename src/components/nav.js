import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../Context"; 

function Nav() {
  const { user } = useContext(Context);

  return (
    <div className="nav-wrapper">
      <NavLink to="/crm" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>CRM</NavLink>

      {user && user.type === "admin" && user.status === "active" && (
        <>
          <NavLink to="/customers" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Customers</NavLink>
          <NavLink to="/appusers" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>AppUsers</NavLink>
        </>
      )}

      {user && user.type === "usuario" && user.status === "active" && (
        <>
          <NavLink to="/tutorials" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Tutorials</NavLink>
        </>
      )}

    </div>
  );
}

export default Nav;
