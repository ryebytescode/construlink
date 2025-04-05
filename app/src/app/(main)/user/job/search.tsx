import { ClSpringAnimatedPressable } from '@/components/ClAnimated'
import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { SearchJobSchema } from '@/lib/schemas'
import { JobCollection } from '@/services/firebase'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { router } from 'expo-router'
import React from 'react'
import {
  type Control,
  type UseFormSetValue,
  useForm,
  useWatch,
} from 'react-hook-form'
import { FlatList } from 'react-native'

const defaultValues: SearchJobFields = {
  query: '',
  location: '',
  employmentType: '',
}

export default function JobSearchScreen() {
  const { control, setValue, getValues } = useForm<Partial<SearchJobFields>>({
    defaultValues,
    resolver: zodResolver(SearchJobSchema),
  })

  function handleSearch() {
    router.push({
      pathname: '/user/job/search-results',
      params: { query: getValues('query') },
    })
  }

  return (
    <ClPageView id="search-jobs" scrollable={false}>
      <ControlledTextInput
        control={control}
        name="query"
        textInputOptions={{
          size: 'small',
          placeholder: 'Search',
          autoFocus: true,
          autoCapitalize: 'none',
        }}
      />
      <ClButton onPress={handleSearch} text="Search" />
      <SearchSuggestions control={control} setQueryInput={setValue} />
    </ClPageView>
  )
}

interface SearchSuggestionsProps {
  control: Control<Partial<SearchJobFields>>
  setQueryInput: UseFormSetValue<Partial<SearchJobFields>>
}

function SearchSuggestions({ control, setQueryInput }: SearchSuggestionsProps) {
  const query = useWatch({ control, name: 'query' }) ?? ''
  const debouncedQuery = useDebounce(query, { wait: 500 })
  const { data: suggestions, refetch } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => JobCollection.filterCategories(debouncedQuery),
    enabled: false,
  })

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
          onPress={() => setQueryInput('query', item.title)}
        >
          <ClText>{item.title}</ClText>
        </ClSpringAnimatedPressable>
      )}
    />
  )
}
