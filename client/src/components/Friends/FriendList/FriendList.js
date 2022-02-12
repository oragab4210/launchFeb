import React, { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import mutation from "../../../GQL/mutations/editUser";
import query from "../../../GQL/queries/CurrentUser";
import styles from "./FriendList.module.css";
import convoExists from "../../../GQL/queries/convoExists";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import useChatRoom from "../../CHAT/useChatRoom";
import addConversationMutation from "../../../GQL/mutations/addConversation";
import FadeIn from "react-fade-in";

const FriendList = ({ friendListOpen, setFriendListOpen }) => {
  const onlineUsers = useAppSelector((state) => state.onlineUsers.value);
  const currentUser = useAppSelector((state) => state.currentUser);
  const { combineAddresses } = useChatRoom();
  const [editUser] = useMutation(mutation);
  const [addConversation] = useMutation(addConversationMutation);
  let { loading, error, data } = useQuery(query);
  const room = useAppSelector((state) => state.currentRoom.value);
  const [hash, setHash] = useState(null);
  const [convoData, setConvoData] = useState(null);
  const [convoData2, setConvoData2] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendId, setFriendId] = useState("");
  const [clicked, setClicked] = useState(false);

  let [
    checkIfConvoExists,
    {
      loading: convoExistsLoading,
      error: convoExistsError,
      data: convoExistsData,
      refetch,
    },
  ] = useLazyQuery(convoExists, {
    fetchPolicy: "no-cache", // Used for first execution
    nextFetchPolicy: "no-cache", // Used for subsequent executions
    onCompleted: async () => setConvoData(convoExistsData),
  });

  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    setFriends(currentUser.friends);
    console.log("friends online", onlineUsers);
  });
  /* -------------------------------------------------------------------------- */

  const deleteFriend = (friendId) => {
    editUser({
      variables: {
        id: currentUser.id,
        deleteFriend: friendId,
      },
      refetchQueries: [{ query: query }],
      awaitRefetchQueries: true,
    })
      .then(
        editUser({
          variables: {
            id: currentUser.id,
            deleteConversation: friendId,
          },
          refetchQueries: [{ query: query }],
          awaitRefetchQueries: true,
        }).catch((err) => {
          const errors = err.graphQLErrors?.map((error) => error.message);

          console.log(errors);
        })
      )
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);

        console.log(errors);
      });
  };
  /* -------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------- */
  const addConvoToUser = (clickedFriendId) => {
    editUser({
      variables: {
        id: currentUser.id,
        addConversation: clickedFriendId,
      },
      refetchQueries: [{ query: query }],
      awaitRefetchQueries: true,
    }).catch((err) => {
      const errors = err.graphQLErrors?.map((error) => error.message);

      console.log(errors);
    });
  };
  /* -------------------------------------------------------------------------- */
  const startConversation = async (convoId, clickedFriendId) => {
    checkIfConvoExists({
      variables: {
        convoId: convoId,
      },
    });
    addConvoToUser(clickedFriendId);
    setHash(convoId);
    setClicked(!clicked);
    setFriendId(clickedFriendId);
  };

  useEffect(() => {
    if (convoExistsData && convoExistsLoading === false) {
      //convoData acts as the old data
      //so making sure only true if the NEW data is not the same as the OLD data
      if (convoExistsData !== convoData) {
        console.log("query", convoExistsData);
        if (convoExistsData.conversationExists !== null) {
          console.log("User Exists");

          setHash(null);
          setConvoData2(convoData);
        } else if (convoExistsData.conversationExists === null) {
          console.log("DNE");
          /* ------------------------ creating new conversation ----------------------- */
          addConversation({
            variables: {
              convoId: hash,
            },
            refetchQueries: [
              checkIfConvoExists({
                variables: {
                  convoId: hash,
                },
                fetchPolicy: "no-cache",
                nextFetchPolicy: "no-cache",
              }),
            ],

            awaitRefetchQueries: true,
          }).catch((err) => {
            const errors = err.graphQLErrors?.map((error) => error.message);

            console.log(errors);
          });
        }
      }
    }
  }, [clicked, convoExistsData !== undefined && convoExistsData]);
  /* -------------------------------------------------------------------------- */

  const renderFriends = () => {
    const converstationIds = Array.from(currentUser.conversations, (x) => x.id);
    console.log("FRIENDS FINAL", friends);
    if (friends) {
      return friends.map((friend, index) => {
        return (
          <div key={index} className={styles.friendContainer}>
            <div className={styles.nameEmailContainer}>
              {friend.profilePic ? (
                <img
                  className={styles.friendProfilePic}
                  src={friend.profilePic}
                  alt=""
                />
              ) : (
                <img
                  className={styles.friendProfilePic}
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
                  alt=""
                />
              )}
              <h3 className={styles.name}>{friend.email}</h3>
              {onlineUsers.includes(friend.id) ? (
                <div className={styles.online}></div>
              ) : (
                <div className={styles.offline}></div>
              )}
            </div>

            {/* <h1>{friend.id}</h1> */}
            <div className={styles.buttons}>
              {!converstationIds.includes(friend.id) ? (
                <button
                  className={styles.startChat}
                  onClick={() => [
                    // setHash(combineAddresses(user.id, index)),
                    startConversation(
                      combineAddresses(currentUser.id, friend.id),
                      friend.id
                    ),
                  ]}
                >
                  Start a Chat
                </button>
              ) : (
                <button
                  className={styles.chatStarted}
                  // onClick={() => [
                  //   // setHash(combineAddresses(user.id, index)),
                  //   startConversation(
                  //     combineAddresses(currentUser.id, friend.id),
                  //     friend.id
                  //   ),
                  // ]}
                >
                  Start a Chat
                </button>
              )}
              <button
                className={styles.delete}
                onClick={() => [deleteFriend(friend.id)]}
              >
                Delete
              </button>
            </div>
          </div>
        );
      });
    }
  };
  /* -------------------------------------------------------------------------- */
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div
          className={styles.backArrowContainer}
          onClick={() => setFriendListOpen(false)}
        >
          <p>Find Friends</p>
          <span className={styles.backArrow}> &#x21AA; </span>
        </div>

        <h3>Friends</h3>
      </div>
      <div className={styles.friendListContainer}>
        <div className={styles.friendListContainerCenter}>
          <FadeIn>{renderFriends()}</FadeIn>
        </div>
      </div>
    </div>
  );
};

export default FriendList;
