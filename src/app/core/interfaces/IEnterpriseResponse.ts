import { EnterprisesInterface } from "./IEnterprises";

export interface EnterpriseResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: EnterprisesInterface[];
  }