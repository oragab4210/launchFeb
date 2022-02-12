import styles from "./ProfileDropdownInitiator.module.css";
import React, { useState, useEffect } from "react";
import profile from "./profile.png";

import { useAppSelector, useAppDispatch } from "../../../redux/hooks";

const ProfileDropdownInitiator = () => {
  const currentUser = useAppSelector((state) => state.currentUser);
  /* -------------------------------------------------------------------------- */
  return (
    <div className={styles.profilePicContainer}>
      {currentUser.profilePic ? (
        <img
          src={currentUser.profilePic}
          alt=""
          className={styles.profilePic}
        />
      ) : (
        <img
          src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt=""
          className={styles.profilePic}
        />
      )}
      {/* <img src={profile} alt="" className={styles.profilePic} /> */}
    </div>
  );
};

export default ProfileDropdownInitiator;
