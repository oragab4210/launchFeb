import styles from "./SideNav.module.css";
import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";

const SideNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.container}>
      <div
        className={styles.hamburger}
        onClick={() => [setOpen(!open), console.log("side nav", open)]}
      >
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </div>
      <ul className={`${styles.optionList} ${open ? styles.open : null}`}>
        <SideBar />
      </ul>
    </div>
  );
};

export default SideNav;
