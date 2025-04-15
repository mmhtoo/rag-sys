export type ApiBaseResponse = {
  message: string
  timestamp: string
}

export type ApiDataResponse<T> = ApiBaseResponse & {
  data: T
}

export type ApiErrorResponse<E> = ApiBaseResponse & {
  message: string
  error: E
}
