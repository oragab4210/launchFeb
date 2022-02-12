import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import getUsers from "../../../GQL/queries/getUsers";
import styles from "./AddFriends.module.css";
import mutation from "../../../GQL/mutations/editUser";
import currentUserQuery from "../../../GQL/queries/CurrentUser";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";

const AddFriends = ({ setFriendListOpen, friendListOpen }) => {
  const currentUser = useAppSelector((state) => state.currentUser);
  let { loading, error, data, refetch } = useQuery(getUsers);
  const [editUser] = useMutation(mutation);
  const [friends, setFriends] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    refetch();
  }, []);

  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    currentUser.friends.map((friend, index) => {
      if (friend.id) {
        setFriends([...friends, friend.id]);
      }
      return null;
    });
  }, [currentUser]);

  const addFriend = async (friendId) => {
    const friendIdList = [];

    currentUser.friends.map((friend, index) => {
      if (friend.id) {
        friendIdList.push(friend.id);
      }
      return null;
    });

    console.log(currentUser.friends);
    const friend = friendIdList.includes(friendId);
    const me = friendIdList.includes(currentUser.id);
    console.log("friend", friend);
    console.log("me", me);
    console.log(currentUser.friends.id);
    if (friends) {
      if (friend) {
        console.log("HELLLOOOOO");
        console.log("already a friend");
        return false;
      } else {
        editUser({
          variables: {
            id: currentUser.id,
            addFriend: friendId,
          },
          refetchQueries: [{ query: currentUserQuery }],
          awaitRefetchQueries: true,
        }).catch((err) => {
          const errors = err.graphQLErrors?.map((error) => error.message);

          console.log(errors);
        });
      }
    }
  };

  const renderAvaliableUsers = () => {
    console.log("USERS", data.users);
    const noCurrentUserArray = data.users.filter(
      (user) => user.id !== currentUser.id
    );

    /* -------------------------------------------------------------------------- */
    // const noCurrentUserArray1 = noCurrentUserArray.filter(
    //   (user) => user.id !== currentUser.id
    // );
    const arrayOfFriendIds = Array.from(currentUser.friends, (x) => x.id);

    // const hi = noCurrentUserArray.find((item) => item.id === currentUser.id);
    // console.log("ffff", hi);
    /* -------------------------------------------------------------------------- */

    // const filteredUser = finalArray.filter((user) =>
    //   user.email.startswith(searchBarText)
    // );
    const avaliableUsers = noCurrentUserArray.map((user, index) => {
      // if (user.email.startswith(searchBarText)) {
      if (user.email.startsWith(searchBarText)) {
        return (
          <div key={index}>
            <div className={styles.userCard}>
              <div className={styles.nameEmailContainer}>
                {user.profilePic ? (
                  <img
                    className={styles.userProfilePic}
                    src={user.profilePic}
                    alt=""
                  />
                ) : (
                  <img
                    className={styles.userProfilePic}
                    src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
                    alt=""
                  />
                )}
                <h2 className={styles.name}>{user.name}</h2>
                <h4 className={styles.email}>{user.email}</h4>
              </div>
              <div className={styles.buttonContainer}>
                <div className={styles.addFriendButton0}>
                  {!arrayOfFriendIds.includes(user.id) ? (
                    <button
                      onClick={() => addFriend(user.id)}
                      className={styles.addFriendButton}
                    >
                      Add Friend
                    </button>
                  ) : (
                    <button
                      // onClick={() => addFriend(user.id)}
                      className={styles.addedFriendButton}
                    >
                      Added &#10003;
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
    return avaliableUsers;
  };
  return (
    <div className={styles.container}>
      {/* -------------------------------------------------------------------------- */}
      <div className={styles.seachContainer}>
        <div
          className={styles.backArrowContainer}
          onClick={() => setFriendListOpen(true)}
        >
          <p>Find Friends</p>
          <span className={styles.backArrow}> &#x21A9; </span>
        </div>
        <h3>Search Users</h3>
        <input
          type="text"
          value={searchBarText}
          onChange={(e) => setSearchBarText(e.target.value)}
        />
      </div>
      {/* -------------------------------------------------------------------------- */}
      <div className={styles.cardsListContainer}>
        <div className={styles.paddingBottomWorkingPlaceHolder}>
          <div className={styles.cardsListContainerCenter}>
            {data ? renderAvaliableUsers() : null}
          </div>
        </div>
      </div>
      {/* -------------------------------------------------------------------------- */}
    </div>
  );
};

export default AddFriends;
