import React, { useState, useEffect } from "react";
import AddLocationForm2 from "./AddLocationForm2";

export default function AddLocationForm({
  handleFormSubmitClick,
	searchLatLon,
	show
}) {


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
    visited: false,
    "date-visited": null,
    "fruiting-status": 0,
    quality: 0,
    yield: 0,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    setFormData({ ...formData, lat: searchLatLon[0], lng: searchLatLon[1] });
  }, [searchLatLon]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataCopy = { ...formData };
    console.log(e);
    let validated = true;
    // validations:
    // must have type_ids
    if (formData.type_ids === "") {
      validated = false;
      console.log("type error");

      // add error
    }
    // must have lat/lng OR an address, which we need to convert to a lat/lng before sending to db.
    if (
      formData.lat === "" ||
      formData.lat === undefined ||
      formData.lng === "" ||
      formData.lng === undefined
    ) {
      validated = false;
      console.log("lat/lng error");
      // add error
      // add something to convert address input to lat/lng
    }

    // VALIDATE DESCRIPTION
    if (formData.description === "") {
      // add an error to the form and prevent submit
      validated = false;
      console.log("description error");
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

      // send form to db:

      // hide form
      // setShowForm(false);
      handleFormSubmitClick();
      //clear form - I might not need to do this.
      // I have it right now so that the form is always loaded, but it's only shown if they click the button. My intent was to save form values.
      // If I want form values to stay I'd have to save them elsewhere - when the prop to AddLocationForm changes (the showForm affecting display) the component is rerendered with empty form. I could set them in a parent component but that's a lot of work for a mostly useless feature.
      setFormData(emptyForm);
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
    } else if (id === "no_season" || id === "visited") {
      value = e.target.checked;
    }

    setFormData({ ...formData, [id]: value });
    console.log(formData);
  };

	// we don't save address - we save coords
  // const [address, setAddress] = useState("");
  // const handleAddress = (e) => {
  //   const input = e.target.value;
  // };

  return (
    <div className={`add-loc__cont fade-in ${show ? 'show' : ''}`}>
      {/* <form onSubmit={handleSubmit}> */}
      <div className="add-loc__el add-loc__el-col">
        <label className="add-loc__label" htmlFor="type">
          Type
        </label>
        <div className="add-loc__sub-label">
          Choose from the dropdown list, submitting new types only if
          appropriate choices do not already exist. SIKE, you can't add types.
        </div>
        <select
          defaultValue=""
          name="type"
          id="type_ids"
          onChange={handleChange}
        >
          <option className="invalid" value="" disabled hidden>
            Select a type
          </option>
          {types.map(([typeId, typeName], idx) => (
            <option key={idx} value={typeId}>
              {typeName}
            </option>
          ))}
        </select>
      </div>
      <div className="add-loc__el add-loc__el-col">
        <label className="add-loc__label" htmlFor="position">
          Position
        </label>
        <div className="add-loc__sub-label">
          Click on the map for a moveable pin to get coordinates, or search for
          a location's address in the upper right-hand corner.
        </div>
        <div className="add-loc__el-row">
          <input
            className="add-loc__pos"
            name="position"
            id="lat"
            type="number"
            onChange={handleChange}
            placeholder="Latitude"
            value={formData.lat}
          />
          <div className="add-loc__pos-spacer" />
          <input
            className="add-loc__pos"
            name="position"
            id="lng"
            type="number"
            onChange={handleChange}
            placeholder="Longitude"
            value={formData.lng}
          />
        </div>
      </div>
      {/* <div className="add-loc__el add-loc__el-col">
          <label className="add-loc__label" htmlFor="address">
            Address
          </label>
          <textarea name="address" id="address" onChange={handleAddress} />
        </div> */}
      <div className="add-loc__el add-loc__el-col">
        <label className="add-loc__label" htmlFor="description">
          Description
        </label>
        <div className="add-loc__sub-label">
          Location details, access issues, plant health, your mother's maiden
          name...
        </div>
        <textarea name="description" id="description" onChange={handleChange} />
      </div>
      <div className="add-loc__el add-loc__el-col">
        <div className="add-loc__el-row">
          <label className="add-loc__label" htmlFor="season">
            Season
          </label>

          <div>
            <input
              type="checkbox"
              name="no-season"
              id="no_season"
              onChange={handleChange}
            />
            <label className="add-loc__label" htmlFor="no-season">
              No Season
            </label>
          </div>
        </div>
        <div className="add-loc__sub-label">
          When can the source be harvested? Leave blank if you don't know.
        </div>
        <div className="add-loc__el-row">
          <select
            defaultValue=""
            className="add-loc__pos"
            name="season"
            id="season_start"
            onChange={handleChange}
            disabled={formData.no_season}
          >
            <option className="invalid" value="" disabled hidden>
              Start
            </option>

            {months.map(([monthId, monthName], idx) => (
              <option key={idx} value={monthId}>
                {monthName}
              </option>
            ))}
          </select>
          <div className="add-loc__pos-spacer" />
          <select
            defaultValue=""
            className="add-loc__pos"
            name="season"
            id="season_end"
            onChange={handleChange}
            disabled={formData.no_season}
          >
            <option className="invalid" value="" disabled hidden>
              End
            </option>

            {months.map(([monthId, monthName], idx) => (
              <option key={idx} value={monthId}>
                {monthName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="add-loc__el add-loc__el-col">
        <label className="add-loc__label" htmlFor="access">
          Access
        </label>
        <div className="add-loc__sub-label">
          Access status of the source. Leave blank if you don't know.
        </div>
        <select
          defaultValue=""
          required
          name="access"
          id="access"
          onChange={handleChange}
        >
          <option className="invalid" value="" disabled hidden>
            Access status of source
          </option>

          {accesses.map(([accessId, accessName], idx) => (
            <option key={idx} value={accessId}>
              {accessName}
            </option>
          ))}
        </select>
      </div>
      <div className="add-loc__el-col">
        <div className="add-loc__el">
          <div className="add-loc__label">
            <input
              type="checkbox"
              id="unverified"
              name="unverified"
              onChange={handleChange}
            />
            <label htmlFor="unverified">Verified?</label>
          </div>
          <div className="add-loc__sub-label">
            If you doubt the existence, location, or identity of this source.
          </div>
        </div>
      </div>

      <div className="add-loc__el">
        <div className="add-loc__label">
          <input
            type="checkbox"
            id="visited"
            name="visited"
            onChange={handleChange}
          />
          <label htmlFor="visited">Have you visted this location?</label>
        </div>
        <div className="add-loc__sub-label">Go on.....</div>
      </div>
      {formData.visited === true ? (
        <AddLocationForm2
          handleChange={handleChange}
          formData={formData}
          setFormData={setFormData}
        />
      ) : null}
      <div className="add-loc__btn-cont">
        <button
          type="submit"
          onSubmit={handleSubmit}
          className="btn add-loc__btn"
        >
          Add Location
        </button>
      </div>
      {/* </form> */}
    </div>
  );
}
