import React, { useState } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import "../styles/Register.css";
import { withRouter } from "react-router";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
// import { useSpring, useTrail } from "@react-spring/core";
// import { animated } from "@react-spring/web";
import { useSpring, animated } from "react-spring";

function Register({ history }) {
  const [login, setlogin] = useState(false);
  const [signup, setsignup] = useState(false);
  const currentUser = useSelector(selectUser);

  const showLogin = () => {
    setlogin(true);
    setsignup(false);
  };

  const showSignup = () => {
    setlogin(false);
    setsignup(true);
  };

  const slideInRight = useSpring({
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
  });
  const slideInleft = useSpring({
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0 },
  });

  if (currentUser) history.push("/");

  return (
    <div className="register">
      <animated.div className="register__left" style={slideInleft}>
        <img src="../images/socialMedia.svg" alt="Social Media" />
      </animated.div>
      <animated.div className="register__right" style={slideInRight}>
        {login ? (
          <Login showSignup={showSignup} />
        ) : signup ? (
          <Signup showLogin={showLogin} />
        ) : (
          <></>
        )}
        {!(login || signup) && (
          <>
            <div className="register__heading">
              <div>Connecting People</div>
              <div>Join today.</div>
            </div>
            <div className="register__buttons">
              <button
                className="primary-button"
                style={{ width: "140px", height: "50px" }}
                onClick={showSignup}
              >
                Signup
              </button>
              <button
                className="secondary-button"
                style={{ marginTop: "10%", width: "140px", height: "50px" }}
                onClick={showLogin}
              >
                Login
              </button>
            </div>
          </>
        )}
      </animated.div>
    </div>
  );
}

export default withRouter(Register);
