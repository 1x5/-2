import { createClient } from '@supabase/supabase-js'

// Вставьте сюда ваши данные из Supabase
// 1. Settings → API → Project URL (должен начинаться с https://)
// 2. Settings → API → anon public key (должен быть длинный ключ)
const supabaseUrl = 'https://orrkwxgfoafyenudoqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycmt3eGdmb2FmeWVudWRvdXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzY5MzMsImV4cCI6MjA3NzI1MjkzM30.-nFsID7JgtAKbe6zWkAa22qS23jAIlVXzeo4autujsc'

export const supabase = createClient(supabaseUrl, supabaseKey)

