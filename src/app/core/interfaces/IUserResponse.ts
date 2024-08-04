import { UserInterface } from "./IUser";

export interface CaseResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: UserInterface[];
  }