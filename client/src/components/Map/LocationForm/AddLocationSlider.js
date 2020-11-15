import React from "react";

export default function AddLocationSlider({
  id,
  label,
  // handleChange,
  // currentValue,
  register,
}) {
  let sliderValues = [
    [1, "Unsure"],
    [2, "Poor"],
    [3, "Fair"],
    [4, "Good"],
    [5, "Great"],
    [6, "Excellent"],
  ];

  if (id === "fruiting-status") {
    sliderValues = [
      [1, "Unsure/Other"],
      [2, "Flowers"],
      [3, "Unripe Fruit"],
      [4, "Ripe Fruit"],
    ];
  }

  return (
    <div className="add-loc__el add-loc__el-col">
      <label className="add-loc__label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={register({ required: true })}
        type="range"
        min="0"
        max={`${sliderValues.length - 1}`}
        step="1"
        list={`${id}-values`}
        id={id}
        name={id}
        // onChange={handleChange}
        // value={currentValue}
      />
      <div
        className={`add-loc__slider-cont ${
          id === "fruiting-status"
            ? "add-loc__slider-cont-fruit"
            : "add-loc__slider-cont-other"
        }`}
      >
        {sliderValues.map(([valueId, valueLabel], idx) => (
          <div className="add-loc__slider-el" key={idx}>
            {valueLabel}
          </div>
        ))}
      </div>
    </div>
  );
}
