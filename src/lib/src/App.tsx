import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { Auth } from './components/Auth'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.getSession().then(({ data: { session } }) => session))
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (!session) {
    return <Auth />
  }

  return (
    <div>
      <h1>Bienvenido, {session.user.email}</h1>
      {/* Aquí va el resto de tu app cuando el usuario está logueado */}
    </div>
  )
}


