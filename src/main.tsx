import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // <-- esto es nuevo, para que cargue Tailwind y tus estilos

import App from './app'
import { createClient } from '@supabase/supabase-js'
import { SupabaseProvider } from './supabaseContext'

const supabaseUrl = 'https://rpoveykqvpinreccivhe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb3ZleWtxdnBpbnJlY2NpdmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjUwNDYsImV4cCI6MjA2NDcwMTA0Nn0.kZAF5Ges1DyJeVakr_lhGxyQsGBiOR4c0_eW84NpxeQ'

const supabase = createClient(supabaseUrl, supabaseKey)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SupabaseProvider client={supabase}>
      <App />
    </SupabaseProvider>
  </React.StrictMode>
)

