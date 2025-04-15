import type {ApiBaseResponse, ApiDataResponse, ApiErrorResponse} from '../types'

export const baseResponse = (message: string): ApiBaseResponse => ({
  message,
  timestamp: new Date().toISOString(),
})

export const dataResponse = <T>(
  message: string,
  data: T,
): ApiDataResponse<T> => ({
  ...baseResponse(message),
  data,
})

export const errorResponse = <E>(
  message: string,
  error: E,
): ApiErrorResponse<E> => ({
  ...baseResponse(message),
  error,
})
