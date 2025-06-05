import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpoveykqvpinreccivhe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb3ZleWtxdnBpbnJlY2NpdmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjUwNDYsImV4cCI6MjA2NDcwMTA0Nn0.kZAF5Ges1DyJeVakr_lhGxyQsGBiOR4c0_eW84NpxeQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

