import { type ZodType, z } from 'zod'

export const SignUpSchema: ZodType<SignUpFields> = z
  .object({
    firstName: z
      .string({
        required_error: 'Required',
      })
      .min(1, 'Required'),
    lastName: z
      .string({
        required_error: 'Required',
      })
      .min(1, 'Required'),
    email: z
      .string({
        required_error: 'Required',
      })
      .min(1, 'Required')
      .optional(),
    phone: z
      .string({
        required_error: 'Required',
      })
      .regex(
        /((\+[0-9]{2})|0)[.\- ]?9[0-9]{2}[.\- ]?[0-9]{3}[.\- ]?[0-9]{4}/,
        'Invalid format. Should be in the form 0912 345 6789'
      )
      .optional(),
    password: z
      .string({
        required_error: 'Required',
      })
      .min(8)
      .optional(),
    mode: z.enum(['email', 'phone']),
  })
  .refine((data) => (data.mode === 'email' ? !!data.email : !!data.phone), {
    message: 'Required',
    path: ['email', 'phone'],
  })
  .refine((data) => (data.mode === 'email' ? !!data.password : true), {
    message: 'Required',
    path: ['password'],
  })
