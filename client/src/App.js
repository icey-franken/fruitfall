import React, { useContext } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthRoute, ProtectedRoute } from "./route_utils";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { AuthContext } from "./auth";
import NavBar from "./components/NavBar";
import MapContainer from "./components/Map/MapContainer";
import { LngLatContextProvider } from "./components/Map/LngLatContext";
function App() {
  const { currentUserId } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <NavBar />
      <LngLatContextProvider>
        <Switch>
          {/* <Route exact path="/activity">
                <div>activity page</div>
              </Route>
              <Route exact path="/data">
                <div>...data page</div>
              </Route>
              <Route exact path="/about">
                <div>about this is</div>
              </Route> */}
          <AuthRoute
            exact
            path="/login"
            component={Login}
            currentUserId={currentUserId}
          />
          <AuthRoute
            exact
            path="/signup"
            component={Signup}
            currentUserId={currentUserId}
          />
          <ProtectedRoute
            exact
            path="/"
            component={MapContainer}
            currentUserId={currentUserId}
          />
        </Switch>
      </LngLatContextProvider>
    </BrowserRouter>
  );
}

export default App;
