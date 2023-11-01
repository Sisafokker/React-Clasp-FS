import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="nav-wrapper">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/about" className="nav-link">About</Link>
      <Link to="/actions" className="nav-link">Actions</Link>
      <Link to="/tutorials" className="nav-link">Tutorials</Link>
    </div>
  );
}

export default Nav;
