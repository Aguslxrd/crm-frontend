import { CaseInterface } from "./ICase";

export interface CaseResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: CaseInterface[];
  }