import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="nav-wrapper">
      <Link to="/customers" className="nav-link">Customers</Link>
      <Link to="/pos" className="nav-link">POs</Link>
      <Link to="/appusers" className="nav-link">AppUsers</Link>
      <Link to="/inventory" className="nav-link">Inventory</Link>
      <Link to="/tutorials" className="nav-link">Tutorials</Link>
    </div>
  );
}

export default Nav;
