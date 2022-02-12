import styles from "./LogInForm.module.css";
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import loginMutation from "../../../GQL/mutations/Login";
import CurrentUserQuery from "../../../GQL/queries/CurrentUser";
import history from "../../../utils/history";
import { Modal } from "./modal/modal";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [login] = useMutation(loginMutation);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    login({
      variables: { email: email, password: password },
      refetchQueries: [{ query: CurrentUserQuery }],
      awaitRefetchQueries: true,
    })
      .then((e) => [e ? history.push("/home") : null, setLoading(false)])
      .then((res) => [setEmail(""), setPassword("")])
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);
        setErrors(errors);
        console.log(errors);
      });
  };

  return (
    <div className={styles.container}>
      <Modal showModal={showModal} setShowModal={setShowModal} key={"2"} />
      <div className={styles.formContainer}>
        {loading ? (
          <div className={styles.LoadingSpinner}>
            <LoadingSpinner />
          </div>
        ) : null}

        <form action="" className={styles.form} onSubmit={onSubmit}>
          <input
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.btnContainer}>
            <button className={`${styles.button} ${styles.login}`}>
              Log In
            </button>
          </div>

          <hr className={styles.horizontalLine} />
        </form>

        <div className={styles.btnContainer}>
          <button
            onClick={() => setShowModal(!showModal)}
            className={`${styles.button} ${styles.createNewAccount}`}
          >
            Create new account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
