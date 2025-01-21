import { ClPageView } from '@/components/ClPageView'
import { ClTextInput } from '@/components/ClTextInput'

export default function SearchJobs() {
  return (
    <ClPageView id="search-jobs">
      <ClTextInput size="small" readOnly />
    </ClPageView>
  )
}
