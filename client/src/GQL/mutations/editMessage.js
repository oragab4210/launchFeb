import { gql } from "@apollo/client";

export default gql`
  mutation editMessage($convoId: ID!, $addMessage: addMessage) {
    editMessage(convoId: $convoId, addMessage: $addMessage) {
      convoId
      messages {
        senderId
        body
      }
    }
  }
`;
