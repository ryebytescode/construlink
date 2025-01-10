import type { RadioOption } from '@/components/ClRadio'
import { Role } from './constants'

export namespace Cl {
  export const role: RadioOption[] = [
    {
      label: "I'm a tradesperson",
      value: Role.TRADESPERSON,
    },
    {
      label: "I'm an employer",
      value: Role.EMPLOYER,
    },
  ]
}
