export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export function ok<T>(data: T): ApiResponse<T> {
  return {
    statusCode: 200,
    data,
  };
}
