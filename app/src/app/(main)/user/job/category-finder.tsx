import { ClSpringAnimatedPressable } from '@/components/ClAnimated'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { JobCollection } from '@/services/firebase'
import { useFormStore } from '@/stores/forms'
import { Spacing } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { router } from 'expo-router'
import React from 'react'
import { type Control, useForm, useWatch } from 'react-hook-form'
import { FlatList } from 'react-native'

type QueryField = { query: string }

export default function CategoryFinder() {
  const { control } = useForm<QueryField>()

  return (
    <ClPageView id="search-jobs" scrollable={false}>
      <ControlledTextInput
        control={control}
        name="query"
        textInputOptions={{
          size: 'small',
          placeholder: 'Filter',
          autoCapitalize: 'none',
        }}
      />
      <SearchSuggestions control={control} />
    </ClPageView>
  )
}

interface SearchSuggestionsProps {
  control: Control<QueryField>
}

function SearchSuggestions({ control }: SearchSuggestionsProps) {
  const query = useWatch({ control, name: 'query' }) ?? ''
  const debouncedQuery = useDebounce(query, { wait: 500 })
  const { data: suggestions, refetch } = useQuery({
    queryKey: ['job-categories-query', debouncedQuery],
    queryFn: () =>
      debouncedQuery
        ? JobCollection.filterCategories(debouncedQuery)
        : JobCollection.getJobCategories(),
  })
  const setJobType = useFormStore((state) => state.setSelectedJobType)

  function handlePress(item: { title: string }) {
    setJobType(item.title)
    router.back()
  }

  useUpdateEffect(() => {
    if (debouncedQuery) {
      refetch()
    }
  }, [debouncedQuery])

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <ClSpringAnimatedPressable
          onPress={() => handlePress(item)}
          style={{ paddingVertical: Spacing[2] }}
        >
          <ClText>{item.title}</ClText>
        </ClSpringAnimatedPressable>
      )}
    />
  )
}
