import styles from "./PostForm.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./modal/modal";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import X_SVG from "./x.svg";
import addPostMutation from "../../../GQL/mutations/addPost";
import editUserMutation from "../../../GQL/mutations/editUser";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import currentUserQuery from "../../../GQL/queries/CurrentUser";
import { gsap } from "gsap";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const PostForm = ({ showModal, setShowModal }) => {
  const [postText, setPostText] = useState("");
  const [addPost] = useMutation(addPostMutation);
  const [editUser] = useMutation(editUserMutation);
  const currentUser = useAppSelector((state) => state.currentUser);
  const [loading, setLoading] = useState(false);
  // let modal = useRef();

  // useEffect(() => {
  //   gsap.from(modal.current, { y: 180, opacity: 0, duration: 0.5 });
  //   // gsap.from(textContainer.current, { x: -140, opacity: 0, duration: 0.7 });
  //   // gsap.from(loginFormContainer.current, { x: 0, opacity: 0, duration: 1.6 });
  // }, [showModal]);
  useEffect(() => {
    if (currentUser.friends) {
    }
  }, [currentUser]);
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    postText.length > 0
      ? addPost({
          variables: {
            userId: currentUser.id,
            post: postText,
          },
          refetchQueries: [{ query: currentUserQuery }],
          awaitRefetchQueries: true,
        })
          .then((res) =>
            editUser({
              variables: {
                id: currentUser.id,
                addPost: res.data.addPost.id,
              },
              refetchQueries: [{ query: currentUserQuery }],
              awaitRefetchQueries: true,
            })
              .then((res) => [setLoading(false), setShowModal(!showModal)])
              .catch((err) => {
                const errors = err.graphQLErrors?.map((error) => error.message);

                console.log(errors);
              })
          )
          .catch((err) => {
            const errors = err.graphQLErrors?.map((error) => error.message);
            console.log(errors);
          })
      : console.log("need to have post greater than zero length");
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div
        className={styles.container}
        // ref={modal}
      >
        <div className={styles.createPostContainer}>
          <div className={styles.titleContainer}>
            <h2>Create Post</h2>
            <img
              className={styles.x_svg}
              src={X_SVG}
              alt="exit"
              onClick={() => setShowModal(!showModal)}
            />
          </div>
          <div className={styles.name_and_pic_Container}>
            {/* <p> pic and name here and maybe drop down of friends</p> */}
          </div>
        </div>

        <form action="" onSubmit={(e) => onSubmit(e)}>
          <div className={styles.contentContainer}>
            {loading ? (
              <div className={styles.LoadingSpinner}>
                <LoadingSpinner />
              </div>
            ) : null}
            <div className={styles.inputContainer}>
              <textarea
                onChange={(e) => setPostText(e.target.value)}
                className={styles.input}
                placeholder={`What's on your mind, ${currentUser.name}?`}
                // maxlength="1"
              ></textarea>
            </div>
            <div className={styles.postBtnContainer}>
              <button className={styles.postBtn}>Post</button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PostForm;
