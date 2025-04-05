type Timestamp = import(
  '@react-native-firebase/firestore'
).FirebaseFirestoreTypes.Timestamp
type Reference<T> = import(
  '@react-native-firebase/firestore'
).FirebaseFirestoreTypes.DocumentReference<T>
type HasKey = { key: string }

interface User extends HasKey {
  role?: import('@/lib/constants').Role
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  verified: boolean
  company?: Company
  bio?: string
  emailHidden: boolean
}

interface Tradesperson extends Omit<User, 'role'> {
  expertise: string[]
  experience: string
  availability: string
  rating: number
  reviews: number
  schedule: boolean[]
  jobApplications: Reference<JobApplication>[]
}

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

interface JobCategory extends HasKey {
  title: string
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

interface HireRequest extends HasKey {
  createdAt: Timestamp
  updatedAt: Timestamp
  respondedAt: Timestamp
  status: import('@/lib/constants').HireRequestStatus
  tradesperson: Reference<Tradesperson>
  tradespersonName: string
  employer: Reference<User>
  phone: string
  email?: string
  location: string
  jobType: string
  jobDescription: string
  expectedStartDate?: Date
  budget?: number
}

interface Company extends HasKey {
  name: string
  description: string
  size: string
  location: string
}

interface WorkPost extends HasKey {
  createdAt: Timestamp
  updatedAt: Timestamp
  description: string
  fileUrl: string
  employer: Reference<User>
  location: string
}

interface SavedProfile extends HasKey {
  savedAt: Timestamp
  profileId: string
  savedById: string
  tradespersonName: string
}

interface Review extends HasKey {
  createdAt: Timestamp
  updatedAt: Timestamp
  rating: number
  message: string
  author: Reference<User>
  target: Reference<User>
}

interface ChatMessage extends HasKey {
  createdAt: Timestamp
  sender: Reference<User>
  recipient: Reference<User>
  content: string
}
