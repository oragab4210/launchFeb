import styles from "./SideBar.module.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const routesToShowUpIn = ["/home", "/chat", "/friends", "/profile"];
  const includedPath = routesToShowUpIn.includes(pathname);

  if (includedPath) {
    return (
      <div className={styles.container}>
        <ul className={styles.optionList}>
          <li>
            <Link to="/home" className={styles.option}>
              <img
                src="https://www.freepnglogos.com/uploads/logo-home-png/chimney-home-icon-transparent-1.png"
                alt=""
                className={styles.image}
              />
              Home
            </Link>
          </li>
          <li>
            <Link to="/chat" className={styles.option}>
              <img
                src="https://image.flaticon.com/icons/png/512/61/61592.png"
                alt=""
                className={styles.image}
              />
              Chat
            </Link>
          </li>
          <li>
            <Link to="/friends" className={styles.option}>
              <img
                style={{ width: "45%" }}
                src="https://icon-library.com/images/friends-icon-transparent/friends-icon-transparent-1.jpg"
                alt=""
                className={styles.image}
              />
              Friends
            </Link>
          </li>
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

export default SideBar;
