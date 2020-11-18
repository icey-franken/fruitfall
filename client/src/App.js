import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthRoute, ProtectedRoute } from "./route_utils";
import { useHistory } from "react-router-dom";

import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";
import Signup from "./components/Auth/Signup";

// import UserList from "./components/UsersList";
import UserForm from "./components/UserForm";
import {AuthContext} from "./auth";
import MapContextProvider from "./MapContextProvider";
import NavBar from "./components/NavBar";
import MapContainer from "./components/Map/MapContainer";
import { LngLatContextProvider } from "./components/Map/LngLatContext";
function App() {
  const {currentUserId} = useContext(AuthContext)
  // const history = useHistory();
  // const [fetchWithCSRF, setFetchWithCSRF] = useState(() => fetch);
  // const [currentUserId, setCurrentUserId] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function restoreCSRF() {
  //     const response = await fetch("/api/csrf/restore", {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     if (response.ok) {
  //       const authData = await response.json();
  //       setFetchWithCSRF(() => {
  //         return (resource, init) => {
  //           if (init.headers) {
  //             init.headers["X-CSRFToken"] = authData.csrf_token;
  //           } else {
  //             init.headers = {
  //               "X-CSRFToken": authData.csrf_token,
  //             };
  //           }
  //           return fetch(resource, init);
  //         };
  //       });
  //       if (authData.current_user_id) {
  //         setCurrentUserId(authData.current_user_id);
  //       }
  //     }
  //     setLoading(false);
  //   }
  //   restoreCSRF();
  // }, []);


  // const authContextValue = {
  //   fetchWithCSRF,
  //   currentUserId,
  //   setCurrentUserId,
  //   // logoutUser,
  // };

  // if (loading) {
  //   return null;
  // }

  return (
      <BrowserRouter>
        <NavBar currentUserId={currentUserId} />
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
