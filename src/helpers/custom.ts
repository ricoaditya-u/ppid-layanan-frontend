// ================================================================================================
// Log
// ================================================================================================
const debug = import.meta.env.VITE_DEBUG === 'true'
export const log = (...data: any[]): void => {
  if (debug) {
    console.log(...data)
  }
}

// ================================================================================================
// Is Dummy Mode
// ================================================================================================
export const isDummyMode = (): boolean => {
  return import.meta.env.VITE_DUMMY === 'true'
}

// ================================================================================================
// Format Date To DD-MM-YYYY
// ================================================================================================
export function formatDateToDDMMYYYY(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}
