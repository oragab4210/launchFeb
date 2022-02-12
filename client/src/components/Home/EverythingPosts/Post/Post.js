import styles from "./Post.module.css";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import MakeComment from "../MakeComment/MakeComment";
import editUserMutation from "../../../../GQL/mutations/editUser";
import Comment from "../Comment/Comment";
import currentUserQuery from "../../../../GQL/queries/CurrentUser";
import deletePostMutation from "../../../../GQL/mutations/deletePost";
import editPostMutation from "../../../../GQL/mutations/editPost";
import CommentList from "../CommentList/CommentList";
import EditDeletePost from "../EditDeletePost/EditDeletePost";

const Post = ({
  postId,
  name,
  profilePic,
  likeCount,
  likeList,
  commentCount,
  commentList,
  postContent,
  date,
}) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentListOpen, setCommentListOpen] = useState(false);
  const [editDeleteOpen, setEditDeleteOpen] = useState(false);
  const [userPostIds, setUserPostIds] = useState([]);
  const currentUser = useAppSelector((state) => state.currentUser);
  const [deletePost] = useMutation(deletePostMutation);
  const [editUser] = useMutation(editUserMutation);
  const [editPost] = useMutation(editPostMutation);

  useEffect(() => {
    if (currentUser) {
      const postIds = currentUser.posts.map((post) => {
        return post.id;
      });
      setUserPostIds(postIds);
    }
  }, [currentUser]);

  const onLikeClick = () => {
    const listOfLikeIds = likeList.map((likeId) => {
      return likeId.id;
    });
    console.log(listOfLikeIds);
    if (listOfLikeIds.includes(currentUser.id)) {
      editPost({
        variables: {
          id: postId,
          deleteLike: currentUser.id,
        },
        refetchQueries: [{ query: currentUserQuery }],
        awaitRefetchQueries: true,
      });
    } else {
      editPost({
        variables: {
          id: postId,
          addLike: currentUser.id,
        },
        refetchQueries: [{ query: currentUserQuery }],
        awaitRefetchQueries: true,
      });
    }
  };

  const onEditClick = () => {
    deletePost({
      variables: {
        id: currentUser.id,
      },
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    })
      .then((res) =>
        editUser({
          variables: {
            id: currentUser.id,
            deletePost: res.data.addPost.id,
          },
          refetchQueries: [{ query: currentUserQuery }],
          awaitRefetchQueries: true,
        }).catch((err) => {
          const errors = err.graphQLErrors?.map((error) => error.message);

          console.log(errors);
        })
      )
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);
        console.log(errors);
      });
  };

  const onDeleteClick = () => {
    deletePost({
      variables: {
        id: postId,
      },
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    })
      .then((res) =>
        editUser({
          variables: {
            id: currentUser.id,
            deletePost: postId,
          },
          refetchQueries: [{ query: currentUserQuery }],
          awaitRefetchQueries: true,
        }).catch((err) => {
          const errors = err.graphQLErrors?.map((error) => error.message);

          console.log(errors);
        })
      )
      .then(setEditDeleteOpen(!editDeleteOpen))
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);
        console.log(errors);
      });
  };

  return (
    <div className={styles.individualPost0}>
      <div className={styles.individualPost}>
        <div className={styles.name_edit_Container}>
          <div>
            <div className={styles.picNameContainer}>
              {profilePic ? (
                <img className={styles.profilePic} src={profilePic} alt="" />
              ) : (
                <img
                  className={styles.profilePic}
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
                  alt=""
                />
              )}

              <div className={styles.nameDateContainer}>
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.date}>
                  {((parseInt(date.slice(16, 18)) + 11) % 12) + 1}
                  {date.slice(18, 21)}
                  &nbsp;
                  {parseInt(date.slice(16, 18)) > 12 ? "PM" : "AM"}
                  {date.slice(24, 28)}
                  &nbsp;
                  {date.slice(0, 10)}
                  {date.slice(10, 15)}
                </div>
              </div>
            </div>
          </div>
          {userPostIds.includes(postId) ? (
            <div
              className={styles.editDots}
              onClick={() => setEditDeleteOpen(!editDeleteOpen)}
            >
              {/* ... */}
              <EditDeletePost postContent={postContent} postId={postId} />
            </div>
          ) : null}
        </div>
        <div className={styles.post_likes_and_commentCount_Container}>
          <h2 className={styles.post}>{postContent}</h2>
          <div className={styles.likeCommentCountContainer}>
            <div className={styles.likeCountContainer}>
              <img
                className={styles.likeHandImage}
                alt=""
                role="presentation"
                src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"
              />
              <p className={styles.postLikes}>{likeCount}</p>
            </div>

            <p
              className={styles.commentCount}
              onClick={() => setCommentListOpen(!commentListOpen)}
            >
              {commentCount} Comments
            </p>
          </div>
        </div>
        <hr className={styles.hr} />
        <div className={styles.like_comment_btn_container}>
          <div className={styles.likeBtn} onClick={() => onLikeClick()}>
            Like
          </div>
          <div
            className={styles.commentBtn}
            onClick={() => setCommentOpen(!commentOpen)}
          >
            Comment
          </div>
        </div>
        <hr className={styles.hr} />
        <MakeComment
          commentOpen={commentOpen}
          setCommentOpen={setCommentOpen}
          postId={postId}
        />
        <br />
        <CommentList
          commentList={commentList}
          commentListOpen={commentListOpen}
          setCommentListOpen={setCommentListOpen}
        />
      </div>
    </div>
  );
};

export default Post;
