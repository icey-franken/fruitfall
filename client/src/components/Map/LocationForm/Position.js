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


return (
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
                ref={register({ required: true })} //add custom validation
                className="add-loc__pos"
                name="lat"
                id="lat"
                placeholder="Latitude"
              />
              <div className="add-loc__pos-spacer" />
              <input
                ref={register({ required: true })}
                className="add-loc__pos"
                name="lng"
                id="lng"
                placeholder="Longitude"
              />
            </div>
          </div>
)

}
