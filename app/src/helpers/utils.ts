import { Cl } from '@/lib/options'
import { format } from 'date-fns'

export function formatMoney(value: number) {
  const PHP = Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  })

  return PHP.format(value)
}

export function formatDateTime(
  value: Date,
  mode: 'date' | 'time' | 'datetime' = 'datetime'
) {
  switch (mode) {
    case 'date':
      return format(value, 'MMMM dd, yyyy')
    case 'time':
      return format(value, 'hh:mm a')
    case 'datetime':
      return format(value, 'MMMM dd, yyyy hh:mm a')
    default:
      throw new Error('Invalid mode')
  }
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

export function capitalizeListItems(list: string[]) {
  return list.map(capitalizeFirstLetter).join(', ')
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

export function truncateString(str: string, length: number) {
  if (str.length <= length) return str

  return `${str.slice(0, length)}...`
}
