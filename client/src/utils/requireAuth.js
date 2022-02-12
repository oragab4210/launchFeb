import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import getCurrentUser from "../GQL/queries/CurrentUser";
import LoginPage from "../_pages/LoginPage/LoginPage";
// import history from "./history";
import { Link, useLocation } from "react-router-dom";
import LoadingPage from "../_pages/LoadingPage/LoadingPage";

const RequireAuth = (WrappedComponent) => {
  const CheckAuth = (props) => {
    const { pathname } = useLocation();
    const { loading, error, data } = useQuery(getCurrentUser);

    useEffect(() => {
      if (!loading && !data.user2) {
        props.history.push("/login");
      }
    }, [data]);

    if (data?.user2) {
      // props.history.push(pathname.p);
      return <WrappedComponent {...props} />;
    } else {
      // props.history.push("/login");
      return <LoadingPage />;
    }
  };
  return CheckAuth;
};

export default RequireAuth;
