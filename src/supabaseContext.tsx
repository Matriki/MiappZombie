import { createContext, useContext, useEffect, useState } from 'react'
import { Session, SupabaseClient } from '@supabase/supabase-js'

const SupabaseContext = createContext<{
  session: Session | null
  supabase: SupabaseClient
} | null>(null)

export const SupabaseProvider = ({ children, client }: any) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SupabaseContext.Provider value={{ session, supabase: client }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('No Supabase context found')
  return context
}

