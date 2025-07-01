import { supabase, AITool, BlogPost, Category } from './supabase'
import { createClient } from '@supabase/supabase-js'
import { createClient as createBrowserClient } from './supabase-client'

export class DataService {
  // Get Supabase client (for server-side usage)
  private static getServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    // Use service role key if available, otherwise fallback to anonymous key
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    return createClient(supabaseUrl, supabaseKey)
  }

  // Get client-side Supabase client with auth
  private static getAuthClient() {
    return createBrowserClient()
  }

  // Fetch all tools with optional filtering
  static async getTools(filters?: {
    category?: string
    search?: string
    sortBy?: 'popular' | 'recent' | 'rated'
  }): Promise<AITool[]> {
    let query = supabase
      .from('ai_tools')
      .select('*')

    if (filters?.category && filters.category !== 'all') {
      query = query.contains('categories', [filters.category])
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'recent':
        query = query.order('created_at', { ascending: false })
        break
      case 'rated':
        // You might want to add a rating field later
        query = query.order('name', { ascending: true })
        break
      default:
        query = query.order('name', { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tools:', error)
      return []
    }

    return data || []
  }

  // Get unique categories from tools
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('categories')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    const categoriesSet = new Set<string>()
    data?.forEach(tool => {
      tool.categories?.forEach((category: string) => {
        categoriesSet.add(category)
      })
    })

    return Array.from(categoriesSet).sort()
  }

  // Get a single tool by ID (client-side)
  static async getTool(id: number): Promise<AITool | null> {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching tool:', error)
      return null
    }

    return data
  }

  // Get a single tool by ID (server-side with service role)
  static async getToolServer(id: number): Promise<AITool | null> {
    try {
      const serverClient = this.getServerClient()
      
      const { data, error } = await serverClient
        .from('ai_tools')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching tool:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error creating server client:', err)
      // Fallback to regular client if server client fails
      return this.getTool(id)
    }
  }

  // Add a new tool (requires authentication)
  static async addTool(tool: Omit<AITool, 'id' | 'created_at'>): Promise<AITool | null> {
    const client = this.getAuthClient()
    
    const { data, error } = await client
      .from('ai_tools')
      .insert([{
        ...tool,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding tool:', error)
      return null
    }

    return data
  }

  // Update a tool (requires authentication)
  static async updateTool(id: number, updates: Partial<AITool>): Promise<AITool | null> {
    const client = this.getAuthClient()
    
    const { data, error } = await client
      .from('ai_tools')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tool:', error)
      return null
    }

    return data
  }

  // Delete a tool (requires authentication)
  static async deleteTool(id: number): Promise<boolean> {
    const client = this.getAuthClient()
    
    const { error } = await client
      .from('ai_tools')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tool:', error)
      return false
    }

    return true
  }

  // ===== BLOG POST OPERATIONS ===== //

  // Fetch all blog posts with optional filtering
  static async getBlogPosts(filters?: {
    category?: string
    search?: string
    sortBy?: 'recent' | 'popular' | 'alphabetical'
    published?: boolean
  }): Promise<BlogPost[]> {
    let query = supabase
      .from('blog_posts')
      .select('*')

    // Filter by published status (default to published only for public view)
    if (filters?.published !== undefined) {
      query = query.eq('published', filters.published)
    } else {
      query = query.eq('published', true)
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.contains('categories', [filters.category])
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`
      )
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'recent':
        query = query.order('published_at', { ascending: false })
        break
      case 'popular':
        // You might want to add a view count field later
        query = query.order('created_at', { ascending: false })
        break
      case 'alphabetical':
        query = query.order('title', { ascending: true })
        break
      default:
        query = query.order('published_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
      return []
    }

    return data || []
  }

  // Get a single blog post by ID
  static async getBlogPost(id: number): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return null
    }

    return data
  }

  // Get a single blog post by slug
  static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching blog post by slug:', error)
      return null
    }

    return data
  }

  // Add a new blog post (requires authentication)
  static async addBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> {
    const client = this.getAuthClient()
    const now = new Date().toISOString()
    
    const { data, error } = await client
      .from('blog_posts')
      .insert([{
        ...post,
        created_at: now,
        updated_at: now,
        published_at: post.published ? (post.published_at || now) : null
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding blog post:', error)
      return null
    }

    return data
  }

  // Update a blog post (requires authentication)
  static async updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const client = this.getAuthClient()
    const now = new Date().toISOString()
    
    const updateData = {
      ...updates,
      updated_at: now
    }

    // If publishing for the first time, set published_at
    if (updates.published && !updates.published_at) {
      updateData.published_at = now
    }

    const { data, error } = await client
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return null
    }

    return data
  }

  // Delete a blog post (requires authentication)
  static async deleteBlogPost(id: number): Promise<boolean> {
    const client = this.getAuthClient()
    
    const { error } = await client
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return false
    }

    return true
  }

  // Get unique categories from blog posts
  static async getBlogCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('categories')

    if (error) {
      console.error('Error fetching blog categories:', error)
      return []
    }

    const categoriesSet = new Set<string>()
    data?.forEach(post => {
      post.categories?.forEach((category: string) => {
        categoriesSet.add(category)
      })
    })

    return Array.from(categoriesSet).sort()
  }

  // Get unique tags from blog posts
  static async getBlogTags(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')

    if (error) {
      console.error('Error fetching blog tags:', error)
      return []
    }

    const tagsSet = new Set<string>()
    data?.forEach(post => {
      post.tags?.forEach((tag: string) => {
        tagsSet.add(tag)
      })
    })

    return Array.from(tagsSet).sort()
  }

  // Helper function to generate slug from title
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
} 