import styles from "./LoginPage.module.css";
import React, { useState, useEffect, useRef } from "react";
import LogInForm from "../../components/Landing/LogInForm/LogInForm";
import { gsap } from "gsap";

const LoginPage = () => {
  let textContainer = useRef();
  let loginFormContainer = useRef();

  useEffect(() => {
    gsap.from(textContainer.current, { x: -200, opacity: 0, duration: 0.7 });
    gsap.from(loginFormContainer.current, {
      y: 200,
      opacity: 0,
      duration: 0.7,
    });
  });

  return (
    <div className={styles.container}>
      <div className={styles.textContainer} ref={textContainer}>
        <h1 className={styles.title}>facebook</h1>
        <p className={styles.paragraph}>
          Connect with friends and the world <br /> around you on Facebook.
        </p>
      </div>
      <div className={styles.LogInForm} ref={loginFormContainer}>
        <LogInForm />
      </div>
    </div>
  );
};

export default LoginPage;
