import React, { useContext } from "react";
import { Context } from "../Context";
//import React from "react";
import "../styles/home.scss";

function Home() {
  const {user, setUser} = useContext(Context);

  return (
    <div className="home-wrapper"> {/* Add className for styling */}
      {user && <h1>{user.name}</h1>}
      <h1>Welcome to React_Clasp</h1>
      <h3>Please Sign In to continue</h3>
      <img className="custom-image"
        src="https://lh3.googleusercontent.com/17JVDv4jno5isn9OoNozJ-ghj_46GKB3mrcu7cHY9EVIG-gI3EYwUyL0BiFOv1cbEzNWTbmr2GfEcgT14Vk3EXhaKmp9rk1l2AGeaOgSLBoQy5NiUHj_xs3BKmpMLOkpD7lK6UoExw=w2400"
        alt="Hoakeen"
      />
    </div>
  );
}

export default Home;
