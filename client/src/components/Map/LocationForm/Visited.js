import React from "react";
import AddLocationSlider from "./AddLocationSlider";

export default function Visited({
  handleChange,
  formData,
  setFormData,
  register,
  errors,
}) {
  // eventually get from db
  const elements = [
    ["fruiting_status", "Fruiting Status"],
    ["quality", "Quality"],
    ["yield", "Yield"],
  ];
console.log(errors)
  return (
    <>
      <div className="add-loc__el add-loc__el-col">
        <label className="add-loc__label" htmlFor="date">
          Date Visited
        </label>
        {errors.date_visited && <div className="add-loc__err">Please enter a date</div>}
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
