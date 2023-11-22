import React from "react";
import { Link } from "react-router-dom";

import FooterInfoVersion from "./footer_infoversion";

// Styles
import "../styles/footer.scss";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-wrapper">
        <div className="footer-Col">
          {/* <h4>First Column</h4> */}
          <FooterInfoVersion />
        </div>
        <div className="footer-Col">
          {/* <h4>Second Column</h4> */}
          <img className="custom-image"
            src="https://lh3.googleusercontent.com/17JVDv4jno5isn9OoNozJ-ghj_46GKB3mrcu7cHY9EVIG-gI3EYwUyL0BiFOv1cbEzNWTbmr2GfEcgT14Vk3EXhaKmp9rk1l2AGeaOgSLBoQy5NiUHj_xs3BKmpMLOkpD7lK6UoExw=w70"
            alt="Hoakeen"
          />
        </div>
        <div className="footer-Col">
          {/* <h4>Third Column</h4> */}
          © { new Date().getFullYear() } - <a href="http://www.hoakeen.com" target="_blank">Hoakeen</a> - FS Project
        </div>
      </div>
    </div>
  );
};

export default Footer;


