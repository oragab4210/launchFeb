import { gql } from "@apollo/client";

const mutation = gql`
  mutation AddUser($name: String!, $age: Int!) {
    addUser(name: $name, age: $age) {
      name
      age
    }
  }
`;

export default mutation;
