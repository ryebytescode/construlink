import type { Role } from '@/lib/constants'
import firestore from '@react-native-firebase/firestore'

export namespace UserCollection {
  export async function setRole(uid: string, role: Role) {
    return await firestore()
      .collection<User>('users')
      .doc(uid)
      .set({ role: role })
  }

  export async function getRole(uid: string) {
    const result = await firestore().collection<User>('users').doc(uid).get()
    return result.exists ? result.data()!.role : null
  }
}

export namespace JobCollection {
  export async function getAllJobPosts() {
    const entries: Job[] = []

    try {
      const result = await firestore()
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
      const result = await firestore().collection<Job>('jobs').doc(jobId).get()

      if (!result.exists) return null

      return result.data() as Job
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}

export namespace CompanyCollection {
  export async function getCompanyDetails(companyId: string) {
    try {
      const result = await firestore()
        .collection('companies')
        .doc(companyId)
        .get()

      if (!result.exists) return null

      return result.data() as Company
    } catch (error: unknown) {
      console.error(error)
      return null
    }
  }
}
