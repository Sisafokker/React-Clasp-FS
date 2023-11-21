import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import FooterInfo from './footer_info';

const InfoVersion = () => {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="info-version">
      <div>
          <span>Developer's notes: </span>
          <FontAwesomeIcon icon={faCircleInfo} onClick={() => setShowNotes(!showNotes)} />
        </div>
        <div>
          <span> v. {FooterInfo.getVersion()}</span>
          {showNotes && <div className="notes-popup">{FooterInfo.getLatestNote()}</div>}
        </div>
        
    </div>
  );
};

export default InfoVersion;
