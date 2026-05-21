export interface IApiError {
  statusCode: number;
  message: string;
  errors: string[];
  success: boolean;
  stack?: string;
}

export interface IApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}