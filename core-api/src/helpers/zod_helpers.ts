import type {Context, Env, TypedResponse, ValidationTargets} from 'hono'
import type {ZodError} from 'zod'
import {StatusCodes} from 'http-status-codes'
import {errorResponse} from './response_helpers'

// zod callback
export const zodCallback = <
  T,
  E extends Env,
  P extends string,
  Target extends keyof ValidationTargets = keyof ValidationTargets,
  O = {},
>(
  result: (
    | {
        success: true
        data: T
      }
    | {
        success: false
        error: ZodError
        data: T
      }
  ) & {
    target: Target
  },
  c: Context<E, P>,
):
  | Response
  | void
  | TypedResponse<O>
  | Promise<Response | void | TypedResponse<O>> => {
  if (!result.success) {
    c.status(StatusCodes.BAD_REQUEST)
    return c.json(
      errorResponse('Validation failed!', result.error.flatten().fieldErrors),
    )
  }
}
