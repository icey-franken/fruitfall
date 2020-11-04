import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";

import UserList from "./components/UsersList";
import UserForm from "./components/UserForm";
import AuthContext from "./auth";
import NavBar from "./components/NavBar";
import MapContainer from "./components/Map/MapContainer";
import AddLocationForm from "./components/Map/AddLocationForm";
import AddLocationView from './views/AddLocationView'
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
          <Route exact path="/users">
            <UserList />
          </Route>
          <Route exact path="/login">
            <UserList />
          </Route>
          <Route exact path="/users/:id/edit" component={UserForm} />
          <Route exact path="/">
            <h1>My Home Page</h1>
          </Route>
          <Route exact path="/map">
            <MapContainer />
          </Route>
          <Route exact path="/add-location">
            <AddLocationView />
          </Route>
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
