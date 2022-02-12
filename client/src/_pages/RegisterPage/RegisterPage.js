import styles from "./RegisterPage.module.css";
import React, { useState, useEffect } from "react";
import RegisterForm from "../../components/Landing/RegisterForm/RegisterForm";

const RegisterPage = () => {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
