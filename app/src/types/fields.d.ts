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

type ChangeDisplayNameFields = Pick<SignUpFields, 'firstName' | 'lastName'>

interface CreateJobFields {
  title: string
  category: string
  employmentType: string
  location: string
  description: string
  postAs: string
  deadline?: Date
  // payAmount?: number
  // payAmountMin?: number
  // payAmountMax?: number
  // rate?: string
  // isUsingRange: boolean
}

interface SearchJobFields {
  query: string
  location: string
  employmentType: string
}

interface CreateCompanyFields {
  name: string
  description: string
  size: string
  location: string
}
