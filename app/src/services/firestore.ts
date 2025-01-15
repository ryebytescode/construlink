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
    return await firestore().collection<User>('users').doc(uid).get()
  }
}
