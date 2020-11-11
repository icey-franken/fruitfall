import React, { useState, useEffect, useRef } from "react";
import AddLocationForm2 from "./AddLocationForm2";
import {useForm} from 'react-hook-form';

export default function AddLocationFormHook({
  handleFormSubmitClick,
  searchLatLon,
  show,
  handleAddLocationClick,
}) {
	const {register, handleSubmit, errors, setValue} = useForm();

	const onSubmitHook = data =>{
		console.log(data)
	}
	// set up empty form
  const emptyForm = {
    type_ids: "",
    lat: "",
    lng: "",
    description: "",
    season_start: "",
    season_end: "",
    no_season: false,
    author: "", //don't have yet
    access: "",
    unverified: true,
    visited: false,
    "date-visited": null,//the next four come from second form
    "fruiting-status": 0,
    quality: 0,
    yield: 0,
	};
  const [formData, setFormData] = useState(emptyForm);


	// get select field values from database
	const typesRef = useRef();
	const monthsRef = useRef();
	const accessesRef = useRef();
	const [loading, setLoading] = useState(true)
	useEffect(()=>{
		async function get_form_fields(){
			const res = await fetch('/api/features/add-location-form');
			const fields = await res.json();
			typesRef.current = fields.types
			monthsRef.current = fields.months
			accessesRef.current = fields.accesses
			setLoading(false)
		}
		get_form_fields()
	},[])

	console.log('hits')
	// update
  useEffect(() => {
		// functional update removes complaint about missing form data dependency
		setValue('lng', searchLatLon[0])
		setValue('lat', searchLatLon[1])

    // setFormData((formData) => ({
    //   ...formData,
    //   lng: searchLatLon[0],
    //   lat: searchLatLon[1],
    // }));
  }, [searchLatLon]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formDataCopy = { ...formData };
  //   console.log(e);
  //   let validated = true;
  //   // validations:
  //   // must have type_ids
  //   if (formData.type_ids === "") {
  //     validated = false;
  //     console.log("type error");

  //     // add error
  //   }
  //   // must have lat/lng OR an address, which we need to convert to a lat/lng before sending to db.
  //   if (
  //     formData.lat === "" ||
  //     formData.lat === undefined ||
  //     formData.lng === "" ||
  //     formData.lng === undefined
  //   ) {
  //     validated = false;
  //     console.log("lat/lng error");
  //     // add error
  //     // add something to convert address input to lat/lng
  //   }

  //   // VALIDATE DESCRIPTION
  //   if (formData.description === "") {
  //     // add an error to the form and prevent submit
  //     validated = false;
  //     console.log("description error");
  //   }

  //   //VALIDATE SEASON
  //   if (formData.no_season === false) {
  //     if (formData.season_start === "" || formData.season_end === "") {
  //       // add an error to the form and prevent submit
  //       validated = false;
  //     }
  //   } else {
  //     delete formDataCopy.season_start;
  //     delete formDataCopy.season_stop;
  //   }

  //   // VALIDATE ACCESS
  //   if (formData.access === "") {
  //     // add an error to the form and prevent submit
  //     validated = false;
  //   }

  //   if (validated) {
  //     // make post to back end with formDataCopy
  //     console.log("validated?:", validated);

  //     // send form to db:

  //     // hide form
  //     // setShowForm(false);
  //     handleFormSubmitClick();
  //     //clear form - I might not need to do this.
  //     // I have it right now so that the form is always loaded, but it's only shown if they click the button. My intent was to save form values.
  //     // If I want form values to stay I'd have to save them elsewhere - when the prop to AddLocationForm changes (the showForm affecting display) the component is rerendered with empty form. I could set them in a parent component but that's a lot of work for a mostly useless feature.
  //     setFormData(emptyForm);
  //   } else {
  //     console.log("not validated - show errors");
  //   }
  // };

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
	if(loading) {
		return null;
	}
  return (
    <div className={`add-loc__cont fade-in ${show ? "show" : ""}`}>
      <div className="add-loc__close-cont">
        <div className="add-loc__close" onClick={handleAddLocationClick}>
          &#10006;
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmitHook)}>
      <div className="add-loc__cont-inner">
        <div className="add-loc__el add-loc__el-col">
          <label className="add-loc__label" htmlFor="type">
            Type
          </label>
          <div className="add-loc__sub-label">
            Choose from the dropdown list, submitting new types only if
            appropriate choices do not already exist. SIKE, you can't add types.
          </div>
          <select ref={register({required: true})}
            defaultValue=""
            name="type_ids"
            id="type_ids"
            // onChange={handleChange}
          >
            <option className="invalid" value="" disabled hidden>
              Select a type
            </option>
            {typesRef.current.map(([typeId, typeName], idx) => (
              <option key={idx} value={typeId}>
                {typeName}
              </option>
            ))}
          </select>
					{errors.type_ids && <div className='add-loc__err'>REQUIRED</div>}
        </div>
        <div className="add-loc__el add-loc__el-col">
          <div className="add-loc__label" htmlFor="position">
            Position
          </div>
          <div className="add-loc__sub-label">
            Click on the map for a moveable pin to get coordinates, or search
            for a location's address in the upper right-hand corner.
          </div>
          <div className="add-loc__el-row">
            <input  ref={register({required: true})}//add custom validation
              className="add-loc__pos"
              name="lat"
              id="lat"
              // type="number"
              // onChange={handleChange}
              placeholder="Latitude"
							// value={searchLatLon[1]}
            />
            <div className="add-loc__pos-spacer" />
            <input  ref={register({required: true})}
              className="add-loc__pos"
              name="lng"
              id="lng"
              // type="number"
              // onChange={handleChange}
              placeholder="Longitude"
							// value={searchLatLon[0]}
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
          <textarea  ref={register({required: true})}
            name="description"
            id="description"
            // onChange={handleChange}
          />
        </div>
        <div className="add-loc__el add-loc__el-col">
          <div className="add-loc__el-row">
            <div className="add-loc__label">
              Season
            </div>

            <div>
              <input  ref={register}
                type="checkbox"
                name="no_season"
                id="no_season"
                // onChange={handleChange}
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
            <select  ref={register}
              defaultValue=""
              className="add-loc__pos"
              name="season_start"
              id="season_start"
              // onChange={handleChange}
              disabled={formData.no_season}
            >
              <option className="invalid" value="" disabled hidden>
                Start
              </option>

              {monthsRef.current.map(([monthId, monthName], idx) => (
                <option key={idx} value={monthId}>
                  {monthName}
                </option>
              ))}
            </select>
            <div className="add-loc__pos-spacer" />
            <select  ref={register}
              defaultValue=""
              className="add-loc__pos"
              name="season_end"
              id="season_end"
              // onChange={handleChange}
              disabled={formData.no_season}
            >
              <option className="invalid" value="" disabled hidden>
                End
              </option>

              {monthsRef.current.map(([monthId, monthName], idx) => (
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
          <select  ref={register({required: true})}
            defaultValue=""
            required
            name="access"
            id="access"
            // onChange={handleChange}
          >
            <option className="invalid" value="" disabled hidden>
              Access status of source
            </option>

            {accessesRef.current.map(([accessId, accessName], idx) => (
              <option key={idx} value={accessId}>
                {accessName}
              </option>
            ))}
          </select>
        </div>
        <div className="add-loc__el-col">
          <div className="add-loc__el">
            <div className="add-loc__label">
              <input  ref={register}
                type="checkbox"
                id="unverified"
                name="unverified"
                // onChange={handleChange}
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
            <input  ref={register}
              type="checkbox"
              id="visited"
              name="visited"
              // onChange={handleChange}
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
      </div>

      </form>
    </div>
  );
}
