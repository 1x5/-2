import { createClient } from '@supabase/supabase-js'

// Ваши данные из Supabase
const supabaseUrl = 'https://orrkwxgfoafyenudoqh.supabase.co'
const supabaseKey = 'sb_publishable_3qDjAT2bYbUcNC9DkkYXEQ_QgkdPvpB'

export const supabase = createClient(supabaseUrl, supabaseKey)

