import { createContext } from "react";
export const AuthContext = createContext({
  currentUserId: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
