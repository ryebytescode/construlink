import { Typo } from '@/theme'
import { formatDistanceToNowStrict } from 'date-fns'
import { useFocusEffect } from 'expo-router'
import { useEffect, useState } from 'react'
import { ClText } from './ClText'

export function ClDuration({
  timestamp,
  addSuffix = true,
}: { timestamp: Date; addSuffix: boolean }) {
  const [distance, setDistance] = useState('')

  const computeDistance = () => {
    return formatDistanceToNowStrict(timestamp, {
      addSuffix,
    })
  }

  useEffect(() => {
    setDistance(computeDistance())

    const timeout = setInterval(() => {
      setDistance(computeDistance())
    }, 30000)

    return () => clearInterval(timeout)
  }, [])

  // Update on focus
  useFocusEffect(() => {
    setDistance(computeDistance())
  })

  return (
    <ClText style={{ fontSize: Typo.sizes.xs.fontSize }} type="helper" dim>
      {distance ?? 'Just now'}
    </ClText>
  )
}
