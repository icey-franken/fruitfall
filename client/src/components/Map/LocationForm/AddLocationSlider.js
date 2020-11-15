import React from "react";

export default function AddLocationSlider({
  id,
  label,
  // handleChange,
  // currentValue,
  register,
}) {
  let sliderValues = [
    [0, "Unsure"],
    [1, "Poor"],
    [2, "Fair"],
    [3, "Good"],
    [4, "Great"],
    [5, "Excellent"],
  ];

  if (id === "fruiting-status") {
    sliderValues = [
      [0, "Unsure/Other"],
      [1, "Flowers"],
      [2, "Unripe Fruit"],
      [3, "Ripe Fruit"],
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
