import { gql } from "@apollo/client";

const mutation = gql`
  mutation AddComment($postId: ID!, $userId: ID!, $comment: String!) {
    addComment(postId: $postId, userId: $userId, comment: $comment) {
      id
      comment
      # likedBy
      postId
    }
  }
`;

export default mutation;
