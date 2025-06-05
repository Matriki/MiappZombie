import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 320, margin: 'auto', padding: 20 }}>
      <h2>Iniciar sesión / Registrarse</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <button onClick={handleLogin} disabled={loading} style={{ marginRight: 10 }}>
        {loading ? 'Cargando...' : 'Entrar'}
      </button>
      <button onClick={handleSignup} disabled={loading}>
        {loading ? 'Cargando...' : 'Registrar'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}


