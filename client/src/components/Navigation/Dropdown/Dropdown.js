import styles from "./Dropdown.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import mutation from "../../../GQL/mutations/Logout";
import { useQuery, useMutation } from "@apollo/client";
import currentUserQuery from "../../../GQL/queries/CurrentUser";

const Dropdown = ({
  open,
  setOpen,
  close,
  setClose,
  onDropDown,
  setOnDropDown,
}) => {
  let [logout] = useMutation(mutation);
  const onLogoutCLick = () => {
    logout({
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    }).catch((err) => console.log(err));
  };
  /* -------------------------------------------------------------------------- */
  return (
    <div
      onMouseOver={() => [setOpen(true), setClose(false)]}
      onMouseLeave={() => [
        setOpen(false),
        setClose(true),
        // setOnDropDown(false),
      ]}
      className={`${styles.profileDropdownContainer} ${
        open ? styles.active : close ? styles.deactivated : null
      }  `}
    >
      <ul
        className={`${styles.profileDropdownList} ${
          open ? styles.active : null
        }`}
      >
        <li
        // onClick={() => [setOpen(false), setClose(true)]}
        >
          <Link
            to="/profile"
            className={`${styles.option} ${open ? styles.active : null}`}
          >
            Profile
          </Link>
        </li>
        <li
        // onClick={() => [onLogoutCLick(), setOpen(false), setClose(true)]}
        >
          <Link
            to="/login"
            className={`${styles.option} ${open ? styles.active : null}`}
          >
            Log Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
