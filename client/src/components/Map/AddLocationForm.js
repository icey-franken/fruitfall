import React, { useState } from "react";

export default function AddLocationForm() {
  const types = [
    [1, "apple"],
    [2, "orange"],
    [3, "strawberry"],
  ]; //grab from db in future
  const months = [
    [0, "January"],
    [1, "February"],
    [2, "March"],
    [3, "April"],
    [4, "May"],
    [5, "June"],
    [6, "July"],
    [7, "August"],
    [8, "September"],
    [9, "October"],
    [10, "November"],
    [11, "December"],
  ];

  const accesses = [
    [0, "Source is on my property"],
    [1, "I have permission from the owner to add the source"],
    [2, "Source is on public land"],
    [3, "Source is on private property bu overhangs public land"],
    [4, "Source is on private property (ask before you pick)"],
    [5, "I don't know"],
  ];
  const emptyForm = {
    type_ids: "",
    lat: "",
    lng: "",
    address: "",
    description: "",
    season_start: "",
    season_end: "",
    no_season: false,
    author: "",
    access: "",
    unverified: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  const [another, setAnother] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataCopy = { ...formData };
    console.log(e);
    let validated = true;
    // validations:
    // must have type_ids
    if (formData.type_ids === "") {
      validated = false;
      // add error
    }
    // must have lat/lng OR an address, which we need to convert to a lat/lng before sending to db.
    if (formData.lat === "" || formData.lng === "") {
      validated = false;
      // add error
      // add something to convert address input to lat/lng
    }

    // VALIDATE DESCRIPTION
    if (formData.description === "") {
      // add an error to the form and prevent submit
      validated = false;
    }

    //VALIDATE SEASON
    if (formData.no_season === false) {
      if (formData.season_start === "" || formData.season_end === "") {
        // add an error to the form and prevent submit
        validated = false;
      }
    } else {
      delete formDataCopy.season_start;
      delete formDataCopy.season_;
    }

    // VALIDATE ACCESS
    if (formData.access === "") {
      // add an error to the form and prevent submit
      validated = false;
    }

    if (validated) {
      // make post to back end with formDataCopy
      console.log("validated?:", validated);

      if (another === true) {
        console.log("another true");
        // redirect to an empty form after sending to db
        setFormData(emptyForm);
      }
    } else {
      console.log("not validated - show errors");
    }
  };

  const handleChange = (e) => {
    const id = e.target.id;
    let value = e.target.value;
    console.log(typeof value);
    if (id === "unverified") {
      value = !e.target.checked;
    } else if (id === "no_season") {
      value = e.target.checked;
    }

    if (id !== "another") {
      setFormData({ ...formData, [id]: value });
      console.log(formData);
    } else {
      setAnother(true);
    }
  };

  return (
    <div className="add-location__form-cont">
      <form onSubmit={handleSubmit}>
        <div className="add-location__form-box">
          <label htmlFor="type">
            Types (include other text here about custom types)
          </label>
          <select name="type" id="type_ids" onChange={handleChange}>
            {types.map(([typeId, typeName], idx) => (
              <option key={idx} value={typeId}>
                {typeName}
              </option>
            ))}
          </select>
        </div>
        <div className="add-location__form-box">
          <label htmlFor="position">Position (lat lng)</label>
          <input
            name="position"
            id="lat"
            type="number"
            onChange={handleChange}
          />
          <input
            name="position"
            id="lng"
            type="number"
            onChange={handleChange}
          />
        </div>
        <div className="add-location__form-box">
          <label htmlFor="address">Address</label>
          <textarea name="address" id="address" onChange={handleChange} />
        </div>
        <div className="add-location__form-box">
          <label htmlFor="season">Season</label>
          <div className="add-location__form-box">
            <select
              name="season"
              id="season_start"
              onChange={handleChange}
              disabled={formData.no_season}
            >
              {months.map(([monthId, monthName], idx) => (
                <option key={idx} value={monthId}>
                  {monthName}
                </option>
              ))}
            </select>
            <select
              name="season"
              id="season_end"
              onChange={handleChange}
              disabled={formData.no_season}
            >
              {months.map(([monthId, monthName], idx) => (
                <option key={idx} value={monthId}>
                  {monthName}
                </option>
              ))}
            </select>

            <label htmlFor="no-season">No Season</label>
            <input
              type="checkbox"
              name="no-season"
              id="no_season"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="add-location__form-box ">
          <label htmlFor="access">Access</label>
          <select name="access" id="access" onChange={handleChange}>
            {accesses.map(([accessId, accessName], idx) => (
              <option key={idx} value={accessId}>
                {accessName}
              </option>
            ))}
          </select>
        </div>
        <div className="add-location__form-box ">
          <label htmlFor="unverified">Verified?</label>
          <input
            type="checkbox"
            id="unverified"
            name="unverified"
            onChange={handleChange}
          />
        </div>
        <div className="add-location__form-box">
          <label htmlFor="another">Add Another Location</label>
          <input
            type="checkbox"
            name="another"
            id="another"
            onChange={handleChange}
          />

          <button>Add Location</button>
        </div>
      </form>
    </div>
  );
}
