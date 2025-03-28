import { Cl } from '@/lib/options'

export function formatMoney(value: number) {
  const PHP = Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  })

  return PHP.format(value)
}

export function formatDateTime(value: Date) {
  return value.toLocaleDateString('en-US', {
    hour12: true,
    weekday: 'short',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function stripNullish<T extends {}>(obj: T): T {
  const newObj = {} as T

  // biome-ignore lint/complexity/noForEach:
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T]

    if (value !== undefined && value !== null) {
      ;(newObj as Record<string, unknown>)[key] = value
    }
  })

  return newObj
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`
}

export function pluralize(str: string, count: number) {
  return count === 1 ? str : `${str}s`
}

export function formatSchedule(schedule: boolean[]) {
  const weekdays = schedule.slice(0, 5).every(Boolean)
  const weekends = schedule.slice(5, 7).every(Boolean)
  const daily = schedule.every(Boolean)

  if (daily) return 'daily'
  if (weekdays && weekends) return 'daily'
  if (weekdays) return 'on weekdays'
  if (weekends) return 'on weekends'

  return schedule
    .map((isAvailable, index) => (isAvailable ? Cl.days[index] : ''))
    .filter(Boolean)
    .join(', ')
}
