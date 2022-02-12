import styles from "./EditDeleteComment.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./modal/modal";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import X_SVG from "./x.svg";
import { useMutation, useQuery } from "@apollo/client";
import editCommentMutation from "../../../../GQL/mutations/editComment";
import deleteCommentMutation from "../../../../GQL/mutations/deleteComment";
import currentUserQuery from "../../../../GQL/queries/CurrentUser";
import editPostMutation from "../../../../GQL/mutations/editPost";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

const EditDeleteComment = ({ comment }) => {
  const [editComment] = useMutation(editCommentMutation);
  const [deleteComment] = useMutation(deleteCommentMutation);
  const [editPost] = useMutation(editPostMutation);
  // const { refetch } = useQuery(currentUserQuery);
  const currentUser = useAppSelector((state) => state.currentUser);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState(comment.comment);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setCommentText(comment.comment);
  }, [comment]);

  const editCommentOnClick = () => {
    setLoading(true);
    editComment({
      variables: {
        id: comment.id,
        comment: commentText,
      },
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    })
      .then((res) => [setShowModal(false), setLoading(false)])
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);
        console.log(errors);
      });
  };
  const deleteCommentOnClick = (e) => {
    setLoading(true);
    console.log("start");
    /* ----------------------------- delete comment ----------------------------- */
    deleteComment({
      variables: {
        id: comment.id,
      },
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    })
      /* -----------------------------Delete Comment from Post--------------------------------------------- */
      .then((res) =>
        editPost({
          variables: {
            id: comment.postId,
            deleteComment: comment.id,
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
            <h2>Edit Comment</h2>
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
              // onChange={(e) => setPostText(e.target.value)}
              className={styles.input}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`What's on your mind, ${currentUser.name}?`}
              // maxlength="1"
            ></textarea>
          </div>
          <div className={styles.postBtnContainer}>
            <button
              className={`${styles.editBtn} ${styles.btn}`}
              onClick={() => editCommentOnClick()}
            >
              Edit
            </button>
            <button
              className={`${styles.deleteBtn} ${styles.btn}`}
              onClick={(e) => deleteCommentOnClick()}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditDeleteComment;
