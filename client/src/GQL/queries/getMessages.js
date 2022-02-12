import { gql } from "@apollo/client";

export default gql`
  query getMessages($convoId: ID!) {
    messages(convoId: $convoId) {
      messages {
        senderId
        body
      }
    }
  }
`;
