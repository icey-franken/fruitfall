import React, { useEffect, useContext } from "react";
import { LngLatContext } from "../LngLatContext";

const PositionFormComponent = ({
  register,
  positionError,
  setError,
  getValues,
  setValue,
  clearErrors,
}) => {
  const { lngLat } = useContext(LngLatContext);

  useEffect(() => {
    setValue("lng", lngLat.lng);
    setValue("lat", lngLat.lat);
    // clear errors if they exist - could also just call clear errors
    clearErrors("position");
  }, [lngLat.lng, lngLat.lat]);

  const validatePosition = () => {
    const { lat, lng } = getValues(["lat", "lng"]);
    console.log(positionError);
    if (isNaN(lat) || isNaN(lng)) {
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
      {positionError && (
        <div className="add-loc__err">{positionError.message}</div>
      )}
      <div className="add-loc__el-row">
        <input
          ref={register}
          onChange={validatePosition}
          className="add-loc__pos"
          name="lat"
          id="lat"
          placeholder="Latitude"
        />
        <div className="add-loc__pos-spacer" />
        <input
          ref={register({ validate: validatePosition })}
          onChange={validatePosition}
          className="add-loc__pos"
          name="lng"
          id="lng"
          placeholder="Longitude"
        />
      </div>
    </div>
  );
};
export default React.memo(PositionFormComponent);
