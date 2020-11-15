import React from "react";
import { useWatch } from "react-hook-form";

const SeasonFormComponent = ({
  register,
  seasonError,
  setError,
  getValues,
  clearErrors,
  control,
  monthsRef,
}) => {
  //use watch to isolate re-renders to this component
  const { no_season, unknown_season } = useWatch({
    control,
    name: ["no_season", "unknown_season"],
  });

  const disableField = no_season || unknown_season;

  const validateSeason = () => {
    const { no_season, unknown_season } = getValues([
      "no_season",
      "unknown_season",
    ]);
    if ((no_season && !unknown_season) || (!no_season && unknown_season)) {
      clearErrors("season");
    } else if (no_season && unknown_season) {
      setError("season", {
        type: "required",
        message: 'Please select only one of "No Season" or "Unknown"',
      });
      // it is implied at this point that neither no_season nor unknown_season are selected.
    } else {
      const { season_stop, season_start } = getValues([
        "season_stop",
        "season_start",
      ]);
      if (season_stop === "" || season_start === "") {
        setError("season", {
          type: "required",
          message:
            'Please select a complete season range or one of "No Season" or "Unknown"',
        });
      } else {
        clearErrors("season");
      }
    }
  };
  console.log("re-renders season component");
  return (
    <div className="add-loc__el add-loc__el-col">
      <div className="add-loc__el-row">
        <div className="add-loc__label">Season</div>

        <div>
          <input
            ref={register}
            onChange={validateSeason}
            type="checkbox"
            name="no_season"
            id="no_season"
          />
          <label className="add-loc__label" htmlFor="no_season">
            No Season
          </label>
        </div>
        <div>
          <input
            ref={register}
            onChange={validateSeason}
            type="checkbox"
            name="unknown_season"
            id="unknown_season"
          />
          <label className="add-loc__label" htmlFor="unknown_season">
            Unknown
          </label>
        </div>
      </div>
      {seasonError && <div className="add-loc__err">{seasonError.message}</div>}
      <div className="add-loc__sub-label">
        When can the source be harvested? Leave blank if you don't know.
      </div>
      <div className="add-loc__el-row">
        <select
          ref={register}
          onChange={validateSeason}
          className="add-loc__pos"
          name="season_start"
          id="season_start"
          disabled={disableField}
        >
          <option className="invalid" value="" disabled hidden>
            Start
          </option>
          {monthsRef.current.map(([monthId, monthName], idx) => (
            <option key={idx} value={monthId}>
              {monthName}
            </option>
          ))}
        </select>
        <div className="add-loc__pos-spacer" />
        <select
          // we leave validation here, on last season input, so it is only run once
          ref={register({ validate: validateSeason })}
          onChange={validateSeason}
          className="add-loc__pos"
          name="season_stop"
          id="season_stop"
          disabled={disableField}
        >
          <option className="invalid" value="" disabled hidden>
            End
          </option>
          {monthsRef.current.map(([monthId, monthName], idx) => (
            <option key={idx} value={monthId}>
              {monthName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default React.memo(SeasonFormComponent);
