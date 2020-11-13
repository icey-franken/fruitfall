import React from 'react';
import {useFieldArray} from 'react-hook-form'

export default function SeasonFormComponent({useFormObj, monthsRef}){
  const { control, register, handleSubmit, errors, watch, getValues } = useFormObj;
	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "season", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
	});
	console.log(fields)
	const watchNoSeason = watch("no_season");
  const watchUnknownSeason = watch("unknown_season");


	const validateSeason = (e) => {
    console.log("season validation 'e':", e);
		const season = getValues('season.season_start');
		console.log(season)
		// { no_season, unknown_season, season_stop, season_start } =
    // console.log(
    //   "seasonValues:",
    //   no_season,
    //   unknown_season,
    //   season_stop,
    //   season_start
    // );
    // console.log(errors);
    // if (no_season && unknown_season) {
    //   return 'Please select only one of "No Season" or "Unknown"';
    //   // } else if ()
    // } else if (
    //   !no_season &&
    //   !unknown_season &&
    //   (season_stop === "" || season_start === "")
    // ) {
    //   return 'Please select a complete season range or one of "No Season" or "Unknown"';
    // } else{

		// }
    // return false;
  };
  console.log(watchNoSeason, watchUnknownSeason);

	return (
		<div className="add-loc__el add-loc__el-col">
            <div className="add-loc__el-row">
              <div className="add-loc__label">Season</div>

              <div>
                <input
                ref={register('season.no_season', {validate: validateSeason})}
								type="checkbox"
                  name="no_season"
                  id="no_season"
                />
                <label className="add-loc__label" htmlFor="no-season">
                  No Season
                </label>
              </div>
              <div>
                <input
                ref={register('season.unknown_season', {validate: validateSeason})}
								type="checkbox"
                  name="unknown_season"
                  id="unknown_season"
                />
                <label className="add-loc__label" htmlFor="unknown_season">
                  Unknown
                </label>
              </div>
            </div>
            {/* I think we will cahnge this to only errors.season_end */}
            {errors.season_stop && (
              <div className="add-loc__err">{errors.no_season.message}
							...
							{errors.unknown_season.message}
							...
							{errors.season_start.message}
							...
							{errors.season_stop.message}


							</div>
            )}
            <div className="add-loc__sub-label">
              When can the source be harvested? Leave blank if you don't know.
            </div>
            <div className="add-loc__el-row">
              <select
                ref={register('season.season_start', {validate: validateSeason})}
                className="add-loc__pos"
                name="season_start"
                id="season_start"
                disabled={watchNoSeason || watchUnknownSeason}
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
								// NO - we do it on all four so error updates - but we put it in it's own component so only this piece rerenders
                ref={register('season.season_stop', {validate: validateSeason})}
                className="add-loc__pos"
                name="season_stop"
                id="season_stop"
                disabled={watchNoSeason || watchUnknownSeason}
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
	)
}
