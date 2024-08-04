import { ILogsInterface } from "./ILoggsInterface";

export interface LogsResponse{
    totalElements: number;
    totalPages: number;
    size: number;
    content: ILogsInterface[];
}