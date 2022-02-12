import { gql } from "@apollo/client";

const mutation = gql`
  mutation EditComment(
    $id: ID!
    $comment: String
    $addLike: ObjectId
    $deleteLike: ObjectId
  ) {
    editComment(
      id: $id
      comment: $comment
      addLike: $addLike
      deleteLike: $deleteLike
    ) {
      id
      likedBy {
        id
      }
    }
  }
`;

export default mutation;
