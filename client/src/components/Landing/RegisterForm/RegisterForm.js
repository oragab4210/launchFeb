import styles from "./RegisterForm.module.css";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";

import signUpMutation from "../../../GQL/mutations/Signup";
import CurrentUserQuery from "../../../GQL/queries/CurrentUser";
import history from "../../../utils/history";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const RegisterForm = ({ setShowModal, showModal }) => {
  const [errors, setErrors] = useState([]);
  const [signup] = useMutation(signUpMutation);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const firstAndLastNameCombined = `${firstName} ${lastName}`;
    setName(firstAndLastNameCombined);
    console.log(name);
  }, [firstName, lastName]);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    signup({
      variables: { name: name, email: email, password: password },
      refetchQueries: [{ query: CurrentUserQuery }],
      awaitRefetchQueries: true,
    })
      .then((e) => [e ? history.push("/home") : null, setLoading(false)])
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);
        setErrors(errors);
        console.log(errors);
      });
  };

  return (
    <div className={styles.formContainer}>
      <div
        onClick={() => setShowModal(!showModal)}
        className={styles.xContainer}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          className={styles.x}
          viewBox="0 0 24 24"
        >
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
        </svg>
      </div>
      <div className={styles.titleContainer}>
        <h1>Sign Up</h1>

        <p>It's quick and easy.</p>
        <hr className={styles.horizontalLine} />
      </div>

      <form action="" className={styles.form} onSubmit={(e) => onSubmit(e)}>
        {loading ? (
          <div className={styles.LoadingSpinner}>
            <LoadingSpinner />
          </div>
        ) : null}
        <div className={styles.sameLineInputContainer}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            className={styles.sameLineInput}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            className={styles.sameLineInput}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputItem}
        />

        <input
          placeholder="New Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputItem}
        />
        <div className={styles.btnContainer}>
          <button className={`${styles.button} ${styles.signUp}`}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
