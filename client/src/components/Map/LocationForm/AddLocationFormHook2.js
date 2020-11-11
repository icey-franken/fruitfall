import React from "react";
import AddLocationSlider from "./AddLocationSlider";

export default function AddLocationForm2({
  handleChange,
  formData,
  setFormData,
  register,
}) {
  // eventually get from db
  const elements = [
    ["fruiting-status", "Fruiting Status"],
    ["quality", "Quality"],
    ["yield", "Yield"],
  ];

  return (
    <>
      <div className="add-loc__el add-loc__el-col">
        <label className="add-loc__label" htmlFor="date">
          Date Visited
        </label>
        <input
          ref={register({ required: true })}
          type="date"
          id="date-visited"
          name="date_visited"
          // onChange={handleChange}
        />
      </div>
      {elements.map(([id, label], idx) => (
        <AddLocationSlider
          // currentValue={formData[id]}
          register={register}
          id={id}
          label={label}
          key={idx}
          // handleChange={handleChange}
        />
      ))}
    </>
  );
}
