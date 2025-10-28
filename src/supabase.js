import { createClient } from '@supabase/supabase-js'

// Вставьте сюда ваши данные из Supabase
// 1. Settings → API → Project URL
// 2. Settings → API → anon public key
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

