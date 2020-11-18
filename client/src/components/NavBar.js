import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../auth";

export default function NavBar() {
  const { currentUserId, logoutUser } = useContext(AuthContext);
  console.log(currentUserId);
  return (
    <>
      <div className="navbar-cont">
        <div className="navbar-logo__cont">
          <div className="navbar-logo__logo">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              // xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              style={{ enableBackground: "new 0 0 20 20" }}
              // xml:space="preserve"
            >
              <path
                id="icon"
                d="M13,8c0,3.31-2.19,6-5.5,6S2,11.31,2,8c2.2643,0.0191,4.2694,1.4667,5,3.61V7H4.5C3.6716,7,3,6.3284,3,5.5v-3
	C3,2.2239,3.2239,2,3.5,2c0.1574,0,0.3056,0.0741,0.4,0.2l1.53,2l1.65-3c0.1498-0.232,0.4593-0.2985,0.6913-0.1487
	C7.8308,1.0898,7.8815,1.1404,7.92,1.2l1.65,3l1.53-2c0.1657-0.2209,0.4791-0.2657,0.7-0.1C11.9259,2.1944,12,2.3426,12,2.5v3
	C12,6.3284,11.3284,7,10.5,7H8v4.61C8.7306,9.4667,10.7357,8.0191,13,8z"
              />
            </svg>
          </div>
          <div className="navbar-logo__text">FruitFall</div>
        </div>
        <div className="navbar-item-cont">
          {/* <NavLink className="navbar-item" exact to="/" activeclass="active">
            Map
          </NavLink>
          <NavLink
            className="navbar-item"
            exact
            to="/activity"
            activeclass="active"
          >
            Activity
          </NavLink>
          <NavLink
            className="navbar-item"
            exact
            to="/data"
            activeclass="active"
          >
            Data
          </NavLink>
          <NavLink
            className="navbar-item"
            exact
            to="/about"
            activeclass="active"
          >
            About
					</NavLink>
					*/}
          {currentUserId ? (
            <div
              className="navbar-item"
              // exact
              // to="/logout"
              onClick={logoutUser}
            >
              Logout
            </div>
          ) : (
            <>
              <NavLink
                className="navbar-item"
                exact
                to="/login"
                activeclass="active"
              >
                Login
              </NavLink>
              <NavLink
                className="navbar-item"
                exact
                to="/signup"
                activeclass="active"
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
}
