import { Board } from "./board";
import { User } from "./user";

export interface Task {
  id: string;
  title: string;
  notes: string;
  board: Board;
  duedate: string;
  completed: Boolean;
  completedBy: User;
  createdAt: string;
  updatedAt: string;
}
