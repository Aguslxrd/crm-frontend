import { EnterprisesInterface } from "./IEnterprises";

export interface AdminEnterpriseResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: EnterprisesInterface[];
  }