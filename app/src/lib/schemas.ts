import { type ZodType, z } from 'zod'
import patterns from './patterns'

const nameFields = {
  firstName: z.string().min(1, 'Required').regex(patterns.name, 'Invalid name'),
  lastName: z.string().min(1, 'Required').regex(patterns.name, 'Invalid name'),
}

const passwordField = z
  .string()
  .min(8, 'Must be at least 8 characters long')
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

export const SignUpSchema: ZodType<SignUpFields> = z.discriminatedUnion(
  'mode',
  [
    z.object({
      ...nameFields,
      mode: z.literal('email'),
      email: z
        .string()
        .min(1, 'Required')
        .regex(patterns.email, 'Invalid email format'),
      password: passwordField,
      phone: z.string().optional(), // Phone is optional for email mode
    }),
    z.object({
      ...nameFields,
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

export const ResetPasswordSchema: ZodType<ResetPasswordFields> = z
  .object({
    newPassword: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export const ChangeDisplayNameSchema: ZodType<ChangeDisplayNameFields> =
  z.object(nameFields)

export const CreateJobSchema: ZodType<CreateJobFields> = z.object({
  title: z
    .string()
    .min(1, 'Required')
    .max(100, 'Must contain at most 100 characters'),
  category: z.string().min(1, 'Required'),
  employmentType: z.string().min(1, 'Required'),
  location: z.string().min(1, 'Required'),
  description: z
    .string()
    .min(1, 'Required')
    .max(300, 'Must contain at most 300 characters'),
  postAs: z.string().min(1, 'Required'),
  deadline: z.date().min(new Date(), 'Invalid date').optional(),
  // payAmount: z.number().min(1, 'Must be at least 1').optional(),
  // payAmountMin: z.number().min(1, 'Must be at least 1').optional(),
  // payAmountMax: z.number().min(1, 'Must be at least 1').optional(),
  // rate: z.string().optional(),
  // isUsingRange: z.boolean(),
})
// .refine(
//   (data) => {
//     if (data.isUsingRange) {
//       return (
//         data.payAmountMin !== undefined &&
//         data.payAmountMax !== undefined &&
//         data.payAmountMin <= data.payAmountMax
//       )
//     }
//     return data.payAmount !== undefined
//   },
//   {
//     message: 'Invalid pay amounts',
//     path: ['payAmountMin', 'payAmountMax', 'payAmount'],
//   }
// )

export const SearchJobSchema: ZodType<Partial<SearchJobFields>> = z.object({
  query: z.string().min(1, 'Required'),
})

export const HireSchema: ZodType<Omit<HireFields, 'tradespersonName'>> =
  z.object({
    phone: z
      .string()
      .min(1, 'Required')
      .regex(
        patterns.phone,
        'Invalid format. Should be in the form 0912 345 6789'
      ),
    location: z.string().min(1, 'Required'),
    jobType: z.string().min(1, 'Required'),
    jobDescription: z
      .string()
      .min(1, 'Required')
      .max(300, 'Must contain at most 300 characters'),
    expectedStartDate: z.date().min(new Date(), 'Invalid date').optional(),
  })
