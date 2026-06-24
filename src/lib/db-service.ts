import { isSupabaseConfigured } from './supabase'

/**
 * Wrapper for database calls that falls back to mock data
 * if Supabase is not configured or if the query fails.
 */
export async function fetchWithFallback<T>(
  dbCall: () => Promise<T>,
  mockData: T,
  operationName: string = 'DB Operation'
): Promise<T> {
  if (isSupabaseConfigured()) {
    try {
      return await dbCall()
    } catch (error) {
      console.error(`[${operationName}] Failed. Falling back to mock data. Error:`, error)
      return mockData
    }
  } else {
    // console.warn(`[${operationName}] Supabase not configured. Using mock data.`)
    return mockData
  }
}
