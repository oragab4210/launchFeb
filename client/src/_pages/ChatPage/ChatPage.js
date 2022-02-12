import styles from "./ChatPage.module.css";
import React, { useState, useEffect } from "react";
import ChatBox2 from "../../components/CHAT/ChatBox/ChatBox";
import RoomsList from "../../components/CHAT/RoomsList/RoomsList";

const ChatPage = () => {
  const [currentFriend, setCurrentFriend] = useState(null);
  const [chooseRoomPage, setChooseRoomPage] = useState(null);
  return (
    <div className={styles.container0}>
      <div className={styles.container1}>
        <div className={styles.container2}>
          <div
            className={`${styles.chatList} ${
              chooseRoomPage === true
                ? styles.listMoveIn
                : chooseRoomPage === false
                ? styles.listMoveOut
                : null
            }
            
           
            `}
          >
            <RoomsList
              chooseRoomPage={chooseRoomPage}
              setChooseRoomPage={setChooseRoomPage}
              setCurrentFriend={setCurrentFriend}
              currentFriend={currentFriend}
            />
          </div>
          <div
            className={`${styles.chatArea} ${
              chooseRoomPage === false
                ? styles.chatMoveIn
                : chooseRoomPage === true
                ? styles.chatMoveOut
                : null
            } `}
          >
            {/* {chooseRoomPage === false ? ( */}
            <ChatBox2
              chooseRoomPage={chooseRoomPage}
              currentFriend={currentFriend}
              setChooseRoomPage={setChooseRoomPage}
              setCurrentFriend={setCurrentFriend}
            />
            {/* ) : null} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
