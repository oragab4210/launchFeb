import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

import addConversationMutation from "../../GQL/mutations/addConversation";
import editMessageMutation from "../../GQL/mutations/editMessage";
import getMessagesQuery from "../../GQL/queries/getMessages";
import useChatRoom from "./useChatRoom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setPreviousMessages } from "../../redux/features/previousMessagesSlice";

const useMessages = () => {
  const currentUser = useAppSelector((state) => state.currentUser);
  const room = useAppSelector((state) => state.currentRoom.value);
  // let {
  //   loading: loadingMessages,
  //   error: errorMessages,
  //   data: dataMessages,
  //   refetch: refetchMessages,
  // } = useQuery(getMessagesQuery);
  // useEffect(() => {
  //   console.log(errorMessages);
  // }, [errorMessages]);

  const [messageList, setMessageList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [addConversation] = useMutation(addConversationMutation);
  const [editMessage] = useMutation(editMessageMutation);
  const dispatch = useAppDispatch();

  let [
    getCurrentFriendMessages,
    {
      loading: messagesLoading,
      error: messagesError,
      data: messagesData,
      networkStatus,
      called,
      refetch: messageRefetch,
    },
  ] = useLazyQuery(getMessagesQuery, {
    variables: { convoId: room },
  });

  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    getCurrentFriendMessages();
  }, [messageList]);
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!messagesError && messagesData) {
      dispatch(setPreviousMessages([]));
      if (messagesData.messages[0] !== undefined) {
        console.log(messagesData.messages);
        const alteredMessageList = [];

        messagesData.messages[0].messages.map((msg) => {
          const newMessage = { body: "", isOwner: false };
          if (msg.senderId === currentUser.id) {
            newMessage.isOwner = true;
          }
          newMessage.body = msg.body;

          alteredMessageList.push(newMessage);
          return null;
        });

        setMessageList(alteredMessageList);

        dispatch(setPreviousMessages(alteredMessageList));
      }
    } else {
      return null;
    }
  }, [messagesData, messagesLoading, currentUser]);

  /* -------------------------------------------------------------------------- */
  const addMessage = (convoId, body) => {
    editMessage({
      variables: {
        convoId: convoId,
        addMessage: { senderId: currentUser.id, body: body },
      },
    })
      .then((res) => messageRefetch())
      .then((res) => setMessageList())
      .catch((err) => {
        const errors = err.graphQLErrors?.map((error) => error.message);
        console.log(errors);
      });
  };
  /* -------------------------------------------------------------------------- */
  const alteredChatData = async () => {
    if (messageList.length > 0) {
      const newMessageList = [];
      messageList.map((msg) => {
        const newMessage = { body: "", isOwner: false };
        if (msg.senderId === currentUser.id) {
          newMessage.isOwner = true;
        }
        newMessage.body = msg.body;

        return newMessageList.push(newMessage);
      });
      console.log(newMessageList);
      return newMessageList;
    }
  };

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  return {
    messageList,
    addMessage,
    currentUser,
    getCurrentFriendMessages,
    selectedFriend,
    setSelectedFriend,
    setMessageList,
  };
  //   }
};

export default useMessages;
