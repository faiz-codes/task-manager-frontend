import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation AddTask(
    $duedate: DateTime!
    $notes: String
    $boardId: ID
    $title: String!
  ) {
    addTask(
      duedate: $duedate
      notes: $notes
      boardId: $boardId
      title: $title
    ) {
      id
    }
  }
`;

export const COMPLETE_TASK = gql`
  mutation CompleteTask($completeTaskId: ID!) {
    completeTask(id: $completeTaskId) {
      id
    }
  }
`;
