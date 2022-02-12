import React from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";
// import history from "../../history";

export const Modal = ({ content, showModal, Open, setShowModal }) => {
  if (showModal) {
    return ReactDOM.createPortal(
      <div // background
        onClick={() => setShowModal(!showModal)}
        className={styles.modal_background}
      >
        <div // Modal
          onClick={(e) => e.stopPropagation()}
          className={styles.modal}
        >
          <React.Fragment>{content}</React.Fragment>
        </div>
      </div>,
      document.querySelector("#modal")
    );
  } else return <></>;
};
