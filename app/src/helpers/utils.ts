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
