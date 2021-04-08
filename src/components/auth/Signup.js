import { animated, useSpring } from "@react-spring/web";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { toast } from "react-toastify";
import { auth, db } from "../../config/Firebase";
import { login, selectUser } from "../../features/userSlice";
import "../../styles/Signup.css";
import LoadingSpinner from "../LoadingSpinner";
import { notifyError, notifySuccess } from "../utilities/Notification";

function Signup({ history, showLogin }) {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [loading, setloading] = useState(false);
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const validateForm = () => {
    let valid = true;
    if (username < 4) {
      notifyError("Username must be atleast 4 character long!");
      valid = false;
    }
    if (!validEmailRegex.test(email)) {
      notifyError("Email is not valid.");
      valid = false;
    }
    if (password !== confirmpassword) {
      notifyError("Both passwords doesn't match");
      valid = false;
    }
    if (password.length < 8) {
      notifyError("Password must be 8 characters long or longer.");
      valid = false;
    }

    return valid;
  };
  const createNewUserInDB = async (user) => {
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      displayName: username,
      email: user.email,
      photoURL: user.photoURL,
      requestsReceived: [],
      requestsSend: [],
      handshakers: [],
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setloading(true);
    console.log(username, email, password);
    if (validateForm()) {
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then((userAuth) =>
          userAuth.user
            .updateProfile({
              displayName: username,
            })
            .then(() => {
              dispatch(
                login({
                  uid: userAuth.user.uid,
                  displayName: username,
                  email: userAuth.user.email,
                  photoURL: userAuth.user.photoURL,
                  handshakers: [],
                })
              );
              createNewUserInDB(userAuth.user);
              notifySuccess("Signed up successfully!");
            })
        )
        .catch((error) => {
          console.log(error);
          notifyError(error.message);
        });

      history.push("/");
    }
    setloading(false);
  };

  const slideInRight = useSpring({
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
  });

  if (currentUser) history.push("/");

  return (
    <animated.div className="signup" style={slideInRight}>
      <div class="signup__heading">Sign Up</div>
      <form>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          placeholder="Username"
          required
        />
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
        <input
          type="password"
          name="password"
          value={confirmpassword}
          placeholder="Confirm Password"
          onChange={(e) => setconfirmpassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="primary-button"
          style={{ height: "50px" }}
          onClick={handleSignup}
          disabled={loading}
        >
          {!loading ? "Sign Up" : <LoadingSpinner />}
        </button>
      </form>
      <div class="redirect">
        Already a user?
        <div
          onClick={() => {
            if (!loading) showLogin();
          }}
        >
          Log in
        </div>
      </div>
    </animated.div>
  );
}

export default withRouter(Signup);
