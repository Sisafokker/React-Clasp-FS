// src/components/home_unverfied.js
import React, { useContext } from "react";
import { Context } from "../Context"; 

// Styles
import "../styles/home.scss";

// Compiled CSS Styles files
//import "../../apps-script/styles_compiled/home.css" 

function Home_unverified() {
    const { user } = useContext(Context);

  return (
    <div className="home-wrapper unverified"> 
        { (user && user.status == null) ? (
            <>
            <h1>🚩 Access Pending 🚩</h1>
            <p><b>{user.email} is currently awaiting verification by admin</b></p>
            <p><u>Note to Admin</u>: Please add <b>{user.email}</b> in AppUsers</p>
            </>
        ) : (
            <>
            <h1>⛔ User Inactive ⛔</h1>
            <p>Your account <b>{user.email}</b> has been deactivated by an admin</p>
            </>
        )}
    
        <img className="custom-image"
        src="https://lh3.googleusercontent.com/17JVDv4jno5isn9OoNozJ-ghj_46GKB3mrcu7cHY9EVIG-gI3EYwUyL0BiFOv1cbEzNWTbmr2GfEcgT14Vk3EXhaKmp9rk1l2AGeaOgSLBoQy5NiUHj_xs3BKmpMLOkpD7lK6UoExw=w2400"
        alt="Hoakeen"
      />
    </div>
  );
}

export default Home_unverified;
