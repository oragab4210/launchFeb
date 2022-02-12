import styles from "./TestDropDown.module.css";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  FC,
  SetStateAction,
  Dispatch,
} from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setCurrentUser } from "../../../redux/features/currentUserSlice";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import currentUserQuery from "../../../GQL/queries/CurrentUser";
import mutation from "../../../GQL/mutations/Logout";
import profile from "./profile.png";

const TestDropDown = ({ socketRef, socketIdFromNav }) => {
  let { loading, error, data, refetch } = useQuery(currentUserQuery);
  let [logout] = useMutation(mutation);
  const currentUser = useAppSelector((state) => state.currentUser);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);
  const dispatch = useAppDispatch();
  // const socketRef = useRef();

  // useEffect(() => {
  //   if (open) {
  //   }
  // }, [pathname]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const wrapperRef = useRef(null);

  const onLogoutCLick = () => {
    // socketRef.current.emit("logout", { socketId: socketIdFromNav });
    // socketRef.current.disconnect(true);

    logout({
      refetchQueries: [{ query: currentUserQuery }],
      awaitRefetchQueries: true,
    })
      .then(socketRef.current.emit("refetchOnlineUsers", {}))
      .then(socketRef.current.disconnect(true))
      .then(dispatch(setCurrentUser({})))

      .catch((err) => console.log(err));
  };
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpen(false);
      // setClose(true);
    }
  };
  // console.log(socketRef);

  return (
    <div
      className={styles.container}
      ref={wrapperRef}
      onMouseLeave={() => [setOpen(false), setClose(true)]}
    >
      <div className={styles.profilePicContainer}>
        <img
          src={profile}
          alt=""
          className={styles.profilePic}
          onMouseOver={() => setOpen(true)}
          // onMouseLeave={() => setOpen(false)}
        />
      </div>
      {/* -------------------------------------------------------------------------- */}

      <div
        // onMouseLeave={() => setOpen(false)}
        className={`${styles.profileDropdownContainer} ${
          open
            ? // && currentPath === pathname
              styles.active
            : close
            ? styles.deactivated
            : // && styles.active
              null
        }  `}
      >
        <div className={`${styles.profileDropdownContainer1}`}>
          <ul
            className={`${styles.profileDropdownList} ${
              open ? styles.active : null
            }`}
          >
            <li onClick={() => [setOpen(false), setClose(true)]}>
              <Link
                to="/profile"
                className={`${styles.option} ${open ? styles.active : null}`}
              >
                Profile
              </Link>
            </li>
            <li
              onClick={() => [onLogoutCLick(), setOpen(false), setClose(true)]}
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
      </div>
    </div>
  );
};

export default TestDropDown;
