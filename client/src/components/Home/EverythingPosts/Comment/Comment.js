import styles from "./Comment.module.css";
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import EditDeleteComment from "../EditDeleteComment/EditDeleteComment";
import editCommentMutation from "../../../../GQL/mutations/editComment";
import currentUserQuery from "../../../../GQL/queries/CurrentUser";
import { useMutation, useQuery } from "@apollo/client";

const Comment = ({ comment }) => {
  const currentUser = useAppSelector((state) => state.currentUser);
  const [editDeleteOpen, setEditDeleteOpen] = useState(false);
  const [userCommentIds, setUserCommentIds] = useState([]);
  const [editCommentText, setEditCommentText] = useState(comment.comment);
  const [editComment] = useMutation(editCommentMutation);
  const [likeCount, setLikeCount] = useState(comment.likedBy.length);
  const [ableToLike, setAbleToLike] = useState(true);

  const onLikeClick = () => {
    const objectIntoArray = Object.assign([], comment.likedBy).flat();
    const listOfLikeIds = comment.likedBy.map((likeId) => {
      return likeId.id;
    });
    if (!ableToLike) return;
    console.log("list of lieks", listOfLikeIds);
    if (listOfLikeIds.includes(currentUser.id)) {
      const oneLess = objectIntoArray.slice(0, -1);
      console.log("ONE LESS", oneLess);
      setAbleToLike(false);
      editComment({
        variables: {
          id: comment.id,
          deleteLike: currentUser.id,
        },
        optimisticResponse: {
          editComment: {
            id: comment.id,
            __typename: "CommentType",
            likedBy: oneLess,
          },
        },
        refetchQueries: [{ query: currentUserQuery }],
        awaitRefetchQueries: true,
      }).then((res) => setAbleToLike(true));
    } else {
      const copyArray = objectIntoArray.slice();
      copyArray.push({ id: "+1" });
      const oneMore = copyArray;
      console.log("ONE More", oneMore);
      setAbleToLike(false);
      editComment({
        variables: {
          id: comment.id,
          addLike: currentUser.id,
        },
        optimisticResponse: {
          editComment: {
            id: comment.id,
            __typename: "CommentType",
            likedBy: oneMore,
            // Object.assign(comment.likedBy, payload)
          },
        },
        refetchQueries: [{ query: currentUserQuery }],
        awaitRefetchQueries: true,
      }).then((res) => setAbleToLike(true));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profilePic_and_CommentContainer}>
        <div className={styles.profilePicContainer}>
          {comment.userId.profilePic ? (
            <img
              src={comment.userId.profilePic}
              alt=""
              className={styles.profilePic}
            />
          ) : (
            <img
              src="https://static-cdn.jtvnw.net/jtv_user_pictures/81b9dc69-060b-4cef-977e-30e3cea96cbc-profile_image-300x300.png"
              alt=""
              className={styles.profilePic}
            />
          )}
        </div>
        <div className={styles.commentContainer}>
          <h3 className={styles.name}>{comment.userId.name}</h3>
          {/* <div> */}

          {/* {editDeleteOpen ? (
            <div className={styles.editDeleteContainer}>hi</div>
          ) : (
            <div className={styles.comment}>{comment.comment}</div>
          )} */}
          <div className={styles.comment}>{comment.comment}</div>

          {/* -------------------------------------------------------------------------- */}
          {currentUser.id === comment.userId.id ? (
            <div
              className={styles.editDots}
              onClick={() => setEditDeleteOpen(!editDeleteOpen)}
            >
              <EditDeleteComment comment={comment} />
            </div>
          ) : null}
          {/* -------------------------------------------------------------------------- */}
          <div
            className={styles.likeCountContainer}
            onClick={() => onLikeClick()}
          >
            <img
              className="j1lvzwm4"
              alt=""
              height="18"
              role="presentation"
              src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"
              width="18"
            />

            <div className={styles.likeCount}>{comment.likedBy.length}</div>
          </div>
          <button className={styles.likeBtn}>Like</button>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Comment;
