interface SignUpFields {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  password?: string
  mode: 'email' | 'phone'
}

interface SignInFields {
  email?: string
  phone?: string
  password?: string
  mode: 'email' | 'phone'
}

interface ForgotPasswordField {
  email: string
}

interface ResetPasswordFields {
  newPassword: string
  confirmPassword: string
}
