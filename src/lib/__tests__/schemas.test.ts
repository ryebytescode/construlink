import { SignUpSchema } from '../schemas'

test('Sign up schema (using email)', () => {
  const testValues: SignUpFields = {
    firstName: 'John',
    lastName: 'Doe',
    mode: 'email',
    email: 'johndoe@gmail.com',
    password: 'johndoe.12345',
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
  }

  const safe = SignUpSchema.safeParse(testValues)
  expect(safe.success).toStrictEqual(true)
})
