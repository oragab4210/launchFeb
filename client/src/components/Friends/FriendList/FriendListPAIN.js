import React, { useState, useEffect, useCallback } from "react";
// import styles from "./Info.module.css";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import mutation from "../../../GQL/mutations/editUser";
// import { useAppSelector, useAppDispatch } from "../../";
import query from "../../../GQL/queries/CurrentUser";
import axios from "axios";
import styles from "./FriendList.module.css";
import convoExists from "../../../GQL/queries/convoExists";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import useChatRoom from "../../Chat/useChatRoom";
import addConversationMutation from "../../../GQL/mutations/addConversation";

const FriendList = () => {
  const { combineAddresses } = useChatRoom();
  const [user, setUser] = useState(null);
  const [editUser] = useMutation(mutation);
  const [addConversation] = useMutation(addConversationMutation);
  let { loading, error, data } = useQuery(query);
  const room = useAppSelector((state) => state.currentRoom.value);
  const [hash, setHash] = useState(null);
  const [convoData, setConvoData] = useState(null);
  const [convoData2, setConvoData2] = useState("");

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

  const [friends, setFriends] = useState([]);
  const [friendName, setFreindName] = useState("");
  const [friendId, setFriendId] = useState("");
  const [hi, setHi] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (data) {
      // setFriends([]);
      const user = data.user2;

      setUser(user);
      // console.log("zzzzz", user);
      // console.log(data.user2.friends, "hehe");
      // console.log(user.friends, "XXX");
      setFriends(user.friends);

      // console.log(friends, "HAHAHA");

      // setFriends(user.friends);
      // console.log(user);
    }
  }, [data]);

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  const deleteFriend = (friendId) => {
    editUser({
      variables: {
        id: user.id,
        deleteFriend: friendId,
      },
      refetchQueries: [{ query: query }],
      awaitRefetchQueries: true,
    }).catch((err) => {
      const errors = err.graphQLErrors?.map((error) => error.message);

      console.log(errors);
    });
  };
  /* -------------------------------------------------------------------------- */
  // const addFriend = (e) => {
  //   e.preventDefault();
  //   editUser({
  //     variables: {
  //       id: user.id,
  //       friend: { id: "617c3466c0d43a4636b754dc", name: "Ian" },
  //     },
  //     refetchQueries: [{ query: query }],
  //     awaitRefetchQueries: true,
  //   }).catch((err) => {
  //     const errors = err.graphQLErrors?.map((error) => error.message);

  //     console.log(errors);
  //     setFriends([]);
  //   });
  // };
  /* -------------------------------------------------------------------------- */
  const startConversation = async (convoId) => {
    checkIfConvoExists({
      variables: {
        convoId: convoId,
      },
    });
  };

  useEffect(() => {
    if (convoExistsData && convoExistsLoading === false) {
      //convoData acts as the old data
      //so making sure only true if the NEW data is not the same as the OLD data
      if (convoExistsData !== convoData) {
        console.log("query", convoExistsData);
        if (convoExistsData.conversationExists !== null) {
          console.log("User Exists");
          // await refetch({ convoId: hash });
          setHash(null);
          setConvoData2(convoData);
        } else if (convoExistsData.conversationExists === null) {
          console.log("DNE");
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
    if (friends) {
      // console.log(friends, "SUCKER");
      return friends.map((friend, index) => {
        return (
          <div key={index} className={styles.friend}>
            <h1>{friend.email}</h1>
            {/* <h1>{friend.id}</h1> */}
            <button
              onClick={() => [
                // setHash(combineAddresses(user.id, index)),
                startConversation(combineAddresses(user.id, friend.id)),
              ]}
            >
              Start a Chat
            </button>
            <button onClick={() => [deleteFriend(friend.id)]}>Delete</button>
          </div>
        );
      });
    }
  };
  /* -------------------------------------------------------------------------- */
  return (
    <div className={styles.container}>
      <form action="" className={styles.form}>
        <label htmlFor="">name</label>
        <input
          type="text"
          onChange={(e) => setFreindName(e.target.value)}
          value={friendName}
        />
        <br />
        <label htmlFor="">id</label>
        <input
          type="text"
          onChange={(e) => setFriendId(e.target.value)}
          value={friendId}
        />
        <br />
        <button>submit</button>
      </form>
      <h1>-------------------</h1>
      <div className={styles.friendContainer}>{renderFriends()}</div>
    </div>
  );
};

export default FriendList;
