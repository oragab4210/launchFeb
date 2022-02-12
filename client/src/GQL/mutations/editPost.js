import { gql } from "@apollo/client";

const mutation = gql`
  mutation EditPost(
    $id: ID!
    $post: String
    $addComment: ObjectId
    $deleteComment: ObjectId
    $addLike: ObjectId
    $deleteLike: ObjectId
  ) {
    editPost(
      id: $id
      post: $post
      addComment: $addComment
      deleteComment: $deleteComment
      addLike: $addLike
      deleteLike: $deleteLike
    ) {
      id
    }
  }
`;

export default mutation;
