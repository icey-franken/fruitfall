import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";

import UserList from "./components/UsersList";
import UserForm from "./components/UserForm";
import AuthContext from "./auth";
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

  return (
    <AuthContext.Provider value={authContextValue}>
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
    </AuthContext.Provider>
  );
}

export default App;
