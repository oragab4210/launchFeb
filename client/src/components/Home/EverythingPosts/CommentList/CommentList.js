import styles from "./CommentList.module.css";
import React, { useState, useEffect } from "react";
import Comment from "../Comment/Comment";

const CommentList = ({ commentList, commentListOpen, setCommentListOpen }) => {
  const [listPagination, setListPagination] = useState(3);
  useEffect(() => {
    setListPagination(3);
  }, [commentListOpen]);

  const renderCommentsForPost = () => {
    // const paginatedPostList = commentList.slice(0, listPagination);

    const commentsForPost = commentList.map((comment, index) => {
      // console.log(comment);
      return (
        <div key={index}>
          <Comment comment={comment} />
        </div>
      );
    });
    const commentListEaliestFirst = commentsForPost.reverse();
    const paginatedPostList = commentListEaliestFirst.slice(0, listPagination);

    return paginatedPostList;
  };

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.commentListContainer}`}>
        {commentListOpen ? renderCommentsForPost() : null}
      </div>
      {commentList.length > listPagination && commentListOpen ? (
        <div
          className={styles.paginationBtn}
          onClick={() => setListPagination(listPagination + 3)}
        >
          View more comments
        </div>
      ) : null}
    </div>
  );
};

export default CommentList;
