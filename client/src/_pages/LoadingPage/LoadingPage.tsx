import styles from "./LoadingPage.module.css";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  FC,
  SetStateAction,
  Dispatch,
} from "react";

const LoadingPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Loading</h1>
      </div>

      <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingPage;
