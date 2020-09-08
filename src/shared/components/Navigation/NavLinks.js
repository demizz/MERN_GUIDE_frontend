import React, { useContext } from "react";
import "./NavLinks.css";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import axios from "axios";
const NavLinks = (props) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const logoutUser = async () => {
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/users/logout`,
        method: "GET",
      });
      if (res.data.status === "success") {
        auth.logout();
        history.push("/");
      }
    } catch (err) {}
  };
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.currentUserId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth"> AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && <button onClick={logoutUser}>logout</button>}
    </ul>
  );
};

export default NavLinks;
