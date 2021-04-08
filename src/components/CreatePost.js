import { Close } from "@material-ui/icons";
import React, { useRef, useState } from "react";
import "../styles/CreatePost.css";
import { db, firebase, storage } from "../config/Firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { v4 as uuidv4 } from "uuid";
import { imageCompression } from "./utilities/ImageCompression";

function CreatePost({ closeModal }) {
  const [postInput, setpostInput] = useState("");
  const imageInputRef = useRef();
  const previewImageRef = useRef();
  const currentUser = useSelector(selectUser);

  const AddPostToDB = async (uniquePostID, url = "") => {
    await db.collection("posts").doc(uniquePostID).set({
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      email: currentUser.email,
      message: postInput,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      likedBy: [],
      postURL: url,
    });
  };

  const sendPost = async (e) => {
    e.preventDefault();
    const uniquePostID = uuidv4();

    // this condition is just working, will look into it later.
    if (previewImageRef.current.width) {
      await storage
        .ref("users/" + currentUser.uid + "/posts/" + uniquePostID + ".jpg")
        .putString(previewImageRef.current.src, "data_url")
        .then(
          async () =>
            await storage
              .ref(
                "users/" + currentUser.uid + "/posts/" + uniquePostID + ".jpg"
              )
              .getDownloadURL()
              .then((url) => AddPostToDB(uniquePostID, url))
        )
        .catch((err) => console.log(err));
    } else {
      AddPostToDB(uniquePostID);
    }
    setpostInput("");
    previewImageRef.current.src = "";
    previewImageRef.current.style.display = "none";
    closeModal();
  };

  return (
    <div className="createPost">
      <div className="createPost__heading">Create a Post</div>
      <hr />
      <div className="createPost__body">
        <form onSubmit={sendPost}>
          <textarea
            row="4"
            col="20"
            placeholder="What's on your mind?"
            value={postInput}
            onChange={(e) => {
              setpostInput(e.target.value);
            }}
          />
          <img
            src=""
            alt="Preview Post Image"
            id="previewPostImage"
            ref={previewImageRef}
            style={{ display: "none", paddingTop: "20px" }}
          />
          <input
            type="file"
            id="imageInput"
            accept=".jpeg, .jpg, .png"
            style={{ display: "none" }}
            ref={imageInputRef}
            onChange={() => {
              imageCompression(imageInputRef, previewImageRef);
            }}
          />

          <div
            className="secondary-button"
            onClick={() => imageInputRef.current.click()}
          >
            <p>Attach image</p>
          </div>
          <button type="submit" className="primary-button">
            Post
          </button>
        </form>
      </div>
      <div className="modalclose" onClick={closeModal}>
        <Close />
      </div>
    </div>
  );
}

export default CreatePost;

/* <form onSubmit={sendPost}>
          

          <input
            type="text"
            placeholder="Start a post"
            value={postInput}
            onChange={(e) => setpostInput(e.target.value)}
          />
          <button type="submit" style={{ display: "none" }} />
        </form> */
