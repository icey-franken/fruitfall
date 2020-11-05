import React from "react";
import AddLocationSlider from "./AddLocationSlider";

export default function AddLocationForm2({
  handleChange,
  formData,
  setFormData,
}) {
  const elements = [
    ["fruiting-status", "Fruiting Status"],
    ["yield", "Yield"],
    ["quality", "Quality"],
  ];

  return (
    <>
      <div className="add-loc__el add-loc__el-col">
        <label className="add-loc__label" htmlFor="date">
          Date Visited
        </label>
        <input type="date" id="date" name="date" onChange={handleChange} />
      </div>
      {elements.map(([id, label], idx) => (
        <AddLocationSlider id={id} label={label} key={idx} />
      ))}
    </>
  );
}
