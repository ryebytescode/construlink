interface User {
  role: import('@/lib/constants').Role
}

type Timestamp = import(
  '@react-native-firebase/firestore'
).FirebaseFirestoreTypes.Timestamp
type HasKey = { key: string }

interface Job extends HasKey {
  authorId: string
  createdAt: Timestamp
  title: string
  category: string
  description: string
  location: string
  employmentType: string
  deadline?: Timestamp
  payAmount?: number
  payAmountMin?: number
  payAmountMax?: number
  rate?: string
  isUsingRange: boolean
  postAs: string
  status: string
  applyCount: number
}

interface JobApplication extends HasKey {
  jobId: string
  tradespersonId: string
  message?: string
  status: import('@/lib/constants').JobApplicationStatus
  review: string
}

interface Company extends HasKey {
  name: string
  description: string
  size: string
  location: string
}
