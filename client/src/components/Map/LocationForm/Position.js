import React from "react";
import { useWatch } from "react-hook-form";
export default function PositionFormComponent({ useFormObj }) {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    watch,
    getValues,
    clearErrors,
    control,
  } = useFormObj;

  const validatePosition = () => {
		console.log(errors)
		const { lat, lng } = getValues(["lat", "lng"]);
		console.log(parseInt(lat))
		console.log(parseInt(lat) === NaN)
    if (lat === "" || lng === "") {
      setError("position", {
        type: "required",
        message: "Please enter a value for Latitude and Longitude",
      });
    } else if (parseInt(lat).isNaN() || parseInt(lng).isNaN()) {
      setError("position", {
        type: "required",
        message: "Latitude and Longitude must be numbers",
      });
    } else {
			clearErrors('position')
		}
  };

  console.log("re-renders position component");
  return (
    <div className="add-loc__el add-loc__el-col">
      <div className="add-loc__label" htmlFor="position">
        Position
      </div>
      <div className="add-loc__sub-label">
        Click on the map for a moveable pin to get coordinates, or search for a
        location's address in the upper right-hand corner.
      </div>
      {errors.position && (
        <div className="add-loc__err">{errors.position.message}</div>
      )}
      <div className="add-loc__el-row">
        <input
          ref={register({ validate: validatePosition })} //add custom validation
          className="add-loc__pos"
          name="lat"
          id="lat"
          placeholder="Latitude"
        />
        <div className="add-loc__pos-spacer" />
        <input
          ref={register({ validate: validatePosition })}
          className="add-loc__pos"
          name="lng"
          id="lng"
          placeholder="Longitude"
        />
      </div>
    </div>
  );
}
