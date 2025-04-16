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

interface HireFields {
  tradespersonName: string
  tradespersonId: string
  employerId: string
  employerName: string
  phone: string
  email?: string
  location: string
  jobType: string
  jobDescription: string
  expectedStartDate?: Date
  budget?: number
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

interface CreateWorkPostFields {
  description: string
  fileUrl: string
  location: string
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type CreateReviewFields = {}

interface CreateNotificationFields {
  title: string
  body: string
  type: import('@/lib/constants').NotificationType
}
