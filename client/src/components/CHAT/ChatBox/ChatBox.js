import styles from "./ChatBox.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import useChatRoom from "../useChatRoom";
import useMessages from "../useMessages";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";

const ChatBox = ({ currentFriend, chooseRoomPage, setChooseRoomPage }) => {
  const messageRef = useRef();
  const { messageList, addMessage, setConvoId } = useMessages();
  const { messages, sendMessage } = useChatRoom(messageList);
  const [newMessage, setNewMessage] = useState("");
  const [finalMessageList, setFinalMessageList] = useState(null);
  const room = useAppSelector((state) => state.currentRoom.value);
  const [firsTimeInChat, setFirstTimeInChat] = useState(false);
  const onlineUsers = useAppSelector((state) => state.onlineUsers.value);
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (chooseRoomPage === true) setFirstTimeInChat(false);
    console.log("room", chooseRoomPage);
  }, [chooseRoomPage]);

  useEffect(() => {
    const scroll = async () => {
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      if (chooseRoomPage === false && firsTimeInChat === false) {
        await delay(400);
        messageRef.current?.scrollIntoView({ behavior: "auto" });
        setFirstTimeInChat(true);
      } else {
        if (chooseRoomPage === false) {
          messageRef.current?.scrollIntoView({ behavior: "instant" });
        }
      }
    };
    scroll();
  });
  /* -------------------------------------------------------------------------- */
  const renderMessages = () => {
    // ref={messageRef}
    const listLength = messages.length;
    return messages.map((msg, index) => {
      if (index === listLength - 1) {
        return (
          <p
            key={index}
            ref={messageRef}
            className={`${msg.isOwner ? styles.blue : styles.red}
              ${styles.msg}`}
          >
            {msg.body}
          </p>
        );
      }
      return (
        <p
          key={index}
          className={`${msg.isOwner ? styles.blue : styles.red} 
          ${styles.msg}`}
        >
          {msg.body}
        </p>
      );
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (newMessage !== "") {
      sendMessage(newMessage);
    }
    // addMessage()
    setNewMessage("");
  };
  /* -------------------------------------------------------------------------- */
  return (
    <div className={styles.container}>
      <div className={styles.friendNameContainer}>
        <div
          className={styles.backContainer}
          onClick={() => setChooseRoomPage(!chooseRoomPage)}
        >
          <span className={styles.backArrow}>
            <p> Rooms </p> <span>&#x21A9;</span>
          </span>
        </div>

        {currentFriend ? <h1>{currentFriend.email}</h1> : null}

        {currentFriend ? (
          onlineUsers.includes(currentFriend.id) ? (
            <div className={styles.online}></div>
          ) : (
            <div className={styles.offline}></div>
          )
        ) : null}
      </div>
      <div className={styles.messageContainer}>
        {room === "" ? (
          <div className={styles.noRoomMessageContainer}>
            Please Select a <br /> Room To Join
          </div>
        ) : (
          <div>
            <div className={styles.messageList}>
              {/* messages here */}
              {renderMessages()}
              {/* <div ref={messageRef}>{}</div> */}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
      </div>
      <div className={styles.inputBtnContainer}>
        <form action="" onSubmit={onSubmit}>
          <input
            type="text"
            name=""
            id=""
            placeholder="Start Chatting"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
