import React, { useCallback, useState } from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ProfilePic from "./ProfilePic";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import debounce from "lodash.debounce";
import { db, firebase } from "../config/Firebase";
import "../styles/Post.css";

// ! if the word's width is larger than the feed body, something weird happens 🤷‍♂️

function Post({ post }) {
  const currentUser = useSelector(selectUser);
  const [isLiked, setisLiked] = useState(
    post.data.likedBy.includes(currentUser.uid)
  );
  const [likeCount, setlikeCount] = useState(post.data.likedBy.length);

  const debounceLike = useCallback(
    debounce(async (uid, isLiked) => {
      if (isLiked) {
        await db
          .collection("posts")
          .doc(post.id)
          .update({
            likedBy: firebase.firestore.FieldValue.arrayUnion(uid),
          });
        setlikeCount((likeCount) => likeCount + 1);
      } else {
        await db
          .collection("posts")
          .doc(post.id)
          .update({
            likedBy: firebase.firestore.FieldValue.arrayRemove(uid),
          });
        setlikeCount((likeCount) => {
          return likeCount > 0 ? likeCount - 1 : 0;
        });
      }
    }, 500),
    []
  );

  const handleLike = () => {
    setisLiked((isLiked) => {
      debounceLike(currentUser.uid, !isLiked);
      return !isLiked;
    });
  };

  return (
    <div className="feed__post">
      <div className="feed__postheader">
        <ProfilePic uid={post.data.uid} displayName={post.data.displayName} />
        <div>{post.data.displayName}</div>
      </div>
      <div className="feed__postbody">{post.data.message}</div>
      {post.data.postURL && (
        <div className="feed__postImage">
          <img src={post.data.postURL} alt="Posted photo" width="80%" />
        </div>
      )}
      <hr />
      <div className="feed__reactions">
        <div className="feed__postLikes" onClick={() => handleLike()}>
          {isLiked ? (
            <FavoriteIcon style={{ color: "rgb(235, 64, 64)" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </div>
        <div className="feed__postsLikeCount">
          {likeCount} {`like${likeCount <= 1 ? "" : "s"}`}
        </div>
      </div>
    </div>
  );
}

export default Post;
