import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://40d5-103-148-232-37.ngrok-free.app'
const supabaseKey = 'YOUR_PUBLIC_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
