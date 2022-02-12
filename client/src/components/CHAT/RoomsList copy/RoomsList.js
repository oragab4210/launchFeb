import React, { useState, useEffect } from "react";
import styles from "./RoomList.module.css";
import useChatRoom from "../useChatRoom";
import useEchat from "../useEChat/useEchat";
import web3 from "../../../ethereum/Work/web3";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setRoom } from "../../../redux/features/roomSlice";
import query from "../../../GQL/queries/CurrentUser";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import useMessages from "../useMessages";

const RoomsList = () => {
  // const [selectedRoom, setSelectedRoom] = useState(null);
  let { loading, error, data } = useQuery(query);
  const [activeConversations, setActiveConversations] = useState([]);
  const {
    messageList,
    addMessage,
    user,
    getCurrentFriendMessages,
    selectedFriend,
    setSelectedFriend,
  } = useMessages();

  /* -------------------------------------------------------------------------- */
  const room = useAppSelector((state) => state.currentRoom.value);
  const userAccounts = useAppSelector((state) => state.userAddresses.value);
  const dispatch = useAppDispatch();
  const {
    messages,
    sendMessage,
    room2,
    setRoom2,
    combineAddresses,
    conversationId,
    setConversationId,
  } = useChatRoom(room);
  const [currentRoom, setCurrentRoom] = useState(room);
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (data) {
      const user = data.user2;
      console.log(user);
      // console.log("YYYY", data.user2.friends);
      setActiveConversations(user.conversations);
    }
    // if (selectedFriend) {
    //   getCurrentFriendMessages();
    // }
  }, [data]);

  /* -------------------------------------------------------------------------- */
  const doStuffOnRoomClick = (personId, index) => {
    const hash = combineAddresses(user.id, personId);
    return [
      dispatch(setRoom(hash)),
      console.log(hash),
      setSelectedFriend(index),
      setConversationId(hash),
      getCurrentFriendMessages({
        variables: {
          convoId: hash,
        },
      }),
    ];
  };
  //hmmm
  const renderRooms = () => {
    return activeConversations.map((person, index) => {
      return (
        <div
          className={
            selectedFriend === index ? styles.selectedRoom : styles.room
          }
          onClick={() => doStuffOnRoomClick(person.id, index)}
          key={index}
        >
          <h1>{person.email}</h1>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2 style={{ marginBottom: "0px", marginTop: "0px" }}>Join Room</h2>
      </div>

      <div className={styles.roomList}>
        {activeConversations.length > 0 ? renderRooms() : null}
      </div>
    </div>
  );
};

export default RoomsList;
