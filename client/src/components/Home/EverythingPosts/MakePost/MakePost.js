import styles from "./MakePost.module.css";
import React, { useState, useEffect, FormEvent } from "react";
import profilePic from "./profile.png";
import PostForm from "../../PostForm/PostForm";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";

const MakePost = () => {
  const currentUser = useAppSelector((state) => state.currentUser);
  const [showModal, setShowModal] = useState(false);

  /* -------------------------------------------------------------------------- */

  return (
    <div className={styles.container}>
      <div className={styles.picInputContainer}>
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
        </div>

        <div className={styles.input} onClick={() => setShowModal(!showModal)}>
          What's on your mind,&nbsp;
          {currentUser.name ? currentUser.name : "name here"}?
        </div>
      </div>

      <PostForm showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default MakePost;
