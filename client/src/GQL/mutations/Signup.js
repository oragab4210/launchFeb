import { gql } from "@apollo/client";

export default gql`
  mutation Signup($name: String, $email: String, $password: String) {
    signup(name: $name, email: $email, password: $password) {
      id
      email
    }
  }
`;
