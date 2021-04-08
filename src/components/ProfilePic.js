import { Avatar, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { db } from "../config/Firebase";

const ProfilePic = ({ uid, displayName, large }) => {
  const [photoURL, setphotoURL] = useState("");

  useEffect(async () => {
    const userInfo = await db.collection("users").doc(uid).get();
    setphotoURL(userInfo.data()?.photoURL);
  }, []);

  const useStyles = makeStyles((theme) => ({
    sizeAvatar: {
      height: theme.spacing(10),
      width: theme.spacing(10),
    },
  }));

  const classes = useStyles();

  return (
    <Avatar
      src={photoURL}
      alt="Profile photo"
      className={large ? classes.sizeAvatar : ""}
    >
      {displayName?.toUpperCase()[0]}
    </Avatar>
  );
};

export default ProfilePic;
