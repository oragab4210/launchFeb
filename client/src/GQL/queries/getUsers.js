import { gql } from "@apollo/client";

export default gql`
  {
    users {
      id
      name
      email
      profilePic
    }
  }
`;
