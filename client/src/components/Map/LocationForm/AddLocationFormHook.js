import React, { useState, useEffect, useRef, useContext } from "react";
import AddLocationForm2 from "./AddLocationFormHook2";
import AuthContext from "../../../auth";
import SeasonFormComponent from "./Season";
import PositionFormComponent from "./Position";
// import { LngLatContext } from "../LngLatContext";
import { useForm } from "react-hook-form";

const AddLocationFormHook = React.memo(({ closeForm }) => {
  const {
    register,
    errors,
    setError,
    getValues,
    setValue,
    clearErrors,
    control,
    handleSubmit,
    watch,
  } = useForm({
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
		// if form is too slow, turn this back on. Default is onChange. Looks better, but not if it's laggy
    // reValidateMode: "onSubmit",
  });

  const { fetchWithCSRF } = useContext(AuthContext);

  const watchVisited = watch("visited");

  const onSubmitHook = (data) => {
    // invoke this if no validation errors
    closeForm();
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
    console.log("hits get form fields use effect");
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
            register={register}
            positionError={errors.position}
            setError={setError}
            getValues={getValues}
            setValue={setValue}
            clearErrors={clearErrors}
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
            register={register}
            seasonError={errors.season}
            setError={setError}
            getValues={getValues}
            clearErrors={clearErrors}
            control={control}
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
						<AddLocationForm2 register={register}
						register={register}
            errors={errors}
            setError={setError}
            getValues={getValues}
            clearErrors={clearErrors}
						/>
          ) : null}
          <div className="add-loc__btn-cont">
            <button
              className="btn add-loc__btn"
            >
              Add Location
            </button>
          </div>
        </div>
      </form>
    </>
  );
});
export default AddLocationFormHook;
