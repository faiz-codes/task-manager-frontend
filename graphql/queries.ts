import { gql } from "@apollo/client";

export const GET_MYTASKS = gql`
  query MyTasks($open: Boolean) {
    myTasks(open: $open) {
      id
      title
      notes
      duedate
      completed
      createdAt
      updatedAt
    }
  }
`;
