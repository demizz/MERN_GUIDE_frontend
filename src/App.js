import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storage, setStorage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState();

  const login = useCallback((token, userId) => {
    localStorage.setItem("jwt", token);
    localStorage.setItem("currentUser", userId);
    setStorage(localStorage.getItem("jwt"));

    setCurrentUserId(userId);
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.clear();
    setCurrentUserId(null);
    setStorage(null);
  }, []);
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    const storedId = localStorage.getItem("currentUser");

    if (storedToken) {
      login(storedToken, storedId);
    }
  }, [login]);

  let routes;
  if (storage) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>

        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        currentUserId: currentUserId,
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
