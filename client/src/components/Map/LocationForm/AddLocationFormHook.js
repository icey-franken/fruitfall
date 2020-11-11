import React, { useState, useEffect, useRef } from "react";
import AddLocationForm2 from "./AddLocationFormHook2";

export default function AddLocationFormHook({
  handleFormSubmitClick,
  show,
  handleAddLocationClick,
  useFormObj,
}) {
  const { register, handleSubmit, errors, watch, getValues } = useFormObj;

  const watchNoSeason = watch("no_season");
  const watchVisited = watch("visited");
  console.log(watchNoSeason, watchVisited);
  const onSubmitHook = (data) => {
    console.log(data);
    // remember to switch unverified value before making post
  };

  // get select field values from database
  const typesRef = useRef();
  const monthsRef = useRef();
  const accessesRef = useRef();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function get_form_fields() {
      const res = await fetch("/api/features/add-location-form");
      const fields = await res.json();
      typesRef.current = fields.types;
      monthsRef.current = fields.months;
      accessesRef.current = fields.accesses;
      setLoading(false);
    }
    get_form_fields();
  }, []);

  console.log("hits");

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

  if (loading) {
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
              appropriate choices do not already exist. SIKE, you can't add
              types.
            </div>
            {errors.type_ids && (
              <div className="add-loc__err">Please select a type</div>
            )}
            <select
              ref={register({ required: true })}
              name="type_ids"
              id="type_ids"
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
          </div>
          <div className="add-loc__el add-loc__el-col">
            <div className="add-loc__label" htmlFor="position">
              Position
            </div>
            <div className="add-loc__sub-label">
              Click on the map for a moveable pin to get coordinates, or search
              for a location's address in the upper right-hand corner.
            </div>
            {errors.lat || errors.lng ? (
              <div className="add-loc__err">Please enter a position</div>
            ) : null}
            <div className="add-loc__el-row">
              <input
                ref={register({required:true})} //add custom validation
                className="add-loc__pos"
                name="lat"
                id="lat"
                placeholder="Latitude"
              />
              <div className="add-loc__pos-spacer" />
              <input
                ref={register({required:true})}
                className="add-loc__pos"
                name="lng"
                id="lng"
                placeholder="Longitude"
              />
            </div>
          </div>
          <div className="add-loc__el add-loc__el-col">
            <label className="add-loc__label" htmlFor="description">
              Description
            </label>
            <div className="add-loc__sub-label">
              Location details, access issues, plant health, your mother's
              maiden name...
            </div>
            {errors.description && (
              <div className="add-loc__err">Please enter a description</div>
            )}
            <textarea
              ref={register({ required: true })}
              name="description"
              id="description"
            />
          </div>
          <div className="add-loc__el add-loc__el-col">
            <div className="add-loc__el-row">
              <div className="add-loc__label">Season</div>

              <div>
                <input
                  ref={register}
                  type="checkbox"
                  name="no_season"
                  id="no_season"
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
                ref={register}
                className="add-loc__pos"
                name="season_start"
                id="season_start"
                disabled={watchNoSeason}
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
              <select
                ref={register}
                className="add-loc__pos"
                name="season_end"
                id="season_end"
                disabled={watchNoSeason}
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
            <select
              ref={register({ required: true })}
              name="access"
              id="access"
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
                <input
                  ref={register}
                  type="checkbox"
                  id="unverified"
                  name="unverified"
                />
                <label htmlFor="unverified">Verified?</label>
              </div>
              <div className="add-loc__sub-label">
                If you doubt the existence, location, or identity of this
                source.
              </div>
            </div>
          </div>

          <div className="add-loc__el">
            <div className="add-loc__label">
              <input
                ref={register}
                type="checkbox"
                id="visited"
                name="visited"
              />
              <label htmlFor="visited">Have you visted this location?</label>
            </div>
            <div className="add-loc__sub-label">Go on.....</div>
          </div>
          {watchVisited === true ? (
            <AddLocationForm2 register={register} />
          ) : null}
          <div className="add-loc__btn-cont">
            <button
              // type="submit"
              // onSubmit={handleSubmit}
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
