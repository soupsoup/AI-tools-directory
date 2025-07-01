// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { readFileSync } = require('fs')
const { join } = require('path')

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('Supabase URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing')
console.log('Service Key:', supabaseServiceKey ? '✅ Loaded' : '❌ Missing')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateData() {
  try {
    console.log('Starting data migration...')
    
    // Read the JSON file
    const jsonPath = join(process.cwd(), 'CHOOSEMYAI_Nov29_export.json')
    const jsonData = readFileSync(jsonPath, 'utf8')
    const tools = JSON.parse(jsonData)
    
    console.log(`Found ${tools.length} tools to migrate`)
    
    // Transform data to match our schema
    const transformedTools = tools.map((tool: any) => ({
      name: tool.name,
      description: tool.description,
      categories: tool.categories,
      url: tool.url,
      image_url: tool.image_url,
      youtube_url: tool.youtube_url || '',
      resources: tool.resources || [],
      created_at: tool.created_at
    }))
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('Clearing existing data...')
    const { error: deleteError } = await supabase
      .from('ai_tools')
      .delete()
      .neq('id', 0) // Delete all records
    
    if (deleteError) {
      console.error('Error clearing data:', deleteError)
    }
    
    // Insert data in batches (Supabase has a limit on batch size)
    const batchSize = 100
    let successCount = 0
    
    for (let i = 0; i < transformedTools.length; i += batchSize) {
      const batch = transformedTools.slice(i, i + batchSize)
      
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformedTools.length / batchSize)}...`)
      
      const { data, error } = await supabase
        .from('ai_tools')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`Error inserting batch:`, error)
        continue
      }
      
      successCount += data?.length || 0
    }
    
    console.log(`Migration complete! Successfully migrated ${successCount} tools.`)
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run the migration
migrateData() 