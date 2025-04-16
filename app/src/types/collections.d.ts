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
  tradespersonId: string
  tradespersonName: string
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

interface ChatThread extends HasKey {
  createdAt: Timestamp
  updatedAt?: Timestamp
  participantIds: string[]
  participants: ChatParticipant[]
  lastMessage: string
  lastMessageAt: Timestamp
  lastSenderId: string
  isRead: boolean
}

interface ChatParticipant {
  userId: string
  fullName: string
  avatarUrl?: string
  isOnline?: boolean
  isTyping?: boolean
  lastSeen?: Timestamp
}

interface ChatMessage extends HasKey {
  createdAt: Timestamp
  senderId: string
  fullName: string
  message: string
  type: import('@/lib/constants').MessageType
}

interface Notification extends HasKey {
  createdAt: Timestamp
  recipientId: string
  title: string
  body: string
  isRead: boolean
  type: import('@/lib/constants').NotificationType
}
