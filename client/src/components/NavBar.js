import React from "react";
import {NavLink} from 'react-router-dom';


export default function NavBar() {
  return (
    <div className="navbar-cont">
			<NavLink className='navbar-item' exact to="/" activeclass="active">
        Map
      </NavLink>

      <NavLink className='navbar-item' exact to="/login" activeclass="active">
        Login
      </NavLink>

      <NavLink className='navbar-item' exact to="/users" activeclass="active">
        Users
      </NavLink>
    </div>
  );
}
