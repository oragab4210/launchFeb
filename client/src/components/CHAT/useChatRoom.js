import React, { useEffect, useRef, useState, useCallback } from "react";
import socketIOClient from "socket.io-client";
import { sha256, sha224 } from "js-sha256";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { useQuery, useMutation } from "@apollo/client";
import useMessages from "./useMessages";

const NEW_MESSAGE_EVENT = "newMessage";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChatRoom = () => {
  const previousMessages = useAppSelector(
    (state) => state.previousMessages.value
  );
  const { addMessage } = useMessages();
  const room = useAppSelector((state) => state.currentRoom.value);

  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const [hashRoom, setHashRoom] = useState("");
  const socketRef = useRef();
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (previousMessages) {
      setMessages(previousMessages);
    }
  }, [previousMessages]);

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    setHashRoom(room);
  }, [room, hashRoom]);
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    if (hashRoom !== undefined) {
      socketRef.current.emit("setRoom", hashRoom);
    }

    socketRef.current.on(NEW_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        isOwner: message.senderId === socketRef.current.id,
      };

      // send the new message to the others in the same room.
      setMessages((messages) => [...messages, incomingMessage]);
    });
    return () => {
      socketRef.current.disconnect(hashRoom);
    };
  }, [hashRoom]);
  /* -------------------------------------------------------------------------- */
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      room: room,
    });

    addMessage(room, messageBody);
  };
  /* -------------------------------------------------------------------------- */
  const combineAddresses = (address1, address2) => {
    const user1 = [];
    const user2 = [];
    const makeUnique = (address, userArray) => {
      for (let i in address) {
        const letter = address[i];

        userArray.push(letter);
      }
    };
    makeUnique(address1, user1);
    makeUnique(address2, user2);
    user1.push(...user2);
    const combinedAddresses = user1;

    const sorted = combinedAddresses.sort();
    const room = sorted.join("");

    const hash = sha256.create();
    hash.update(room);
    const hashedRoom = hash.hex();

    return hashedRoom;
  };
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  return {
    messages,
    sendMessage,
    combineAddresses,
    conversationId,
    setConversationId,
  };
};

export default useChatRoom;
