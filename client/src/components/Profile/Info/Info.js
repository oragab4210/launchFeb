import React, { useState, useEffect } from "react";
import styles from "./Info.module.css";
import { useMutation, useQuery } from "@apollo/client";
import mutation from "../../../GQL/mutations/editUser";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import query from "../../../GQL/queries/CurrentUser";
import { current } from "@reduxjs/toolkit";

// login({
//   variables: { email: email, password: password },
//   refetchQueries: [{ query: query }],
//   awaitRefetchQueries: true,
// })
//   .then((e) => (e ? history.push("/home") : null))
//   .catch((err) => {
//     const errors = err.graphQLErrors?.map((error) => error.message);
//     setErrors(errors);
//     console.log(errors);
//   });

const ProfileInfo = () => {
  const currentUser = useAppSelector((state) => state.currentUser);
  let { loading, error, data } = useQuery(query);
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  // const [password, setPassword] = useState(currentUser.password);
  const [ageText, setAgeText] = useState("");
  const [editActive, setEditActive] = useState("");
  // const [change, setChange] = useState(false);
  /* -------------------------------------------------------------------------- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  /* -------------------------------------------------------------------------- */
  const [editUser] = useMutation(mutation);
  useEffect(() => {
    if (data) {
      const { user2 } = data;

      user2.name === null ? setName("") : setName(user2.name);
      // user2.name === null ? setNameText("") : setNameText(user2.name);
      user2.email === null ? setEmail("") : setEmail(user2.email);
      // setEmail(user2.email);
      // user2.email === null ? setEmailText("") : setEmailText(user2.email);
      user2.age === null ? setAge(0) : setAge(user2.age);
      // user2.age === null ? setAgeText(0) : setAgeText(user2.age);
      console.log(nameText);
      console.log(emailText);
      console.log(ageText);
    }
  }, [loading, data, editActive]);

  /* -------------------------------------------------------------------------- */
  const onSubmit = (e) => {
    e.preventDefault();

    const variables = () => {
      if (emailText.length >= 1) {
        return { id: data.user2.id, email: emailText };
      } else if (ageText >= 1) {
        return { id: data.user2.id, age: ageText };
      } else if (nameText.length > 0) {
        return { id: data.user2.id, name: nameText };
      }
    };

    editUser({
      variables: variables(),
      refetchQueries: [{ query: query }],
      awaitRefetchQueries: true,
    })
      .then((res) => [console.log("INFO", data), setEditActive(null)])
      .then((res) => [setAgeText(""), setEmailText(""), setNameText("")])
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);

        console.log(errors);
      });
  };
  /* -------------------------------------------------------------------------- */

  const renderInfoItems = () => {
    const infoItems2 = [
      {
        Name: "Name",
        name: name,
        setName: setName,
        nametext: nameText,
        setNameText: setNameText,
      },
      {
        Email: "Email",
        email: email,
        setEmail: setEmail,
        emailText: emailText,
        setEmailText: setEmailText,
      },
      {
        Age: "Age",
        age: age,
        setAge: setAge,
        agetext: ageText,
        setAgeText: setAgeText,
      },
    ];
    const onTextChange = (e, item) => {
      if (typeof Object.values(item)[1] === typeof 1) {
        Object.values(item)[2](Number(e.target.value));
        Object.values(item)[4](Number(e.target.value));
        console.log(nameText);
        console.log(ageText);
      } else {
        Object.values(item)[2](e.target.value);
        Object.values(item)[4](e.target.value);
        console.log(nameText);
        console.log(ageText);
      }
    };

    return infoItems2.map((item, index) => {
      return (
        <div key={index}>
          <div className={styles.infoTopics}>
            <div className={styles.infoEdit}>
              <div>
                {editActive === index ? (
                  <form onSubmit={onSubmit} className={styles.form}>
                    <h1>{Object.values(item)[0]}:</h1>
                    <input
                      placeholder={Object.values(item)[1]}
                      className={styles.input}
                      value={Object.values(item)[3]}
                      onChange={(e) => onTextChange(e, item)}
                    />
                    <div className={styles.inputBtnContainer}>
                      <button className={styles.checkBtn}>&#10003;</button>
                      <button
                        className={styles.xBtn}
                        onClick={() => setEditActive("")}
                      >
                        X
                      </button>
                    </div>
                  </form>
                ) : (
                  <h1>
                    {Object.values(item)[0]}: {Object.values(item)[1]}
                  </h1>
                )}
              </div>
              <button
                className={styles.editBtn}
                onClick={() => setEditActive(index)}
              >
                Edit
              </button>
            </div>
          </div>
          {index !== infoItems2.length - 1 ? (
            <div className={styles.line}></div>
          ) : null}
        </div>
      );
    });
  };
  /* -------------------------------------------------------------------------- */
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Info</h1>
      </div>
      <div className={styles.line}></div>
      {data ? renderInfoItems() : null}
    </div>
  );
};

export default ProfileInfo;
