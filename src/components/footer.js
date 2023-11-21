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
          © { new Date().getFullYear() } - Hoakeen - Full Stack Project
        </div>
      </div>
    </div>
  );
};

export default Footer;


