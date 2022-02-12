import { gql } from "@apollo/client";

export default gql`
  {
    user2 {
      id
      profilePic
      email
      name
      age
      friends {
        id
        email
        profilePic
        name
        age
        posts {
          id
          userId {
            id
            profilePic
            name
            email
          }
          post
          likedBy {
            id
          }
          comments {
            comment
            likedBy {
              id
            }
            userId {
              id
              name
              profilePic
            }
            postId
            id
          }
          time
        }
      }
      conversations {
        id
        email
        name
        profilePic
      }
      posts {
        id
        userId {
          id
          name
          email
          profilePic
        }
        post
        likedBy {
          id
        }
        comments {
          id
          likedBy {
            id
          }
          comment
          postId
          userId {
            id
            profilePic
            name
          }
        }
        time
      }
    }
  }
`;
