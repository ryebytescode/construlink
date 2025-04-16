import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  createJobFields: Partial<CreateJobFields>
  createCompanyFields: Partial<CreateCompanyFields> | null
  selectedRecipientId: string
  selectedJobType: string
  hireRequestFields: Partial<HireFields> | null
}

type Action = {
  setCreateJobFields: (fields: Partial<CreateJobFields>) => void
  setCreateCompanyFields: (fields: Partial<CreateCompanyFields> | null) => void
  setSelectedRecipientId: (id: string) => void
  setSelectedJobType: (jobType: string) => void
  setHireRequestFields: (fields: Partial<HireFields>) => void
  reset: () => void
}

const initialState: State = {
  createJobFields: {
    category: 'carpenter',
    description: 'We are looking for a skilled carpenter nearby.',
    employmentType: 'fulltime',
    // isUsingRange: false,
    location: 'Manila',
    postAs: 'individual',
    // rate: '',
    title: 'Carpenter needed right now ASAP',
  },
  // createCompanyFields: {
  //   name: 'ABC Construction Ltd.',
  //   description: 'A 50 year old company in Odiongan, Romblon',
  //   size: 'medium',
  //   location: 'Odiongan, Romblon',
  // },
  createCompanyFields: null,
  selectedRecipientId: '',
  selectedJobType: '',
  hireRequestFields: null,
}

export const useFormStore = create<State & Action>()(
  immer((set) => ({
    ...initialState,
    setCreateJobFields: (fields) => set({ createJobFields: fields }),
    setCreateCompanyFields: (fields) => set({ createCompanyFields: fields }),
    setSelectedRecipientId: (id) => set({ selectedRecipientId: id }),
    setSelectedJobType: (jobType) => set({ selectedJobType: jobType }),
    setHireRequestFields: (fields) => set({ hireRequestFields: fields }),
    reset: () => set(initialState),
  }))
)
