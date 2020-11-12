import React, { useState } from "react";
import InfoPopupNav from "./InfoPopupNav";

export default function InfoPopup({ info }) {
  console.log("hits");
  const [show, setShow] = useState("popup-info");
	console.log(info);

	// const handleCoordClick = (e)=>{
	// 	console.log(e)
	// 	document.execCommand('copy')
	// }


	const handleCoordClick = (e) => {
		console.log(e)
		const el = document.createElement('textarea');
		el.value = `${info.latitude} ${info.longitude}`;
		console.log(info.latitude, info.longitude)
		el.setAttribute('readonly', '');
		// el.style.position = 'absolute';
		// el.style.left = '-9999px';
		el.style.display = 'none'
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
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
            <div onClick={handleCoordClick} className="popup__info-item">
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
