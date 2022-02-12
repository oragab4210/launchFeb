import { gql } from "@apollo/client";

const mutation = gql`
  mutation AddPost($userId: ID!, $post: String!) {
    addPost(userId: $userId, post: $post) {
      id
      post
    }
  }
`;

export default mutation;
