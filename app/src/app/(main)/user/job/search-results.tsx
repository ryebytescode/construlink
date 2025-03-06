import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { useRenderCount } from '@/hooks/useRenderCount'
import { JobCollection } from '@/services/firebase'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'

export default function SearchResultsScreen() {
  useRenderCount('SearchResultsScreen')

  const { query, location, employmentType } = useLocalSearchParams<{
    query?: string
    location?: string
    employmentType?: string
  }>()
  const [results, setResults] = useState<Job[] | null>(null)

  useEffect(() => {
    if (query) {
      JobCollection.searchJobPosts(query, { location, employmentType }).then(
        setResults
      )
    }
  }, [query, location, employmentType])

  return (
    <ClPageView id="job-search-results" scrollable={false}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View>
            <ClText>{item.title}</ClText>
          </View>
        )}
      />
    </ClPageView>
  )
}
