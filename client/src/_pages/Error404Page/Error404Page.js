import styles from "./Error404Page.module.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import history from "../../utils/history";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

// .then((e) => (e ? history.push("/home") : null))

const Error404Page = () => {
  const { pathname } = useLocation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page Not Found</h1>
      <LoadingSpinner />
      {/* <button className={styles.btn} onClick={() => history.goBack()}>
        Return Home
      </button>
      {Object.keys(onlineUsers).length} */}
    </div>
  );
};

export default Error404Page;
