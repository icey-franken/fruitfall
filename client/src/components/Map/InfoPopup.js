import React from "react";

export default function PopupInfo({ info }) {
	console.log("hits");

  return (
		<form>
      <h1>{info.id}</h1>
			{Object.entries(info).map(([key, value], idx)=>
				<div key={idx} >{key}: {value}</div>
			)}
		</form>
  );
}
