import React, { useEffect, useState, useContext } from "react";
import { useWatch } from "react-hook-form";
import { LngLatContext } from "../LngLatContext";

const PositionFormComponent = React.memo(({ useFormObj }) => {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    watch,
		getValues,
		setValue,
    clearErrors,
    control,
  } = useFormObj;

  const { lngLat } = useContext(LngLatContext);

  useEffect(() => {
    console.log("position use effect - lngLatState change");
    setValue("lng", lngLat.lng);
    setValue("lat", lngLat.lat);
  }, [lngLat.lng, lngLat.lat]);

  const validatePosition = () => {
    const { lat, lng } = getValues(["lat", "lng"]);
    console.log(errors);
    if (isNaN(lat) || isNaN(lng)) {
      // errors.position = {message:
      setError("position", {
        type: "required",
        message: "Latitude and Longitude must be numbers",
      });
    } else if (lat === "" || lng === "") {
      setError("position", {
        type: "required",
        message: "Please enter a value for Latitude and Longitude",
      });
    } else {
      clearErrors("position");
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
});
export default PositionFormComponent;
