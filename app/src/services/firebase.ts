import { stripNullish } from '@/helpers/utils'
import { HireRequestStatus, JobApplicationStatus, Role } from '@/lib/constants'
import { getApp } from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import {
  type FirebaseFirestoreTypes,
  Timestamp,
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  initializeFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  updateDoc,
  where,
} from '@react-native-firebase/firestore'
import type { IMessage } from 'react-native-gifted-chat'
import { v7 as uuidv7 } from 'uuid'

async function initialize() {
  initializeFirestore(getApp(), {
    persistence: false,
  })
}

initialize()

const db = getFirestore()
const auth = getAuth()

export namespace User {
  export function get() {
    return auth.currentUser
  }

  export async function signIn(fields: SignInFields, isEmailMode = true) {
    try {
      if (isEmailMode) {
        await auth.signInWithEmailAndPassword(fields.email!, fields.password!)
      } else {
        const phone = `'+63${fields.phone!.slice(1, fields.phone!.length)}`
        await auth.signInWithPhoneNumber(phone, true)
      }

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function signOut() {
    await auth.signOut()
  }

  export async function signUp(
    fields: SignUpFields,
    role: Role,
    isEmailMode = true
  ) {
    try {
      if (isEmailMode) {
        const { user } = await auth.createUserWithEmailAndPassword(
          fields.email!,
          fields.password!
        )

        await user.updateProfile({
          displayName: `${fields.firstName} ${fields.lastName}`,
        })

        await UserCollection.setUserInfo(user.uid, {
          role,
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          phone: fields.phone,
        })

        await auth.currentUser?.sendEmailVerification()
      }

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function sendPasswordResetEmail(email: string) {
    try {
      await auth.sendPasswordResetEmail(email)
      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function sendEmailVerification() {
    await auth.currentUser?.sendEmailVerification()
  }

  export function getDisplayName(
    full?: boolean
  ): string | ChangeDisplayNameFields | null {
    const currentUser = get()

    if (!currentUser) return null

    if (full) return currentUser.displayName

    const displayName = currentUser.displayName?.split(' ')

    if (!displayName) {
      return {
        firstName: '',
        lastName: '',
      }
    }

    return {
      firstName: displayName[0],
      lastName: displayName[1],
    }
  }

  export async function editDisplayName(fields: ChangeDisplayNameFields) {
    const currentUser = get()

    if (!currentUser) return false

    try {
      await currentUser?.updateProfile({
        displayName: `${fields.firstName} ${fields.lastName}`,
      })

      return true
    } catch (error: unknown) {
      console.log(error)
      return false
    }
  }
}

export namespace UserCollection {
  export async function setUserInfo(uid: string, info: Partial<User>) {
    return await setDoc<Partial<User>>(doc(db, 'users', uid), info)
  }

  export async function getRole(uid: string) {
    const result = await getDoc<User>(
      doc<User>(
        db,
        'users',
        uid
      ) as FirebaseFirestoreTypes.DocumentReference<User>
    )

    return result.exists ? result.data()!.role : null
  }

  export async function getUserInfo<T extends User>(uid: string) {
    const result = await getDoc<T>(
      doc(db, 'users', uid) as FirebaseFirestoreTypes.DocumentReference<T>
    )
    return result.exists ? (result.data() ?? null) : null
  }

  export async function getStats(
    uid: string,
    role: Role
  ): Promise<Stats | null> {
    try {
      const fbQuery = query<Job>(
        collection(
          db,
          'jobs'
        ) as FirebaseFirestoreTypes.CollectionReference<Job>,
        where('authorId', '==', uid)
      )
      const result = await getDocs(fbQuery)

      return {
        posts: result.size,
        hires: 0,
        rating: 0,
      } as Stats
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function getTradespeople() {
    const entries: Tradesperson[] = []

    try {
      const fbQuery = query<Tradesperson>(
        collection(
          db,
          'users'
        ) as FirebaseFirestoreTypes.CollectionReference<Tradesperson>,
        where('role', '==', Role.TRADESPERSON)
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach:
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}

export namespace JobCollection {
  export async function createJob(employerId: string, fields: CreateJobFields) {
    const newFields = Object.assign(fields)

    try {
      await setDoc<Partial<Job>>(doc(db, 'users', uuidv7()), {
        ...stripNullish(newFields),
        createdAt: serverTimestamp(),
        authorId: employerId,
        status: 'pending',
        company: doc<Company>(db, 'companies', employerId),
      })

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function getAllJobPosts() {
    const entries: Job[] = []

    try {
      const fbQuery = query<Job>(
        collection(
          db,
          'jobs'
        ) as FirebaseFirestoreTypes.CollectionReference<Job>,
        orderBy('createdAt', 'desc')
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach:
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function getMyJobPosts(uid: string) {
    const entries: Job[] = []

    try {
      const fbQuery = query<Job>(
        collection(
          db,
          'jobs'
        ) as FirebaseFirestoreTypes.CollectionReference<Job>,
        where('authorId', '==', uid),
        orderBy('createdAt', 'desc')
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach:
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function getJobPost(jobId: string) {
    try {
      const result = await getDoc<Job>(
        doc<Job>(
          db,
          'jobs',
          jobId
        ) as FirebaseFirestoreTypes.DocumentReference<Job>
      )

      if (!result.exists) return null

      return result.data()
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function applyJob(uid: string, jobId: string, message?: string) {
    try {
      await setDoc<Partial<JobApplication>>(doc(db, 'applications', uuidv7()), {
        job: doc<Job>(db, 'jobs', jobId),
        status: JobApplicationStatus.PENDING,
        tradespersonId: uid,
        message,
        createdAt: serverTimestamp(),
      })

      // Update the application count
      await updateDoc<Job>(
        doc<Job>(
          db,
          'jobs',
          jobId
        ) as FirebaseFirestoreTypes.DocumentReference<Job>,
        {
          applyCount: increment(1),
        }
      )

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }

  export async function checkIfAppliedToJob(uid: string, jobId: string) {
    try {
      const fbQuery = query<JobApplication>(
        collection(
          db,
          'applications'
        ) as FirebaseFirestoreTypes.CollectionReference<JobApplication>,
        where('tradespersonId', '==', uid),
        where('job', '==', doc(db, 'jobs', jobId))
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return false

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }

  export async function getJobApplications(uid: string) {
    const entries: JobApplication[] = []

    try {
      const fbQuery = query<JobApplication>(
        collection(
          db,
          'applications'
        ) as FirebaseFirestoreTypes.CollectionReference<JobApplication>,
        where('tradespersonId', '==', uid)
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach:
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }

  export async function searchJobPosts(queryText: string, filters: Job) {
    const entries: Job[] = []

    try {
      let fbQuery = query<Job>(
        collection(
          db,
          'jobs'
        ) as FirebaseFirestoreTypes.CollectionReference<Job>,
        where('title', '>=', queryText),
        where('title', '<=', `${queryText}\uf8ff`),
        orderBy('title')
      )

      // Apply filters to the query
      if (filters.location) {
        fbQuery = query(fbQuery, where('location', '==', filters.location))
      }
      if (filters.employmentType) {
        fbQuery = query(
          fbQuery,
          where('employmentType', '==', filters.employmentType)
        )
      }

      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach: <explanation>
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function filterCategories(queryText?: string) {
    const entries: JobCategory[] = []
    const cleanedQuery = queryText ? queryText.trim().toLowerCase() : ''

    try {
      const fbQuery = query<JobCategory>(
        collection(
          db,
          'jobCategories'
        ) as FirebaseFirestoreTypes.CollectionReference<Job>,
        orderBy('title'),
        startAt(cleanedQuery),
        endAt(`${cleanedQuery}\uf8ff`),
        limit(10)
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach: <explanation>
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function getJobCategories() {
    const entries: JobCategory[] = []

    try {
      const fbQuery = query<JobCategory>(
        collection(
          db,
          'jobCategories'
        ) as FirebaseFirestoreTypes.CollectionReference<JobCategory>,
        orderBy('title'),
        limit(10)
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach: <explanation>
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}

export namespace HireRequestCollection {
  export async function create(tradespersonId: string, fields: HireFields) {
    const newFields = Object.assign(fields)

    try {
      await setDoc<HireRequest>(
        doc(
          db,
          'hireRequests',
          uuidv7()
        ) as FirebaseFirestoreTypes.DocumentReference<HireRequest>,
        {
          ...stripNullish(newFields),
          createdAt: serverTimestamp(),
          status: HireRequestStatus.PENDING,
        }
      )

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function getMyRequests() {
    const entries: HireRequest[] = []

    try {
      const fbQuery = query<HireRequest>(
        collection(
          db,
          'hireRequests'
        ) as FirebaseFirestoreTypes.CollectionReference<HireRequest>,
        where('employerId', '==', User.get()!.uid),
        orderBy('createdAt', 'desc')
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach: <explanation>
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function getRequests(tradespersonId: string) {
    const entries: HireRequest[] = []

    try {
      const fbQuery = query<HireRequest>(
        collection(
          db,
          'hireRequests'
        ) as FirebaseFirestoreTypes.CollectionReference<HireRequest>,
        where('tradespersonId', '==', tradespersonId),
        orderBy('createdAt', 'desc')
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach: <explanation>
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function getRequest(hireRequestId: string) {
    try {
      const result = await getDoc<HireRequest>(
        doc<HireRequest>(
          db,
          'hireRequests',
          hireRequestId
        ) as FirebaseFirestoreTypes.DocumentReference<HireRequest>
      )

      if (!result.exists) return null

      return result.data()
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function update(
    hireRequestId: string,
    fields: Partial<HireRequest>
  ) {
    try {
      await updateDoc<HireRequest>(
        doc<HireRequest>(
          db,
          'hireRequests',
          hireRequestId
        ) as FirebaseFirestoreTypes.DocumentReference<HireRequest>,
        {
          ...stripNullish(fields),
          updatedAt: serverTimestamp(),
        }
      )

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }

  export async function accept(hireRequestId: string) {
    try {
      await updateDoc<HireRequest>(
        doc<HireRequest>(
          db,
          'hireRequests',
          hireRequestId
        ) as FirebaseFirestoreTypes.DocumentReference<HireRequest>,
        {
          status: HireRequestStatus.ACCEPTED,
          updatedAt: serverTimestamp(),
        }
      )

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }

  export async function reject(hireRequestId: string) {
    try {
      await updateDoc<HireRequest>(
        doc<HireRequest>(
          db,
          'hireRequests',
          hireRequestId
        ) as FirebaseFirestoreTypes.DocumentReference<HireRequest>,
        {
          status: HireRequestStatus.REJECTED,
          updatedAt: serverTimestamp(),
        }
      )

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }
}

export namespace CompanyCollection {
  export async function createCompany(
    employerId: string,
    fields: CreateCompanyFields
  ) {
    const newFields = Object.assign(fields)

    try {
      await setDoc<Company>(
        doc(
          db,
          'companies',
          employerId
        ) as FirebaseFirestoreTypes.DocumentReference<Company>,
        {
          ...stripNullish(newFields),
          createdAt: serverTimestamp(),
          status: 'pending',
        }
      )

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function getCompanyDetails(companyId: string) {
    try {
      const result = await getDoc<Company>(
        doc<Company>(
          db,
          'companies',
          companyId
        ) as FirebaseFirestoreTypes.DocumentReference<Company>
      )

      if (!result.exists) return null

      return result.data() ?? null
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}

export namespace WorkPostCollection {
  export async function createWorkPost(
    tradespersonId: string,
    fields: CreateWorkPostFields
  ) {
    const newFields = Object.assign(fields)

    try {
      await setDoc<WorkPost>(
        doc(
          db,
          'workPosts',
          tradespersonId
        ) as FirebaseFirestoreTypes.DocumentReference<WorkPost>,
        {
          ...stripNullish(newFields),
          createdAt: serverTimestamp(),
          tradespersonId,
        }
      )

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function getWorkPost(tradespersonId: string) {
    try {
      const result = await getDoc<WorkPost>(
        doc<WorkPost>(
          db,
          'workPosts',
          tradespersonId
        ) as FirebaseFirestoreTypes.DocumentReference<WorkPost>
      )

      if (!result.exists) return null

      return result.data() ?? null
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function getWorkPosts() {
    const entries: WorkPost[] = []

    try {
      const fbQuery = query<WorkPost>(
        collection(
          db,
          'workPosts'
        ) as FirebaseFirestoreTypes.CollectionReference<WorkPost>,
        orderBy('createdAt', 'desc')
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach:
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}

export namespace SavedProfileCollection {
  export async function add(profileId: string, tradespersonName: string) {
    const userId = User.get()!.uid

    try {
      await setDoc<SavedProfile>(
        doc(
          db,
          'savedProfiles',
          uuidv7()
        ) as FirebaseFirestoreTypes.DocumentReference<SavedProfile>,
        {
          savedAt: serverTimestamp(),
          profileId,
          savedById: userId,
          tradespersonName,
        }
      )

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function getSavedProfiles() {
    const entries: SavedProfile[] = []

    try {
      const fbQuery = query<SavedProfile>(
        collection(
          db,
          'savedProfiles'
        ) as FirebaseFirestoreTypes.CollectionReference<SavedProfile>,
        where('savedById', '==', User.get()!.uid),
        orderBy('savedAt', 'desc')
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach: <explanation>
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function remove(profileId: string) {
    try {
      const fbQuery = query<SavedProfile>(
        collection(
          db,
          'savedProfiles'
        ) as FirebaseFirestoreTypes.CollectionReference<SavedProfile>,
        where('profileId', '==', profileId),
        where('savedById', '==', User.get()!.uid)
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return false

      // biome-ignore lint/complexity/noForEach: <explanation>
      result.forEach(async (documentSnapshot) => {
        await documentSnapshot.ref.delete()
      })

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }

  export async function checkIfSaved(profileId: string) {
    try {
      const fbQuery = query<SavedProfile>(
        collection(
          db,
          'savedProfiles'
        ) as FirebaseFirestoreTypes.CollectionReference<SavedProfile>,
        where('profileId', '==', profileId),
        where('savedById', '==', User.get()!.uid)
      )
      const result = await getDocs(fbQuery)

      return !result.empty
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }
}

export namespace ReviewCollection {
  export async function createReview(
    tradespersonId: string,
    fields: CreateReviewFields
  ) {
    const newFields = Object.assign(fields)

    try {
      await setDoc<Review>(
        doc(
          db,
          'reviews',
          tradespersonId
        ) as FirebaseFirestoreTypes.DocumentReference<Review>,
        {
          ...stripNullish(newFields),
          createdAt: serverTimestamp(),
          tradespersonId,
        }
      )

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function getReviews(tradespersonId: string) {
    const entries: Review[] = []

    try {
      const fbQuery = query<Review>(
        collection(
          db,
          'reviews'
        ) as FirebaseFirestoreTypes.CollectionReference<Review>,
        where('tradespersonId', '==', tradespersonId),
        orderBy('createdAt', 'desc')
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach:
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}

export namespace ChatCollection {
  export function getThreadsQuery() {
    return query<ChatThread>(
      collection(
        db,
        'chatThreads'
      ) as FirebaseFirestoreTypes.CollectionReference<ChatThread>,
      where('participantIds', 'array-contains', User.get()!.uid),
      orderBy('lastMessageAt', 'desc')
    )
  }

  export async function getMessages(threadId: string) {
    try {
      const result = await getDoc<ChatThread>(
        doc<ChatThread>(
          db,
          'chatThreads',
          threadId
        ) as FirebaseFirestoreTypes.DocumentReference<ChatThread>
      )

      if (!result.exists) return null

      const messagesCollection = collection(
        result.ref,
        'messages'
      ) as FirebaseFirestoreTypes.CollectionReference<ChatMessage>

      const messagesSnapshot = await getDocs(messagesCollection)

      if (messagesSnapshot.empty) return []

      const messages: IMessage[] = []
      // biome-ignore lint/complexity/noForEach: <explanation>
      messagesSnapshot.forEach((doc) => {
        const data = doc.data()
        messages.push({
          _id: doc.id,
          createdAt: new Timestamp(
            data.createdAt.seconds,
            data.createdAt.nanoseconds
          ).toDate(),
          text: data.message,
          user: {
            _id: data.senderId,
            name: data.fullName,
          },
        })
      })

      return messages
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function getThread(threadId: string) {
    try {
      const result = await getDoc<ChatThread>(
        doc<ChatThread>(
          db,
          'chatThreads',
          threadId
        ) as FirebaseFirestoreTypes.DocumentReference<ChatThread>
      )

      if (!result.exists) return null

      return result.data() ?? null
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export function getRecipients(participants: ChatParticipant[]) {
    return participants.filter(
      (participant) => participant.userId !== User.get()!.uid
    )
  }

  export async function markThreadAsRead(threadId: string) {
    try {
      const threadRef = doc<ChatThread>(
        db,
        'chatThreads',
        threadId
      ) as FirebaseFirestoreTypes.DocumentReference<ChatThread>

      return await updateDoc(threadRef, {
        isRead: true,
      })
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function sendMessage(
    threadId: string,
    message: string,
    senderId: string,
    fullName: string
  ) {
    try {
      const threadRef = doc<ChatThread>(
        db,
        'chatThreads',
        threadId
      ) as FirebaseFirestoreTypes.DocumentReference<ChatThread>

      const messageRef = collection(
        threadRef,
        'messages'
      ) as FirebaseFirestoreTypes.CollectionReference<ChatMessage>

      await setDoc<ChatMessage>(
        doc(
          messageRef,
          uuidv7()
        ) as FirebaseFirestoreTypes.DocumentReference<ChatMessage>,
        {
          createdAt: serverTimestamp(),
          message,
          senderId,
          fullName,
        }
      )

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }
}

export namespace NotificationCollection {
  export async function create(
    recipientId: string,
    fields: CreateNotificationFields
  ) {
    const newFields = Object.assign(fields)

    try {
      await setDoc<Notification>(
        doc(
          db,
          'notifications',
          uuidv7()
        ) as FirebaseFirestoreTypes.DocumentReference<Notification>,
        {
          ...stripNullish(newFields),
          createdAt: serverTimestamp(),
          recipientId,
          isRead: false,
        }
      )

      return true
    } catch (error: unknown) {
      return false
    }
  }

  export async function getNotifications() {
    const entries: Notification[] = []

    try {
      const fbQuery = query<Notification>(
        collection(
          db,
          'notifications'
        ) as FirebaseFirestoreTypes.CollectionReference<Notification>,
        where('recipientId', '==', User.get()!.uid),
        orderBy('createdAt', 'desc')
      )
      const result = await getDocs(fbQuery)

      if (result.empty) return null

      // biome-ignore lint/complexity/noForEach:
      result.forEach((documentSnapshot) => {
        entries.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })

      return entries
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}
