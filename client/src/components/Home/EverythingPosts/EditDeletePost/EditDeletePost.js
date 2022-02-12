import styles from "./EditDeletePost.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./modal/modal";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import X_SVG from "./x.svg";
import { useMutation, useQuery } from "@apollo/client";
import currentUserQuery from "../../../../GQL/queries/CurrentUser";
import editPostMutation from "../../../../GQL/mutations/editPost";
import deletePostMutation from "../../../../GQL/mutations/deletePost";
import editUserMutation from "../../../../GQL/mutations/editUser";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

const EditDeletePost = ({ postId, postContent }) => {
  const [editPost] = useMutation(editPostMutation);
  const [deletePost] = useMutation(deletePostMutation);
  const [editUser] = useMutation(editUserMutation);
  const { refetch } = useQuery(currentUserQuery);
  const currentUser = useAppSelector((state) => state.currentUser);
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState(postContent);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setPostText(postContent);
  }, [postContent]);

  const editPostOnClick = () => {
    setLoading(true);
    editPost({
      variables: {
        id: postId,
        post: postText,
      },
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    })
      // .then((res) => refetch())
      .then((res) => [setShowModal(false), setLoading(false)])
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);
        console.log(errors);
      });
  };
  const deletePostOnClick = (e) => {
    setLoading(true);
    console.log("start");
    /* ----------------------------- delete Post ----------------------------- */
    deletePost({
      variables: {
        id: postId,
      },
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    })
      /* -----------------------------Delete post from User--------------------------------------------- */
      .then((res) =>
        editUser({
          variables: {
            id: currentUser.id,
            deletePost: postId,
          },
          refetchQueries: [{ query: currentUserQuery }],
          awaitRefetchQueries: true,
        })
          .then([setShowModal(false), setLoading(false)])
          .catch((err) => {
            const errors = err.graphQLErrors?.map((error) => error.message);
            console.log(errors);
          })
      )
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);
        console.log(errors);
      });
  };

  if (!showModal) return <div onClick={() => setShowModal(true)}>...</div>;

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div
        className={styles.container}
        // ref={modal}
      >
        <div className={styles.createPostContainer}>
          <div className={styles.titleContainer}>
            <h2>Edit Post</h2>
            <img
              className={styles.x_svg}
              src={X_SVG}
              alt="exit"
              onClick={() => setShowModal(!showModal)}
            />
          </div>
        </div>

        <div className={styles.contentContainer}>
          {loading ? (
            <div className={styles.LoadingSpinner}>
              <LoadingSpinner />
            </div>
          ) : null}
          <div className={styles.inputContainer}>
            <textarea
              className={styles.input}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={`What's on your mind, ${currentUser.name}?`}
              // maxlength="1"
            ></textarea>
          </div>
          <div className={styles.postBtnContainer}>
            <button
              className={`${styles.editBtn} ${styles.btn}`}
              onClick={() => editPostOnClick()}
            >
              Edit
            </button>
            <button
              className={`${styles.deleteBtn} ${styles.btn}`}
              onClick={(e) => deletePostOnClick()}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditDeletePost;
