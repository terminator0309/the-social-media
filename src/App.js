import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import PrivateRoute from "./components/auth/PrivateRoute";
import Home from "./components/Home";
import LoadingSpinner from "./components/LoadingSpinner";
import Register from "./components/Register";
import { auth, db } from "./config/Firebase";
import { login, logout, selectUser } from "./features/userSlice";
import "./styles/App.css";
import "react-toastify/dist/ReactToastify.min.css";

const BackgroundIcons = () => {
  return (
    <Fragment>
      <div className="breathing-icon">
        <img src="./images/heart.svg" alt="heart" />
      </div>
      <div className="breathing-icon">
        <img src="./images/heart.svg" alt="heart" />
      </div>
      <div className="breathing-icon">
        <img src="./images/like.svg" alt="like" />
      </div>
      <div className="breathing-icon">
        <img src="./images/like.svg" alt="like" />
      </div>
      <div className="breathing-icon">
        <img src="./images/comment.svg" alt="comment" />
      </div>
      <div className="breathing-icon">
        <img src="./images/comment.svg" alt="comment" />
      </div>
      <div className="breathing-icon">
        <img src="./images/share.svg" alt="share" />
      </div>
      <div className="breathing-icon">
        <img src="./images/share.svg" alt="share" />
      </div>
    </Fragment>
  );
};

// TODO: add loading animations to certain actions
// TODO: adding animations
// TODO: mobile view (media queries) : almost done :)
// TODO: a notification viewer for operation status and errors

function App() {
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  useEffect(async () => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        let handshakersListFromDB = (
          await db.collection("users").doc(userAuth.uid).get()
        ).data()?.handshakers;
        console.log(handshakersListFromDB);
        dispatch(
          login({
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            email: userAuth.email,
            photoURL: userAuth.photoURL,
            handshakers: handshakersListFromDB
              ? [...handshakersListFromDB.map((handshaker) => handshaker.email)]
              : [],
          })
        );
      } else dispatch(logout());
      setloading(false);
    });
  }, []);
  return (
    <div className="app">
      {!currentUser && <BackgroundIcons />}
      <ToastContainer limit={2} transition={Slide} />
      {loading ? (
        <LoadingSpinner color="grey" />
      ) : (
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
