import { gql } from "@apollo/client";

export default gql`
  mutation addConversation($convoId: ID!, $messages: [String]) {
    addConversation(convoId: $convoId, messages: $messages) {
      convoId
    }
  }
`;
