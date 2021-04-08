import { Avatar } from "@material-ui/core";
import { Close, Photo } from "@material-ui/icons";
import { animated, useSpring, useTransition } from "@react-spring/web";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { auth, db, storage } from "../config/Firebase";
import { updatePhotoURL, logout, selectUser } from "../features/userSlice";
import "../styles/Sidebar.css";
import ProfilePic from "./ProfilePic";
import { imageCompression } from "./utilities/ImageCompression";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "./utilities/Notification";

function Sidebar({ history }) {
  const [toggleModal, settoggleModal] = useState(false);
  const [isUploading, setisUploading] = useState(false);
  const imageInputRef = React.useRef();
  const previewImageRef = React.useRef();
  const sidebarRef = React.useRef();
  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();

  const imageUpload = async () => {
    setisUploading(true);
    if (previewImageRef.current.width) {
      await storage
        .ref("users/" + currentUser.uid + "/profile.jpg")
        .putString(previewImageRef.current.src, "data_url")
        .then(
          async () =>
            await storage
              .ref("users/" + currentUser.uid + "/profile.jpg")
              .getDownloadURL()
              .then(async (url) => {
                await db.collection("users").doc(currentUser.uid).update({
                  photoURL: url,
                });
                await auth.currentUser
                  .updateProfile({
                    photoURL: url,
                  })
                  .then(() => dispatch(updatePhotoURL({ photoURL: url })));
              })
        )
        .catch((err) => {
          console.log("Error: ", err);
          notifyError(err.message);
          setisUploading(false);
        });
    } else {
      notifyWarning("Please select an image.");
      setisUploading(false);
      return;
    }
    previewImageRef.current.src = "";
    setisUploading(false);

    settoggleModal(false);
    window.location.reload();
    notifySuccess("Profile pic updated successfully 😎");
  };

  const handleLogout = () => {
    auth.signOut();
    dispatch(logout());
    history.push("/");
  };

  const slideInLeft = useSpring({
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0 },
  });

  const transitions = useTransition(toggleModal, {
    from: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -20, display: "none" },
  });

  const toggleSidebar = () => {
    if (window.innerWidth > 1000) {
      sidebarRef.current.style.transform = "translateX(0%)";
      return;
    }
    if (sidebarRef.current.style.transform !== "none") {
      sidebarRef.current.style.transform = "none";
    } else sidebarRef.current.style.transform = "translateX(-100%)";
  };
  return (
    <>
      <animated.div className="sidebar" style={slideInLeft} ref={sidebarRef}>
        <div className="sidebar__top">
          <ProfilePic
            uid={currentUser.uid}
            displayName={currentUser.displayName}
            large={true}
          />
          <div className="displayName">{currentUser.displayName}</div>
          <div className="email">
            <div>{currentUser.email}</div>
          </div>
        </div>
        <div className="sidebar__info">
          <div>Requests accepted : {currentUser.handshakers?.length}</div>
        </div>
        <div className="sidebar__bottom">
          <button
            className="primary-button"
            style={{ width: "40%", height: "40px", fontSize: "1.1em" }}
            onClick={() => settoggleModal(!toggleModal)}
          >
            Change dp
          </button>
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </animated.div>
      {transitions(
        (props, item) =>
          item && (
            <animated.div style={props} className="sidebar__modalcontainer">
              <div className="sidebar__modal">
                <img
                  src=""
                  alt="Preview image"
                  id="preview"
                  style={{ display: "none" }}
                  ref={previewImageRef}
                />
                <input
                  type="file"
                  accept=".jpeg, .jpg, .png"
                  id="file"
                  ref={imageInputRef}
                  onChange={() =>
                    imageCompression(imageInputRef, previewImageRef)
                  }
                />

                <button className="primary-button" onClick={imageUpload}>
                  {!isUploading ? "Upload" : "Uploading"}
                </button>
                <div
                  className="modalclose"
                  onClick={() => settoggleModal(false)}
                >
                  <Close />
                </div>
              </div>
            </animated.div>
          )
      )}
      <button
        className=" primary-button sidebar__revealButton"
        onClick={toggleSidebar}
      >
        Profile
      </button>
    </>
  );
}

export default withRouter(Sidebar);
