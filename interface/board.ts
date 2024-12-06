import { Task } from "./task";
import { User } from "./user";

export interface Board {
  id: string;
  title: string;
  description: string;
  color: string;
  users: [User];
  tasks: [Task];
  private: Boolean;
}
