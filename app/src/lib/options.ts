import type { RadioOption } from '@/components/ClRadio'
import type { SelectInputOption } from '@/components/ClSelectInput'
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

  export const mailAppUrls: Record<string, string> = {
    'gmail.com': 'https://gmail.app.goo.gl',
    'yahoo.com': 'https://mail.yahoo.com',
    'ymail.com': 'https://mail.yahoo.com',
    'myyahoo.com': 'https://mail.yahoo.com',
    'outlook.com': 'https://outlook.live.com/mail/0',
    'hotmail.com': 'https://outlook.live.com/mail/0',
  }

  export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  export const categories: SelectInputOption[] = [
    {
      label: 'Electrician',
      value: 'electrician',
    },
    {
      label: 'Plumber',
      value: 'plumber',
    },
    {
      label: 'Carpenter',
      value: 'carpenter',
    },
    {
      label: 'Mason',
      value: 'mason',
    },
    {
      label: 'Painter',
      value: 'painter',
    },
    {
      label: 'Roofer',
      value: 'roofer',
    },
    {
      label: 'Welder',
      value: 'welder',
    },
    {
      label: 'Tiler',
      value: 'tiler',
    },
    {
      label: 'Steel Worker',
      value: 'steel_worker',
    },
    {
      label: 'Landscaper',
      value: 'landscaper',
    },
    {
      label: 'Excavator',
      value: 'excavator',
    },
    {
      label: 'Surveyor',
      value: 'surveyor',
    },
    {
      label: 'General Laborer',
      value: 'general_laborer',
    },
  ]

  export const employmentTypes: SelectInputOption[] = [
    {
      label: 'Full-time',
      value: 'fulltime',
    },
    {
      label: 'Part-time',
      value: 'parttime',
    },
    {
      label: 'Contract',
      value: 'contract',
    },
  ]

  export const ratePeriods: SelectInputOption[] = [
    {
      label: 'Hourly',
      value: 'hourly',
    },
    {
      label: 'Daily',
      value: 'daily',
    },
    {
      label: 'Weekly',
      value: 'weekly',
    },
    {
      label: 'Monthly',
      value: 'monthly',
    },
    {
      label: 'Unspecified',
      value: '',
    },
  ]

  export const postAs: RadioOption[] = [
    {
      label: 'Individual',
      value: 'individual',
    },
    {
      label: 'Company',
      value: 'company',
    },
  ]

  export const companySizes: SelectInputOption[] = [
    {
      label: 'Micro (less than 10 employees)',
      value: 'micro',
    },
    {
      label: 'Small (10-99 employees)',
      value: 'small',
    },
    {
      label: 'Medium (100-199 employees)',
      value: 'medium',
    },
    {
      label: 'Large (200 or more employees)',
      value: 'large',
    },
  ]
}
