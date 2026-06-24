import { createClient } from '@supabase/supabase-js'

export const isSupabaseConfigured = () => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return (
    !!url &&
    !!key &&
    url !== 'https://placeholder.supabase.co' &&
    key !== 'placeholder_service_role_key'
  )
}

// Transform supabase storage URLs to internal Next.js domain proxy route to circumvent ISP blocks in India/China
export const proxyImageUrl = (url: string): string => {
  if (!url) return url
  // Bypass proxying in local development to prevent Next.js image optimization deadlocks
  if (process.env.NODE_ENV === 'development') return url
  const oldUrl = 'https://zoqbwjvkbiafnslycxsx.supabase.co'
  const newUrl = 'https://aouhgpeonexfofllurlh.supabase.co'
  const target = '/storage/v1/object/public/wcc_media'
  
  let formatted = url
  if (formatted.includes(oldUrl)) {
    formatted = formatted.replace(`${oldUrl}${target}`, '/api/media-proxy')
  }
  if (formatted.includes(newUrl)) {
    formatted = formatted.replace(`${newUrl}${target}`, '/api/media-proxy')
  }
  return formatted
}

// Custom Fetch client options supporting timeout and exponential backoff retries (perfect for UAE, Africa, and China users)
const globalClientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'wcc-garments-platform-optimized',
    },
    // Custom fetch implementation for timeout handling and automated request retries
    fetch: async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
      const MAX_RETRIES = 4;
      const TIMEOUT_MS = 10000; // 10 seconds timeout threshold
      let delay = 1000; // Start backoff delay at 1s

      for (let i = 0; i < MAX_RETRIES; i++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
          const res = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          
          // Retry on 5xx server errors or rate limits (429)
          if ((res.status >= 500 || res.status === 429) && i < MAX_RETRIES - 1) {
            console.warn(`Supabase temporary error (${res.status}). Retrying in ${delay}ms... (Attempt ${i + 1}/${MAX_RETRIES})`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
            continue;
          }
          
          return res;
        } catch (err: any) {
          clearTimeout(timeoutId);
          const isTimeoutOrNetworkError = err.name === 'AbortError' || err.name === 'TypeError' || !err.status;
          
          if (isTimeoutOrNetworkError && i < MAX_RETRIES - 1) {
            console.warn(`Supabase network issue or timeout (${err.message}). Retrying in ${delay}ms... (Attempt ${i + 1}/${MAX_RETRIES})`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
            continue;
          }
          throw err;
        }
      }
      throw new Error('Supabase fetch request failed after maximum retries');
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 20,
    }
  }
}

export const getSupabaseServerClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured')
  }
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    globalClientOptions
  )
}

// For backward compatibility
export const supabase = isSupabaseConfigured()
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      globalClientOptions
    )
  : null
