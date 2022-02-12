import { gql } from "@apollo/client";

const mutation = gql`
  mutation EditUser(
    $id: ID!
    $profilePic: String
    $name: String
    $age: Int
    $email: String
    $addFriend: ObjectId
    $deleteFriend: ObjectId
    $addConversation: ObjectId
    $deleteConversation: ObjectId
    $addPost: ObjectId
    $deletePost: ObjectId
    $addComment: ObjectId
    $deleteComment: ObjectId
  ) {
    editUser(
      id: $id
      profilePic: $profilePic
      email: $email
      name: $name
      age: $age
      addFriend: $addFriend
      deleteFriend: $deleteFriend
      addConversation: $addConversation
      deleteConversation: $deleteConversation
      addPost: $addPost
      deletePost: $deletePost
      addComment: $addComment
      deleteComment: $deleteComment
    ) {
      email
    }
  }
`;

export default mutation;

// mutation edit($id:ID!,$friend:String){
//   editUser(id:$id,friend:$friend){
//     name

//   }
// }

// {
//   "id":"617845f83c9e137474788c93",
//   "friend":"omar"
// }
