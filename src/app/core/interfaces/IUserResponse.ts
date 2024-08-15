import { UserInterface } from "./IUser";

export interface UserResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: UserInterface[];
  }