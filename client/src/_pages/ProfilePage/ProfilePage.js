import styles from "./ProfilePage.module.css";
import React, { useState, useEffect } from "react";
import Info from "../../components/Profile/Info/Info";
import ProfilePic from "../../components/Profile/ProfilePic/ProfilePic";

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      <ProfilePic />
      <Info />
    </div>
  );
};

export default ProfilePage;
