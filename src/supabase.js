import { createClient } from '@supabase/supabase-js'
// Cukup gunakan URL dasar project
const supabaseUrl = 'https://nqxynocecuhwnzslaplc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xeHlub2NlY3Vod256c2xhcGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NjU0NTEsImV4cCI6MjA5NzE0MTQ1MX0.Alc58yU3OzSLsV5GIIt5co5ivltRRsmJ8xPuMtOFCa8'

export const supabase = createClient(supabaseUrl, supabaseKey)