import { stripNullish } from '@/helpers/utils'
import { JobApplicationStatus, type Role } from '@/lib/constants'
import { getAuth } from '@react-native-firebase/auth'
import {
  type FirebaseFirestoreTypes,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@react-native-firebase/firestore'
import { v7 as uuidv7 } from 'uuid'

async function initialize() {
  await getFirestore().settings({
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

        UserCollection.setUserInfo(user.uid, { role })

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

  export async function getUserInfo(uid: string) {
    const result = await getDoc<User>(
      doc(db, 'users', uid) as FirebaseFirestoreTypes.DocumentReference<User>
    )
    return result.exists ? result.data() : null
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
