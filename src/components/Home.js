import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../config/Firebase";
import { logout, selectUser } from "../features/userSlice";
import Feed from "./Feed";
import Handshakes from "./Handshakes";
import Sidebar from "./Sidebar";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      {/* three sections */}
      {/* sidebar (for profile info) */}
      <Sidebar />
      {/* feed (posts) */}
      <Feed />
      {/* friends (after those two) */}
      <Handshakes />
    </div>
  );
}

export default Home;
