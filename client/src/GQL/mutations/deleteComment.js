import { gql } from "@apollo/client";

const mutation = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      id
    }
  }
`;

export default mutation;
