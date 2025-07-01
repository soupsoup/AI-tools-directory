import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types based on your JSON structure
export interface AITool {
  id?: number
  name: string
  description: string
  categories: string[]
  url: string
  image_url: string
  youtube_url: string
  resources: Resource[]
  created_at: string
}

export interface BlogPost {
  id?: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  author: string
  categories: string[]
  tags: string[]
  published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Resource {
  title: string
  url: string
}

export interface Category {
  id: number
  name: string
  created_at: string
} 