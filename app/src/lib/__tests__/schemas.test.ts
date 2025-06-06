import { ResetPasswordSchema, SignInSchema, SignUpSchema } from '../schemas'

test('Sign up schema (using email)', () => {
  const testValues: SignUpFields = {
    firstName: 'John',
    lastName: 'Doe',
    mode: 'email',
    email: 'johndoe@gmail.com',
    password: 'Johndoe.12345',
    phone: '',
  }

  const safe = SignUpSchema.safeParse(testValues)
  expect(safe.success).toStrictEqual(true)
})

test('Sign up schema (using phone)', () => {
  const testValues: SignUpFields = {
    firstName: 'John',
    lastName: 'Doe',
    mode: 'phone',
    phone: '09123456789',
    email: '',
    password: '',
  }

  const safe = SignUpSchema.safeParse(testValues)
  expect(safe.success).toStrictEqual(true)
})

test('Sign in schema (using email)', () => {
  const testValues: SignInFields = {
    mode: 'email',
    email: 'johndoe@gmail.com',
    password: 'Johndoe.12345',
    phone: '',
  }

  const safe = SignInSchema.safeParse(testValues)
  expect(safe.success).toStrictEqual(true)
})

test('Sign in schema (using phone)', () => {
  const testValues: SignInFields = {
    mode: 'phone',
    phone: '09123456789',
    email: '',
    password: '',
  }

  const safe = SignInSchema.safeParse(testValues)
  expect(safe.success).toStrictEqual(true)
})

test('Reset password (different)', () => {
  const testValues: ResetPasswordFields = {
    newPassword: 'Johndoe.12345',
    confirmPassword: 'johndoe.12345',
  }

  const safe = ResetPasswordSchema.safeParse(testValues)
  expect(safe.success).toStrictEqual(false)
})

test('Reset password (the same)', () => {
  const testValues: ResetPasswordFields = {
    newPassword: 'Johndoe.12345',
    confirmPassword: 'Johndoe.12345',
  }

  const safe = ResetPasswordSchema.safeParse(testValues)
  expect(safe.success).toStrictEqual(true)
})
