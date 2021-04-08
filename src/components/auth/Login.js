import { animated, useSpring } from "@react-spring/web";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { auth, db } from "../../config/Firebase";
import { login, selectUser } from "../../features/userSlice";
import "../../styles/Login.css";
import LoadingSpinner from "../LoadingSpinner";
import { notifyError, notifySuccess } from "../utilities/Notification";

const Login = ({ history, showSignup }) => {
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const validateForm = () => {
    let valid = true;

    if (!validEmailRegex.test(email)) {
      notifyError("Email is not valid.");
      valid = false;
    }

    if (password.length < 8) {
      notifyError("Password must be 8 characters long or longer.");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e) => {
    setloading(true);
    e.preventDefault();
    if (!validateForm()) {
      setloading(false);
      return;
    }
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(async (userAuth) => {
        let handshakersListFromDB = (
          await db.collection("users").doc(userAuth.uid).get()
        ).data()?.handshakers;
        dispatch(
          login({
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            email: userAuth.user.email,
            photoURL: userAuth.user.photoURL,
            handshakers: handshakersListFromDB
              ? [...handshakersListFromDB.map((handshaker) => handshaker.email)]
              : [],
          })
        );
        notifySuccess("Logged in Successfully");
      })
      .catch((err) => {
        console.log("error", err);
        notifyError(err.message);
      });
    setloading(false);
    history.push("/");
  };

  const slideInRight = useSpring({
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
  });

  if (currentUser) history.push("/");

  return (
    <animated.div className="login" style={slideInRight}>
      <div className="login__heading">Login</div>
      <form>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setpassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="primary-button"
          style={{ height: "50px" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Log in"}
        </button>
      </form>
      <div className="redirect">
        Not a user?
        <div
          onClick={() => {
            if (!loading) showSignup();
          }}
        >
          Sign up
        </div>
      </div>
    </animated.div>
  );
};

export default withRouter(Login);
