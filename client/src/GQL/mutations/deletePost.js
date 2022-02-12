import { gql } from "@apollo/client";

const mutation = gql`
  mutation DeletePost($id: ID!) {
    removePost(id: $id) {
      id
    }
  }
`;

export default mutation;
