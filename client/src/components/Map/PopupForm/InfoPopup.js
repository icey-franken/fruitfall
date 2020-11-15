import React, { useState } from "react";
import InfoPopupNav from "./InfoPopupNav";

export default function InfoPopup({ info }) {
  const [show, setShow] = useState("popup-info");

  const handleCoordClick = () => {
		const tempInput = document.createElement('input')
		tempInput.value = `${info.latitude}, ${info.longitude}`;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand('copy')
		document.body.removeChild(tempInput)
  };

  return (
    <>
      <InfoPopupNav setShow={setShow} />
      {/* have a few components here conditionally rendered based on show value */}
      <div className="popup__info-cont">
        {show === "popup-info" ? (
          <>
            <div className="popup__info-item popup__type">
              <a
                href={`${info.type_url}`}
                target="_blank"
                // added rel here because... React told me to
                rel="noopener noreferrer"
                title={`Open Wikipedia page for ${info.type_name} in new tab`}
              >
                {info.type_name}
              </a>
            </div>
            <div className="popup__info-item popup__descrip">
              {info.description === null || info.description === ""
                ? "No description provided"
                : info.description}
            </div>
          </>
        ) : show === "popup-access" ? (
          <>
            <div className="popup__info-item">
              {info.access === "Unknown"
                ? "No access specifics provided"
                : info.access}
            </div>
            <div
              title="Click to copy coordinates"
              onClick={handleCoordClick}
              className="popup__info-item popup__info-item--coords"
            >
              Coordinates: {info.latitude} {info.longitude}
            </div>
          </>
        ) : (
          <div className="popup__info-item">other</div>
        )}
      </div>
    </>
  );
}
