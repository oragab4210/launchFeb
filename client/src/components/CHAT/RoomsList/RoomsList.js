import React, { useState, useEffect } from "react";
import styles from "./RoomList.module.css";
import useChatRoom from "../useChatRoom";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setRoom } from "../../../redux/features/roomSlice";
import useMessages from "../useMessages";
import FadeIn from "react-fade-in";

const RoomsList = ({
  currentFriend,
  setCurrentFriend,
  chooseRoomPage,
  setChooseRoomPage,
}) => {
  const currentUser = useAppSelector((state) => state.currentUser);
  const onlineUsers = useAppSelector((state) => state.onlineUsers.value);
  const [activeConversations, setActiveConversations] = useState([]);
  const [roomChange, setRoomChange] = useState(false);
  const { getCurrentFriendMessages, selectedFriend, setSelectedFriend } =
    useMessages();
  /* -------------------------------------------------------------------------- */
  const room = useAppSelector((state) => state.currentRoom.value);

  /* -------------------------------------------------------------------------- */
  const dispatch = useAppDispatch();
  const { combineAddresses, setConversationId } = useChatRoom(room);
  /* -------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (currentUser) {
      setActiveConversations(currentUser.conversations);
    }
    if (selectedFriend) {
      getCurrentFriendMessages();
    }
  }, [currentUser]);

  /* -------------------------------------------------------------------------- */
  const setRoom_setConvoId_getMessages = (personId, index) => {
    const hash = combineAddresses(currentUser.id, personId);
    console.log(hash);
    return [
      dispatch(setRoom(hash)),
      console.log(hash),
      setSelectedFriend(index),
      setConversationId(hash),
      getCurrentFriendMessages(),
    ];
  };

  const renderRooms = () => {
    return activeConversations.map((person, index) => {
      return (
        <div
          className={`${styles.room} ${
            selectedFriend === index ? styles.selectedRoom : null
          }`}
          onClick={() => [
            setChooseRoomPage(false),
            setRoom_setConvoId_getMessages(person.id, index),
            /* ----------------------------- change to name ----------------------------- */
            setCurrentFriend(person),
            /* -------------------------------------------------------------------------- */
            setRoomChange(!roomChange),
          ]}
          key={index}
        >
          <div className={styles.profilePicNameContainer}>
            <div className={styles.roomProfilePicContainer}>
              {person.profilePic ? (
                <img
                  className={styles.roomProfilePic}
                  src={person.profilePic}
                  alt=""
                />
              ) : (
                <img
                  className={styles.roomProfilePic}
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
                  alt=""
                />
              )}
            </div>
            {onlineUsers.includes(person.id) ? (
              <div className={styles.online}></div>
            ) : (
              <div className={styles.offline}></div>
            )}
            <h1>{person.email}</h1>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2 style={{ marginBottom: "0px", marginTop: "0px" }}>Join Room</h2>
      </div>

      <div className={styles.roomListContainer}>
        {/* ------------------------ add message if not chats ------------------------ */}
        {activeConversations.length > 0 ? (
          <FadeIn>{renderRooms()}</FadeIn>
        ) : null}
      </div>
    </div>
  );
};

export default RoomsList;
