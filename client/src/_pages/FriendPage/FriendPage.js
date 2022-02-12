import React, { useState, useEffect } from "react";
import styles from "./FriendPage.module.css";
import FriendList from "../../components/Friends/FriendList/FriendList";
import AddFriends from "../../components/Friends/AddFriends/AddFriends";

const FriendPage = () => {
  const [friendListOpen, setFriendListOpen] = useState(null);
  return (
    <div className={styles.container0}>
      <div className={styles.container1}>
        <div className={styles.container2}>
          <div
            className={`${styles.FriendList} ${
              friendListOpen === true
                ? styles.listMoveIn
                : friendListOpen === false
                ? styles.listMoveOut
                : null
            }
            
           
            `}
          >
            <FriendList
              friendListOpen={friendListOpen}
              setFriendListOpen={setFriendListOpen}
            />
          </div>

          <div
            className={`${styles.AddFriends} ${
              friendListOpen === false
                ? styles.chatMoveIn
                : friendListOpen === true
                ? styles.chatMoveOut
                : null
            } `}
          >
            <AddFriends
              friendListOpen={friendListOpen}
              setFriendListOpen={setFriendListOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendPage;
