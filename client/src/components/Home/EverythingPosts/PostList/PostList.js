import styles from "./PostList.module.css";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Post from "../Post/Post";
import currentUserQuery from "../../../../GQL/queries/CurrentUser";
import FadeIn from "react-fade-in";

const PostList = () => {
  let { loading, error, data, refetch } = useQuery(currentUserQuery);
  const currentUser = useAppSelector((state) => state.currentUser);
  const [friendList, setFriendList] = useState("");
  const [postList, setPostList] = useState([]);
  const [postListDone, setPostListDone] = useState([]);
  const [listPagination, setListPagination] = useState(10);

  useEffect(() => {
    refetch();
    if (currentUser.friends) {
      setFriendList(currentUser.friends);
    }
  }, [currentUser]);

  /* ------------------------- creating list of posts ------------------------- */
  useEffect(() => {
    if (friendList) {
      console.log("UMMMMM", currentUser.posts);
      const newList = friendList.map((friend, index) => {
        return friend.posts;
      });
      const finishedFriendList = newList.flat();
      const completeListOfMyPostsAndFriendPosts =
        currentUser.posts.concat(finishedFriendList);
      console.log(completeListOfMyPostsAndFriendPosts, "FINALLY??");
      setPostList(completeListOfMyPostsAndFriendPosts);
    }
  }, [friendList, currentUser]);

  /* -------------------------- sorting list of posts ------------------------- */
  useEffect(() => {
    if (postList.length > 0) {
      console.log(postList, "FINALLY22222");
      setPostListDone(postList.sort((a, b) => (a.time > b.time ? -1 : 1)));
    } else {
      console.log(postList, "FINALLY3333");
      setPostListDone([]);
    }
  }, [postList]);

  const renderPosts = () => {
    if (postListDone.length <= 0) return null;
    const paginatedPostList = postListDone.slice(0, listPagination);
    console.log("FUCK", paginatedPostList);
    return paginatedPostList.map((post, index) => {
      // console.log("post", post);
      const unformattedDate = new Date(parseInt(post.time));
      const date = unformattedDate.toString();
      return (
        <div key={index}>
          <Post
            name={post.userId.name}
            profilePic={post.userId.profilePic}
            date={date}
            postId={post.id}
            postContent={post.post}
            likeCount={post.likedBy.length}
            likeList={post.likedBy}
            commentCount={post.comments.length}
            commentList={post.comments}
          />
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.postListContainer}>
        <FadeIn>{renderPosts()}</FadeIn>
      </div>
      {postListDone.length > listPagination ? (
        <div
          className={styles.loadMoreContainer}
          onClick={() => setListPagination(listPagination + 5)}
        >
          Load More
        </div>
      ) : null}
    </div>
  );
};

export default PostList;
