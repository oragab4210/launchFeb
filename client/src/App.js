import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { Router, Route, Switch, useLocation } from "react-router-dom";
import history from "./utils/history";
import RequireAuth from "./utils/requireAuth";
import NavBar from "./components/Navigation/NavBar/NavBar";

import SideNav from "./components/Navigation/SideNav/SideNav";
import HomePage from "./_pages/HomePage/HomePage";
import SideBar from "./components/Navigation/SideBar/SideBar";
import LoginPage from "./_pages/LoginPage/LoginPage";
import RegisterPage from "./_pages/RegisterPage/RegisterPage";
import ChatPage from "./_pages/ChatPage/ChatPage";
import Error404Page from "./_pages/Error404Page/Error404Page";
import ProfilePage from "./_pages/ProfilePage/ProfilePage";
import FriendPage from "./_pages/FriendPage/FriendPage";
import LoadingPage from "./_pages/LoadingPage/LoadingPage";

function App(props: any) {
  // const [currentRoute, setCurrentRoute] = useState(document.location.pathname);
  // const dontShowUp = ["/", "/login"];
  // useEffect(() => {
  //   console.log(currentRoute);
  // }, [currentRoute]);

  return (
    <div className={styles.App}>
      <Router history={history}>
        <NavBar />

        <div className={styles.SideBar}>{<SideBar />}</div>

        {/* ------------------------------- Full Pages ------------------------------- */}
        {/* <Switch> */}
        <Switch>
          <Route path="/home" exact component={RequireAuth(HomePage)} />

          <Route path="/chat" exact component={RequireAuth(ChatPage)} />
          <Route path="/profile" exact component={RequireAuth(ProfilePage)} />
          <Route path="/friends" exact component={RequireAuth(FriendPage)} />

          <Route path="/login" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />
          <Route path="/" exact component={LoginPage} />

          <Route component={Error404Page} />
        </Switch>

        {/* ------------------------------- Dynamic Pages ------------------------------- */}
        {/* </Switch> */}
      </Router>
    </div>
  );
}

export default App;
