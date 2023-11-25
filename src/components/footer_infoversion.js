// InfoVersion.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import FooterInfo from './footer_info';
import Popup from './popup';

const InfoVersion = () => {
  const [showPopup, setShowPopup] = useState(false);
  const latestNote = FooterInfo.getLatestNote();

  return (
    <div className="info-version">
      <div>
        <span>v. {FooterInfo.getVersion()} | Dev's Notes: </span>
        <FontAwesomeIcon icon={faCircleInfo} onClick={() => setShowPopup(true)} />
      </div>

      <Popup 
        isOpen={showPopup} 
        closePopup={() => setShowPopup(false)} 
        title={`${latestNote.version} - ${latestNote.title}`}
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
