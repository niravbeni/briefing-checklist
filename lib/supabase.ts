import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our todos
export interface Todo {
  id: string
  text: string
  completed: boolean
  created_at: string
  user_id?: string
}

export interface CreateTodoInput {
  text: string
  completed?: boolean
} 