import { gql } from "@apollo/client";

export default gql`
  query convoExists($convoId: ID!) {
    conversationExists(convoId: $convoId) {
      convoId
    }
  }
`;
