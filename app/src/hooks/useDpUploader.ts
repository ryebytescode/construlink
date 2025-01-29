import { DPBucket } from '@/services/appwrite'
import { useAuthStore } from '@/stores/auth'
import * as FileSystem from 'expo-file-system'
import { Image } from 'expo-image'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'

const MAX_DIM = 1024

async function resizeImage(uri: string) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_DIM, height: MAX_DIM } }],
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  )

  return result.uri
}

async function processImage(
  result: ImagePicker.ImagePickerSuccessResult,
  id: string
) {
  const { fileName, fileSize, mimeType, uri, width, height } = result.assets[0]
  let manipFile: { uri: string; size: number } | null = null

  if (width > MAX_DIM || height > MAX_DIM) {
    const manipUri = await resizeImage(uri)
    const manipFileInfo = await FileSystem.getInfoAsync(manipUri)

    manipFile = {
      uri: manipUri,
      size: 0,
    }

    if (manipFileInfo.exists) {
      manipFile.size = manipFileInfo.size
    }
  }

  const uploadResult = await DPBucket.upload(id, {
    name: fileName!,
    size: manipFile?.size ?? fileSize!,
    type: mimeType!,
    uri: manipFile?.uri ?? uri,
  })

  if (uploadResult) {
    await Image.clearDiskCache()
    await loadProfilePicture(id)

    return true
  }

  return false
}

async function loadProfilePicture(id: string) {
  return await DPBucket.get(id, {
    width: MAX_DIM,
    height: MAX_DIM,
  })
}

const sharedOptions: ImagePicker.ImagePickerOptions = {
  allowsEditing: true,
  quality: 1,
  mediaTypes: ['images'],
  aspect: [1, 1],
  cameraType: ImagePicker.CameraType.front,
}

export function useDpUploader() {
  const user = useAuthStore((state) => state.user)
  const [profileUrl, setProfileUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleOpenImagePicker = async (shootMode: boolean) => {
    const result = shootMode
      ? await ImagePicker.launchCameraAsync(sharedOptions)
      : await ImagePicker.launchImageLibraryAsync(sharedOptions)

    if (!result.canceled && user) {
      setIsProcessing(true)
      setIsSuccess(false)

      const processResult = await processImage(result, user.uid)

      if (!processResult) {
        setIsError(true)
        setIsProcessing(false)
        return
      }

      setProfileUrl(result.assets[0].uri)
      setIsProcessing(false)
      setIsSuccess(true)
    }
  }

  const handleRemoveImage = async () => {
    setIsProcessing(true)
    setIsSuccess(false)

    if (user) {
      const result = await DPBucket.remove(user?.uid)

      if (!result) {
        setIsError(true)
        return
      }

      setProfileUrl(null)
    }

    setIsProcessing(false)
    setIsSuccess(true)
  }

  useEffect(() => {
    if (user) {
      ;(async () => {
        const photoResource = await loadProfilePicture(user.uid)

        if (photoResource) {
          setProfileUrl(photoResource)
        }
      })()
    }
  }, [])

  return {
    handleOpenImagePicker,
    handleRemoveImage,
    profileUrl,
    isProcessing,
    isSuccess,
    isError,
  }
}
