import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  username: "",
  isLoggedIn: false,
  login: (token, username) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialName = localStorage.getItem("name");
  const initialToken = localStorage.getItem("token");

  const [token, setToken] = useState(initialToken);
  const [username, setUsername] = useState(initialName);
  // const [username, setUsername] = useState(null);

  const userIsLoggedIn = !!token;

  const loginHandler = (token, username) => {
    setToken(token);
    setUsername(username);
    localStorage.setItem("name", username);
    localStorage.setItem("token", token);
  };

  const logoutHandler = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("name");
    localStorage.removeItem("token");
  };

  const contextValue = {
    token: token,
    username: username,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;