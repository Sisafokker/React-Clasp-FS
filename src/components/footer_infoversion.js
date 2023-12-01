// src/components/InfoVersion.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import FooterInfo from './footer_info';
import PopupFooter from './popupFooter';

const InfoVersion = () => {
  const [showPopupFooter, setShowPopupFooter] = useState(false);
  const latestNote = FooterInfo.getLatestNote();

  return (
    <div className="info-version">
      <div>
        <span>v. {FooterInfo.getVersion()} | Dev's Notes: </span>
        <FontAwesomeIcon icon={faCircleInfo} onClick={() => setShowPopupFooter(true)} />
      </div>

      <PopupFooter 
        props_isOpen={showPopupFooter} 
        props_closePopup={() => setShowPopupFooter(false)} 
        props_title={`${latestNote.version} - ${latestNote.title}`}
      >
        <ul>
          {latestNote.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </PopupFooter>
    </div>
  );
};

export default InfoVersion;
