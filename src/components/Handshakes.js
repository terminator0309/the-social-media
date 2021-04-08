import { animated, useSpring } from "@react-spring/web";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { firebase, db, storage } from "../config/Firebase";
import { selectUser } from "../features/userSlice";
import "../styles/Handshakes.css";
import ProfilePic from "./ProfilePic";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "./utilities/Notification";

/**
 * in db requestsReceived contains the data about the user who sent the request
 * not using requestsSend as of now, just for simplicity purposes
 * here's a some previous broken code
  // useDidMountEffect(async () => {
  //   if (requestsReceived.length !== 0) {
  //     console.log("wow", requestsReceived);
  //     const handshakeRequests = await db
  //       .collection("users")
  //       .where("email", "in", requestsReceived)
  //       .get();
  //     if (handshakeRequests.empty) {
  //       console.log("shit");
  //       return;
  //     }
  //     handshakeRequests.forEach((requestingUser) =>
  //       setrequestsReceivedList([
  //         ...requestsReceivedList,
  //         requestingUser.data(),
  //       ])
  //     );
  //     console.log("ahh", requestsReceivedList);
  //   }
  // }, [requestsReceived]);
 */

function Handshakes() {
  const [searchInput, setsearchInput] = useState("");
  const [requestsReceived, setrequestsReceived] = useState([]);
  const [handshakers, sethandshakers] = useState([]);
  const currentUser = useSelector(selectUser);
  const handshakesRef = useRef();

  useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          sethandshakers(snapshot.data().handshakers);
          setrequestsReceived(snapshot.data().requestsReceived);
        }
      });
  }, []);

  const userEssentialCredentials = (user) => ({
    displayName: user.displayName,
    email: user.email,
    uid: user.uid,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (
      currentUser === searchInput ||
      currentUser.handshakers.includes(searchInput)
    ) {
      notifyWarning(
        "Cannot sent request, either already a handshaker or a invalid query!"
      );
      return;
    }
    const searchedUser = await db
      .collection("users")
      .where("email", "==", searchInput)
      .get();
    if (searchedUser.empty) {
      notifyError("No user found.");
    } else {
      // there exists only one user, forEach loop is used because data is received in an array
      searchedUser.forEach(
        async (doc) =>
          await db
            .collection("users")
            .doc(doc.id)
            .update({
              requestsReceived: firebase.firestore.FieldValue.arrayUnion(
                userEssentialCredentials(currentUser)
              ),
            })
      );
      notifySuccess("Request sent!");
    }
  };

  const requestAction = async (requestingUser, accepted) => {
    const usersRef = db.collection("users");
    if (accepted) {
      await usersRef.doc(requestingUser.uid).update({
        handshakers: firebase.firestore.FieldValue.arrayUnion(
          userEssentialCredentials(currentUser)
        ),
      });
      await usersRef.doc(currentUser.uid).update({
        handshakers: firebase.firestore.FieldValue.arrayUnion(
          userEssentialCredentials(requestingUser)
        ),
      });
    }
    await usersRef.doc(currentUser.uid).update({
      requestsReceived: firebase.firestore.FieldValue.arrayRemove(
        userEssentialCredentials(requestingUser)
      ),
    });
  };

  const toggleHandshakes = () => {
    if (window.innerWidth > 1000) {
      handshakesRef.current.style.transform = "none";
      return;
    }
    if (handshakesRef.current.style.transform !== "none") {
      handshakesRef.current.style.transform = "none";
    } else handshakesRef.current.style.transform = "translateX(200%)";
  };

  const slideInRight = useSpring({
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
  });

  return (
    <>
      <animated.div
        className="handshakes"
        style={slideInRight}
        ref={handshakesRef}
      >
        <div className="handshakes__form">
          <form>
            <input
              type="text"
              value={searchInput}
              className="handshakes__input"
              onChange={(e) => setsearchInput(e.target.value)}
              placeholder="Enter your friend's Email ID"
            />
            <button
              type="submit"
              className="primary-button"
              style={{ margin: 0 }}
              onClick={handleSearch}
            >
              Search
            </button>
          </form>
        </div>
        <div className="requestsReceived">
          <div className="requestsReceived__heading">Handshake requests</div>
          <div className="requestsReceived__list">
            {requestsReceived.length ? (
              requestsReceived.map((requestingUser) => (
                <div key={requestingUser.uid} className="requestingUser">
                  <div className="requestingUser__info">
                    <ProfilePic
                      uid={requestingUser.uid}
                      displayName={requestingUser.displayName}
                    />
                    <div className="requestingUser__displayName">
                      {requestingUser.displayName}
                    </div>
                  </div>
                  <div className="requestingUser__action">
                    <button
                      className="primary-button"
                      onClick={() => requestAction(requestingUser, true)}
                    >
                      Accept
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => requestAction(requestingUser, false)}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no__requests">
                No handshake request right now!
              </div>
            )}
          </div>
        </div>
        <div className="handshakers">
          <div className="handshakers__heading">Handshakers</div>
          {handshakers.length ? (
            handshakers.map((handshaker) => (
              <div key={handshaker.uid} className="handshaker__info">
                <ProfilePic
                  uid={handshaker.uid}
                  displayName={handshaker.displayName}
                />
                <div className="handshaker__displayName">
                  {handshaker.displayName}
                </div>
              </div>
            ))
          ) : (
            <div className="no__handshakers">Make some friends right now!</div>
          )}
        </div>
      </animated.div>
      <button
        className=" primary-button handshakes__revealButton"
        onClick={toggleHandshakes}
      >
        Handshakes
      </button>
    </>
  );
}

export default Handshakes;
