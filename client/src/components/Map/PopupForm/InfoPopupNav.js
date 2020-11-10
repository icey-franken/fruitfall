import React, { useState, useEffect } from "react";

export default function InfoPopupNav({setShow}) {
	const [selected, setSelected] = useState();

	useEffect(()=>{
		setSelected(document.getElementById('popup-info'))
	}, [])

  const handleClick = (e) => {
    selected.classList.remove("active");
		e.target.classList.add('active')
		setSelected(e.target);
		setShow(e.target.id);
  };

  return (
    <div className="popup__nav-cont">
      <div onClick={handleClick} className="popup__nav-item active" id='popup-info'>
        Info
      </div>
      <div onClick={handleClick} className="popup__nav-item"
			id='popup-access'
			>
        Access
      </div>
      <div onClick={handleClick} className="popup__nav-item"
			id='popup-street-view'>
        Street View
      </div>
    </div>
  );
}
