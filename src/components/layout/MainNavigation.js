import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <header className={classes.header}>
      <Link to="/" className={classes.logo}>
        <h3>UVideo</h3>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li className={classes.item}>
              <Link to="/auth"> Login </Link>
            </li>
          )}
          {isLoggedIn && (
            <li className={classes.item}>
              <Link to="/my-page"> My Page </Link>
            </li>
          )}

          {/* 관리자일때만 */}
          {/* {isLoggedIn && (
            <li className={classes.item}>
              <Link to="/video-list"> admin video list </Link>
            </li>
          )}
          {isLoggedIn && (
            <li className={classes.item}>
              <Link to="/user-list"> admin user list </Link>
            </li>
          )} */}

          {isLoggedIn && (
            <li>
              <button className={classes.logoutBtn} onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
