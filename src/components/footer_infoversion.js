// InfoVersion.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import FooterInfo from './footer_info';
import Popup from './popup';

const InfoVersion = () => {
  const [showPopup, setShowPopup] = useState(false); // Corrected state variable name
  const latestNote = FooterInfo.getLatestNote();

  return (
    <div className="info-version">
      <div>
        <span>Developer's notes: </span>
        <FontAwesomeIcon icon={faCircleInfo} onClick={() => setShowPopup(true)} />
      </div>
      <div>
        <span> v. {FooterInfo.getVersion()}</span>
      </div>

      {/* Popup for latest note */}
      <Popup 
        isOpen={showPopup} 
        closePopup={() => setShowPopup(false)} 
        title={`${latestNote.version} - ${latestNote.description}`}
      >
        <ul>
          {latestNote.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </Popup>
    </div>
  );
};

export default InfoVersion;
