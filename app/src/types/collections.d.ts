interface User {
  role: import('@/lib/constants').Role
  company?: Company
}

type Timestamp = import(
  '@react-native-firebase/firestore'
).FirebaseFirestoreTypes.Timestamp
type Reference<T> = import(
  '@react-native-firebase/firestore'
).FirebaseFirestoreTypes.DocumentReference<T>
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
  company?: Reference<Company>
}

interface JobApplication extends HasKey {
  createdAt: Timestamp
  updatedAt: Timestamp
  job: Reference<Job>
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
