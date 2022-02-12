import styles from "./HomePage.module.css";
import React, { useState, useEffect } from "react";
import MakePost from "../../components/Home/EverythingPosts/MakePost/MakePost";
import PostList from "../../components/Home/EverythingPosts/PostList/PostList";
import NavBar from "../../components/Navigation/NavBar/NavBar";
const HomePage = () => {
  return (
    <div className={styles.container0}>
      <div className={styles.container}>
        <div className={styles.MakePost}>
          <MakePost />
        </div>
        <div className={styles.PostList}>
          <PostList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
