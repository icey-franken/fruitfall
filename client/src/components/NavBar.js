import React from "react";
import {NavLink} from 'react-router-dom';


export default function NavBar() {
  return (
    <div className="navbar-cont">
			<NavLink className='navbar-item' exact to="/" activeclass="active">
        Home
      </NavLink>

      <NavLink className='navbar-item' exact to="/login" activeclass="active">
        Login
      </NavLink>

      <NavLink className='navbar-item' exact to="/users" activeclass="active">
        Users
      </NavLink>
			<NavLink className='navbar-item' exact to="/map" activeclass="active">
        Map
      </NavLink>
			<NavLink className='navbar-item' exact to="/add-location" activeclass="active">
        Add Location
      </NavLink>
    </div>
  );
}
