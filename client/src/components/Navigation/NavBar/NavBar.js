import styles from "./NavBar.module.css";
import React, { useState, useEffect, useRef } from "react";
import SideNav from "../SideNav/SideNav";

import { useQuery, useMutation } from "@apollo/client";
import { setCurrentUser } from "../../../redux/features/currentUserSlice";
import { setOnlineUsers } from "../../../redux/features/onlineUsersSlice";
import currentUserQuery from "../../../GQL/queries/CurrentUser";
import { setSocket } from "../../../redux/features/socketSlice";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { Link, useLocation } from "react-router-dom";
import mutation from "../../../GQL/mutations/Logout";
import ProfileDropdownInitiator from "../ProfileDropdownInitiator/ProfileDropdownInitiator";
import TestDropDown from "../TestDropDown/TestDropDown";
import socketIOClient from "socket.io-client";
const SOCKET_SERVER_URL = "http://localhost:4000";

const NavBar = () => {
  const { pathname } = useLocation();
  const dontShowUp = ["/", "/login"];
  const navShow = !dontShowUp.includes(pathname);
  let { loading, error, data, refetch } = useQuery(currentUserQuery);
  const currentUser = useAppSelector((state) => state.currentUser);
  const dispatch = useAppDispatch();
  const socketRef = useRef();

  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    refetch();
    if (data) {
      console.log(data.user2, "NavBar");
      dispatch(setCurrentUser(data.user2));
    }
  }, [data]);

  useEffect(() => {
    if (navShow && currentUser.id) {
      console.log("working");
      socketRef.current = socketIOClient(SOCKET_SERVER_URL);
      socketRef.current.emit("login", { userId: currentUser.id });
      socketRef.current.on("onlineUsers", (data) => {
        const onlineUsers = Object.entries(data);
        const onlineIds = Array.from(onlineUsers, (x) => x[1]);
        console.log(onlineIds);
        dispatch(setOnlineUsers(onlineIds));
      });
    }
  }, [currentUser, data, navShow]);

  /* -------------------------------------------------------------------------- */

  return (
    <div className={styles.container0}>
      <div className={styles.container}>
        <SideNav />
        <ProfileDropdownInitiator />
      </div>
      <div className={styles.container69}>
        <SideNav />
        <TestDropDown socketRef={socketRef} />
      </div>
    </div>
  );
};

export default NavBar;
