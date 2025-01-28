import { Client, ImageGravity, Storage } from 'react-native-appwrite'

export const appwriteClient = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_API_URL)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM)

export const appwriteStorage = new Storage(appwriteClient)

export interface AppwriteFile {
  name: string
  type: string
  size: number
  uri: string
}

export interface Size {
  width: number
  height: number
}

export namespace DPBucket {
  export async function upload(userId: string, file: AppwriteFile) {
    const fileExists = await has(userId)

    try {
      if (fileExists) {
        await appwriteStorage.deleteFile(
          process.env.EXPO_PUBLIC_APPWRITE_PROFILES_BUCKET_ID,
          userId
        )
      }

      const result = await appwriteStorage.createFile(
        process.env.EXPO_PUBLIC_APPWRITE_PROFILES_BUCKET_ID,
        userId,
        file
      )

      return result
    } catch (error: unknown) {
      __DEV__ && console.error(error)
      return null
    }
  }

  export async function has(userId: string) {
    try {
      await appwriteStorage.getFile(
        process.env.EXPO_PUBLIC_APPWRITE_PROFILES_BUCKET_ID,
        userId
      )

      return true
    } catch (error: unknown) {
      __DEV__ && console.error(error)
      return false
    }
  }

  export async function get(userId: string, size?: Size) {
    const fileExists = await has(userId)

    if (!fileExists) return null

    try {
      const result = await appwriteStorage.getFilePreview(
        process.env.EXPO_PUBLIC_APPWRITE_PROFILES_BUCKET_ID,
        userId,
        size?.width,
        size?.height,
        ImageGravity.Center
      )

      return result.toString()
    } catch (error: unknown) {
      __DEV__ && console.error(error)
      return null
    }
  }

  export async function remove(userId: string) {
    const fileExists = await has(userId)

    if (!fileExists) return true

    try {
      await appwriteStorage.deleteFile(
        process.env.EXPO_PUBLIC_APPWRITE_PROFILES_BUCKET_ID,
        userId
      )

      return true
    } catch (error: unknown) {
      __DEV__ && console.error(error)
      return false
    }
  }
}
