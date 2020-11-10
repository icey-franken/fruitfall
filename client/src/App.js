import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";

import UserList from "./components/UsersList";
import UserForm from "./components/UserForm";
import AuthContext from "./auth";
import MapContext from './MapContext';
import NavBar from "./components/NavBar";
import MapContainer from "./components/Map/MapContainer";

function App() {
  const [fetchWithCSRF, setFetchWithCSRF] = useState(() => fetch);
  const authContextValue = {
    fetchWithCSRF,
	};

	useEffect(() => {
    async function restoreCSRF() {
      const response = await fetch("/api/csrf/restore", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const authData = await response.json();
        setFetchWithCSRF(() => {
          return (resource, init) => {
            if (init.headers) {
              init.headers["X-CSRFToken"] = authData.csrf_token;
            } else {
              init.headers = {
                "X-CSRFToken": authData.csrf_token,
              };
            }
            return fetch(resource, init);
          };
        });
      }
    }
    restoreCSRF();
  }, []);

// setting up map context
const [mapData, setMapData] = useState()
const mapContextValue = {
	mapData
}

useEffect(() => {
	console.log('hits get_data use effect. Data:', mapData)
	async function get_data() {
		const res = await fetch("/api/features/");
		console.log(res);
		const res_data = await res.json();
		console.log(res_data)
		// console.log(res_data)
		// const json_data = JSON.stringify(res_data);
		// setData(res_data);
		// mapData.current = res_data
		setMapData(res_data)
	}
	get_data();
	console.log("data use effect:", mapData);
}, []);

	return (
    <AuthContext.Provider value={authContextValue}>
			<MapContext.Provider value={mapContextValue}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/activity">
            <div>activity page</div>
          </Route>
          <Route exact path="/data">
            <div>...data page</div>
          </Route>
					<Route exact path="/about">
            <div>about this is</div>
          </Route>
          <Route exact path="/users/:id/edit" component={UserForm} />
          <Route exact path="/" component={MapContainer}/>
        </Switch>
      </BrowserRouter>
			</MapContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
