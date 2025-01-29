import { JobApplicationStatus, type Role } from '@/lib/constants'
import firestore from '@react-native-firebase/firestore'
import { v7 as uuidv7 } from 'uuid'

const db = firestore()

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
      // Update the application count
      await db
        .collection<Job>('jobs')
        .doc(jobId)
        .update({
          applyCount: firestore.FieldValue.increment(1),
        })

      await db
        .collection<Partial<JobApplication>>('applications')
        .doc(uuidv7())
        .set({
          jobId,
          status: JobApplicationStatus.PENDING,
          tradespersonId: uid,
          message,
        })

      return true
    } catch (error: unknown) {
      console.error(error)
      return false
    }
  }

  export async function checkIfAppliedToJob(uid: string, jobId: string) {
    try {
      let isApplied = false
      const result = await db
        .collection<JobApplication>('applications')
        .where('tradespersonId', '==', uid)
        .get()

      if (result.empty) return false

      // biome-ignore lint/complexity/noForEach:
      result.forEach((document) => {
        isApplied = document.data().jobId === jobId
      })

      return isApplied
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
