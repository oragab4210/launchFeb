import styles from "./MakeComment.module.css";
import React, { useState, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { useMutation, useQuery } from "@apollo/client";
import editUserMutation from "../../../../GQL/mutations/editUser";
import editCommentMutation from "../../../../GQL/mutations/editComment";
import editPostMutation from "../../../../GQL/mutations/editPost";
import addCommentMutation from "../../../../GQL/mutations/addComment";
import currentUserQuery from "../../../../GQL/queries/CurrentUser";

const MakeComment = ({ commentOpen, setCommentOpen, postId }) => {
  const [commentText, setCommentText] = useState("");
  // const [editUser] = useMutation(editUserMutation);
  const [addComment] = useMutation(addCommentMutation);
  const [editPost] = useMutation(editPostMutation);
  const currentUser = useAppSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser.friends) {
      // console.log(postId);
      // console.log("current User", currentUser.friends);
    }
  }, [currentUser]);

  const onSubmit = (e) => {
    e.preventDefault();
    commentText.length > 0
      ? addComment({
          variables: {
            postId: postId,
            userId: currentUser.id,
            comment: commentText,
          },
          refetchQueries: [{ query: currentUserQuery }],
          awaitRefetchQueries: true,
        })
          .then((res) =>
            editPost({
              variables: {
                id: postId,
                addComment: res.data.addComment.id,
              },
              refetchQueries: [{ query: currentUserQuery }],
              awaitRefetchQueries: true,
            })
              .catch((err) => {
                const errors = err.graphQLErrors?.map((error) => error.message);

                console.log(errors);
              })
              .then([setCommentOpen(!commentOpen), setCommentText("")])
          )
          .catch((err) => {
            const errors = err.graphQLErrors?.map((error) => error.message);
            console.log(errors);
          })
      : console.log("need to have post greater than zero length");
  };

  if (commentOpen) {
    return (
      <div className={styles.container}>
        <form action="" className={styles.formContainer} onSubmit={onSubmit}>
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
          <textarea
            onChange={(e) => setCommentText(e.target.value)}
            className={styles.input}
            placeholder={`What's on your mind, ${currentUser.name}?`}
          ></textarea>
          <button className={styles.btn}>Submit</button>
        </form>
      </div>
    );
  } else {
    return null;
  }
};

export default MakeComment;
