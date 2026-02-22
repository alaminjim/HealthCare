export interface IError {
  path: string;
  message: string;
}

export interface TErrorResponse {
  success: boolean;
  message: string;
  errorSources?: IError[];
  error?: unknown;
  statusCode: number;
}
