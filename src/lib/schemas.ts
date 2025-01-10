import { type ZodType, z } from 'zod'
import patterns from './patterns'

export const SignUpSchema: ZodType<SignUpFields> = z
  .object({
    firstName: z
      .string({
        required_error: 'Required',
      })
      .min(1, 'Required')
      .regex(patterns.name, 'Invalid name'),
    lastName: z
      .string({
        required_error: 'Required',
      })
      .min(1, 'Required')
      .regex(patterns.name, 'Invalid name'),
    email: z
      .string({
        required_error: 'Required',
      })
      .min(1, 'Required')
      .regex(patterns.email, 'Invalid email format')
      .optional(),
    phone: z
      .string({
        required_error: 'Required',
      })
      .regex(
        patterns.phone,
        'Invalid format. Should be in the form 0912 345 6789'
      )
      .optional(),
    password: z
      .string({
        required_error: 'Requirsed',
      })
      .min(8, 'Must be 8 characters long')
      .regex(
        patterns.password.oneUpperCase,
        'Must contain at least one uppercase letter'
      )
      .regex(
        patterns.password.oneLowerCase,
        'Must contain at least one lowercase letter'
      )
      .regex(patterns.password.oneDigit, 'Must contain at least one number')
      .regex(
        patterns.password.oneSpecialChar,
        'Must contain at least one special character (.#?!@$%^&*-)'
      )
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
