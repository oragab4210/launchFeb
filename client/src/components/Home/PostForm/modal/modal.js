import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";
import { gsap } from "gsap";
// import history from "../../history";

export const Modal = ({ content, showModal, Open, setShowModal, children }) => {
  const [fixAnimation, setFixAnimation] = useState(false);
  let modal = useRef();
  useEffect(() => {
    setFixAnimation(true);
    if (showModal) {
      gsap.from(modal.current, { y: 140, opacity: 0, duration: 0.5 });
    } else {
      setFixAnimation(false);
    }
  }, [showModal]);
  if (showModal) {
    return ReactDOM.createPortal(
      <div // background
        onClick={() => setShowModal(!showModal)}
        className={styles.modal_background}
      >
        {/* -------------------------------------------------------------------------- */}
        <div // Modal
          onClick={(e) => e.stopPropagation()}
          className={`${styles.modal} ${!fixAnimation ? styles.hide : null}`}
          ref={modal}
        >
          {children}
        </div>
        {/* -------------------------------------------------------------------------- */}
      </div>,
      document.querySelector("#modal")
    );
  } else return <></>;
};
