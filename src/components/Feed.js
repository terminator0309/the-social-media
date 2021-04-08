import { useSpring, useTransition } from "@react-spring/core";
import { animated } from "@react-spring/web";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db, firebase } from "../config/Firebase";
import { selectUser } from "../features/userSlice";
import "../styles/Feed.css";
import CreatePost from "./CreatePost";
import Post from "./Post";
import ProfilePic from "./ProfilePic";

//! profile photo does not changes in posts on changing it in the profile,a manual refresh is needed

function Feed() {
  const [posts, setposts] = useState([]);
  const [toggleCreatePost, settoggleCreatePost] = useState(false);
  const currentUser = useSelector(selectUser);

  useEffect(() => {
    db.collection("posts")
      .where("email", "in", [...currentUser.handshakers, currentUser.email])
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setposts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
  }, []);

  const transitions = useTransition(toggleCreatePost, {
    from: { opacity: 0, y: 20, zIndex: 5 },
    enter: { opacity: 1, y: 0, zIndex: 5 },
    leave: { opacity: 0, y: -20, zIndex: 5 },
  });

  const slideInTop = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
  });

  return (
    <>
      <div className="feed">
        <animated.div className="feed__createPost" style={slideInTop}>
          <ProfilePic
            uid={currentUser.uid}
            displayName={currentUser.displayName}
          />
          <div
            className="feed__startPost"
            onClick={() => settoggleCreatePost(!toggleCreatePost)}
          >
            <p>Start a Post</p>
          </div>
        </animated.div>
        <div className="feed__posts">
          {posts.length ? (
            posts.map((post) => <Post post={post} key={post.id} />)
          ) : (
            <div className="no__posts">No posts yet!</div>
          )}
        </div>
      </div>

      {transitions(
        (props, item) =>
          item && (
            <animated.div style={props} className="createPost__container">
              <CreatePost closeModal={() => settoggleCreatePost(false)} />
            </animated.div>
          )
      )}
    </>
  );
}

export default Feed;
