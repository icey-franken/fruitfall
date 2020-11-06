import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="navbar-cont">
      <NavLink className="navbar-item" exact to="/" activeclass="active">
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
      <NavLink className="navbar-item" exact to="/data" activeclass="active">
        Data
      </NavLink>
      <NavLink className="navbar-item" exact to="/about" activeclass="active">
        About
      </NavLink>
    </div>
  );
}
