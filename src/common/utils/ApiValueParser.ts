export const toStringValue = (value: any): string => {
  return value === undefined || value === null ? '' : String(value)
}

export const toNullableString = (value: any): string | null => {
  return value === undefined || value === null || value === '' ? null : String(value)
}

export const toNumberValue = (value: any, fallback = 0): number => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

export const toNullableNumber = (value: any): number | null => {
  if (value === undefined || value === null || value === '') return null
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

export const toBooleanValue = (value: any): boolean => {
  return value === true || value === 1 || value === '1' || value === 'true'
}
