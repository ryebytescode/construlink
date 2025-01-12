import { type ZodType, z } from 'zod'
import patterns from './patterns'

const staticFields = {
  firstName: z.string().min(1, 'Required').regex(patterns.name, 'Invalid name'),
  lastName: z.string().min(1, 'Required').regex(patterns.name, 'Invalid name'),
}

export const SignUpSchema: ZodType<SignUpFields> = z.discriminatedUnion(
  'mode',
  [
    z.object({
      ...staticFields,
      mode: z.literal('email'),
      email: z
        .string()
        .min(1, 'Required')
        .regex(patterns.email, 'Invalid email format'),
      password: z
        .string()
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
        ),
      phone: z.string().optional(), // Phone is optional for email mode
    }),
    z.object({
      ...staticFields,
      mode: z.literal('phone'),
      phone: z
        .string()
        .min(1, 'Required')
        .regex(
          patterns.phone,
          'Invalid format. Should be in the form 0912 345 6789'
        ),
      email: z.string().optional(),
      password: z.string().optional(),
    }),
  ]
)

export const SignInSchema: ZodType<SignInFields> = z.discriminatedUnion(
  'mode',
  [
    z.object({
      mode: z.literal('email'),
      email: z
        .string()
        .min(1, 'Required')
        .regex(patterns.email, 'Invalid email format'),
      password: z.string().min(1, 'Required'),
      phone: z.string().optional(),
    }),
    z.object({
      mode: z.literal('phone'),
      phone: z
        .string()
        .min(1, 'Required')
        .regex(
          patterns.phone,
          'Invalid format. Should be in the form 0912 345 6789'
        ),
      email: z.string().optional(),
      password: z.string().optional(),
    }),
  ]
)

export const ForgotPasswordSchema: ZodType<ForgotPasswordField> = z.object({
  email: z
    .string()
    .min(1, 'Required')
    .regex(patterns.email, 'Invalid email format'),
})
