/**
 * In-memory newsletter subscriber store.
 * Swap this out for Supabase later by replacing the array with DB calls.
 * The `global` trick keeps the data alive across Next.js hot-reloads in dev.
 */

export interface Subscriber {
  id: string
  email: string
  subscribedAt: string
  status: 'active' | 'unsubscribed'
}

declare global {
  // eslint-disable-next-line no-var
  var __newsletterSubscribers: Subscriber[] | undefined
}

if (!global.__newsletterSubscribers) {
  global.__newsletterSubscribers = []
}

export const subscriberStore = {
  getAll: (): Subscriber[] => global.__newsletterSubscribers ?? [],

  find: (email: string): Subscriber | undefined =>
    (global.__newsletterSubscribers ?? []).find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    ),

  add: (email: string): Subscriber => {
    const sub: Subscriber = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
    }
    global.__newsletterSubscribers = [...(global.__newsletterSubscribers ?? []), sub]
    return sub
  },

  remove: (id: string): void => {
    global.__newsletterSubscribers = (global.__newsletterSubscribers ?? []).filter(
      (s) => s.id !== id
    )
  },

  count: (): number => (global.__newsletterSubscribers ?? []).length,
}
