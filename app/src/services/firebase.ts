import { JobApplicationStatus, type Role } from '@/lib/constants'
import auth from '@react-native-firebase/auth'
import firestore, { serverTimestamp } from '@react-native-firebase/firestore'
import { v7 as uuidv7 } from 'uuid'

const db = firestore()

export namespace User {
  export function get() {
    return auth().currentUser
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
  export async function setRole(uid: string, role: Role) {
    return await db.collection<User>('users').doc(uid).set({ role: role })
  }

  export async function getRole(uid: string) {
    const result = await db.collection<User>('users').doc(uid).get()
    return result.exists ? result.data()!.role : null
  }

  export async function getStats(
    uid: string,
    role: Role
  ): Promise<Stats | null> {
    try {
      const result = await db
        .collection<Job>('jobs')
        .where('authorId', '==', uid)
        .get()

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
  export async function getAllJobPosts() {
    const entries: Job[] = []

    try {
      const result = await db
        .collection<Job>('jobs')
        .orderBy('createdAt', 'desc')
        .get()

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
      const result = await db.collection<Job>('jobs').doc(jobId).get()

      if (!result.exists) return null

      return result.data() as Job
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }

  export async function applyJob(uid: string, jobId: string, message?: string) {
    try {
      await db
        .collection<Partial<JobApplication>>('applications')
        .doc(uuidv7())
        .set({
          job: db.collection('jobs').doc(jobId),
          status: JobApplicationStatus.PENDING,
          tradespersonId: uid,
          message,
          createdAt: serverTimestamp(),
        })

      // Update the application count
      await db
        .collection<Job>('jobs')
        .doc(jobId)
        .update({
          applyCount: firestore.FieldValue.increment(1),
        })

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }

  export async function checkIfAppliedToJob(uid: string, jobId: string) {
    try {
      const result = await db
        .collection<JobApplication>('applications')
        .where('tradespersonId', '==', uid)
        .where('job', '==', db.collection('jobs').doc(jobId))
        .get()

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
      const result = await db
        .collection<JobApplication>('applications')
        .where('tradespersonId', '==', uid)
        .get()

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
  export async function getCompanyDetails(companyId: string) {
    try {
      const result = await db.collection('companies').doc(companyId).get()

      if (!result.exists) return null

      return result.data() as Company
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}
