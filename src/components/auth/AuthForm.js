import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOverlap, setIsOverlap] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    if (isLogin) {
      fetch("/api/user/login", {
        method: "POST",
        body: JSON.stringify({
          username: enteredUsername,
          password: enteredPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            console.log(res);
            if (res.status === 401) {
              alert("아이디 또는 비밀번호를 잘못 입력했습니다.");
            }
            return res.json().then((data) => {
              throw new Error();
            });
          }
        })
        .then((data) => {
          console.log(data);
          authCtx.login(data.accessToken, data.username);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      fetch("/api/user/signup", {
        method: "POST",
        body: JSON.stringify({
          username: enteredUsername,
          password: enteredPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setIsLoading(false);
          console.log(res.status);

          if (res.ok) {
            setIsOverlap(false);
            return res.json();
          } else if (res.status === 500) {
            setIsOverlap(true);
          } else {
            return res.json().then((data) => {
              console.log(data);
              throw new Error();
            });
          }
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  return (
    <section className={classes.auth}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="username">user name</label>
          <input type="text" id="username" required ref={usernameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">password</label>
          <input type="password" id="password" required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {isOverlap && <p>중복된 ID입니다.</p>}
          {!isLoading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {isLoading && <p>Sending request...</p>}
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
