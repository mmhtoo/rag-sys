import {z} from 'zod'

// create directory schema
export const createDirectorySchema = z.object({
  name: z
    .string({
      required_error: 'Name is required!',
    })
    .min(1, {message: 'Name must be at least 1 characters long!'})
    .max(100, {message: 'Name must be at most 100 characters long!'}),
  parentDirId: z
    .string({
      invalid_type_error: 'Parent directory id is invalid!',
    })
    .optional(),
})
export type CreateDirectoryReqDto = z.infer<typeof createDirectorySchema>

// get directorys filter schema
export const getDirectoryFilterSchema = z.object({
  name: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  orderBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
  parentDirId: z.string().optional(),
  page: z
    .string()
    .regex(/^\d+$/, {
      message: 'Must be a string of digits',
    })
    .optional()
    .default('1'),
  pageSize: z
    .string()
    .regex(/^\d+$/, {
      message: 'Must be a string of digits',
    })
    .optional()
    .default('10'),
})
export type GetDirectoryFilterReqDto = z.infer<typeof getDirectoryFilterSchema>
