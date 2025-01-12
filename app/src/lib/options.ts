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

  export const mailAppUrls: Record<string, string> = {
    'gmail.com': 'https://gmail.app.goo.gl',
    'yahoo.com': 'https://mail.yahoo.com',
    'ymail.com': 'https://mail.yahoo.com',
    'myyahoo.com': 'https://mail.yahoo.com',
    'outlook.com': 'https://outlook.live.com/mail/0',
    'hotmail.com': 'https://outlook.live.com/mail/0',
  }
}
