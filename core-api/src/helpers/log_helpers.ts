import {env} from '../configs'

// log helper
export const makeLog = (
  type: 'info' | 'debug' | 'error' | 'warn',
  message: any,
  ...rest: any[]
) => {
  if (env.DISABLED_LOGGING) return
  console[type](message, ...rest)
}
