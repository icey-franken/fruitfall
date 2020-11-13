import React, { useState, useEffect, useRef, useContext } from "react";
import AddLocationForm2 from "./AddLocationFormHook2";
import AuthContext from "../../../auth";
import SeasonFormComponent from "./Season";
import PositionFormComponent from "./Position";
// import { LngLatContext } from "../LngLatContext";
import { useForm } from "react-hook-form";

const AddLocationFormHook = React.memo(
  ({
    // handleFormSubmitClick,
    // show,
    // handleAddLocationClick,
    // useFormObj,
    // lngLatRef,
  }) => {
    const useFormObj = useForm({
      defaultValues: {
        type_ids: "",
        lat: "",
        lng: "",
        description: "",
        season_start: "",
        season_stop: "",
        no_season: false,
        unknown_season: false,
        author: "", //don't have yet
        access: "",
        unverified: false,
        visited: false,
        date_visited: null, //the next four come from second form
        "fruiting-status": 0,
        quality: 0,
        yield: 0,
      },
      reValidateMode: "onSubmit",
    });

    const { register, handleSubmit, errors, watch, getValues } = useFormObj;
    const { fetchWithCSRF } = useContext(AuthContext);

    const watchVisited = watch("visited");
    // const { lngLat } = useContext(LngLatContext);

    const onSubmitHook = (data) => {
      console.log(data);
      // fetchWithCSRF("/api/features/add-location-form", {
      //   method: "POST",
      //   body: JSON.stringify(data),
      //   headers: { "Content-Type": "application/json" },
      // });
      // remember to switch unverified value before making post
    };

    // get select field values from database - addd these to context
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

    console.log("re-renders add location form");

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
      <>
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
            <PositionFormComponent
              useFormObj={useFormObj}
              // lngLatRef={lngLatRef}
            />
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
            <SeasonFormComponent
              useFormObj={useFormObj}
              monthsRef={monthsRef}
            />
            <div className="add-loc__el add-loc__el-col">
              <label className="add-loc__label" htmlFor="access">
                Access
              </label>
              <div className="add-loc__sub-label">
                Access status of the source.
              </div>
              {errors.access && (
                <div className="add-loc__err">Please select an access</div>
              )}
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
      </>
    );
  }
);
export default AddLocationFormHook;
