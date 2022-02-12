import styles from "./LoadingSpinner.module.css";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const LoadingSpinner = () => {
  let spinner = useRef();
  const [fixAnimation, setFixAnimation] = useState(false);

  useEffect(() => {
    setFixAnimation(true);
    gsap.from(spinner.current, { scale: 0, duration: 0.4 });
    // gsap.from(spinner.current, { opacity: 0, scale: 0, duration: 1 });
    setFixAnimation(false);
  }, []);

  return (
    <div className={styles.container} ref={spinner}>
      <div
        className={styles.loader}
        // className={`${styles.loader} ${!fixAnimation ? styles.hide : null}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
