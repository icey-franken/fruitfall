import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthRoute, ProtectedRoute } from "./route_utils";

import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";
import Signup from "./components/Auth/Signup";

// import UserList from "./components/UsersList";
import UserForm from "./components/UserForm";
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
            path="/logout"
            component={Logout}
            currentUserId={currentUserId}
          />
          <AuthRoute
            exact
            path="/signup"
            component={Signup}
            currentUserId={currentUserId}
          />

          <Route exact path="/users/:id/edit" component={UserForm} />
          <Route exact path="/" component={MapContainer} />
        </Switch>
      </LngLatContextProvider>
    </BrowserRouter>
  );
}

export default App;
