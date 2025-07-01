# Supabase Setup Guide

This guide will help you set up Supabase for your AI Tools Directory project.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. The project dependencies installed (`npm install`)

## Step 1: Create a New Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "ai-tools-directory")
5. Enter a database password (save this securely)
6. Choose a region closest to your users
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (under "Config")
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys") - Keep this secret!

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root with these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Never commit the `.env.local` file to version control. It's already in your `.gitignore`.

## Step 4: Create the Database Schema

In your Supabase dashboard, go to the SQL Editor and run this SQL:

```sql
-- Create the ai_tools table
CREATE TABLE public.ai_tools (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    categories TEXT[] NOT NULL DEFAULT '{}',
    url TEXT NOT NULL,
    image_url TEXT,
    youtube_url TEXT DEFAULT '',
    resources JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow read access to all users
CREATE POLICY "Allow public read access" ON public.ai_tools
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_ai_tools_categories ON public.ai_tools USING GIN (categories);
CREATE INDEX idx_ai_tools_name ON public.ai_tools (name);
CREATE INDEX idx_ai_tools_created_at ON public.ai_tools (created_at DESC);

-- Create a full-text search index
CREATE INDEX idx_ai_tools_search ON public.ai_tools 
USING GIN (to_tsvector('english', name || ' ' || description));

-- Create the blog_posts table
CREATE TABLE blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    featured_image TEXT,
    author TEXT NOT NULL,
    categories TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_categories ON blog_posts USING GIN(categories);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_author ON blog_posts(author);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);

-- Enable full-text search for blog posts
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(to_tsvector('english', title || ' ' || content || ' ' || excerpt));

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Import Your Data

Run the migration script to import your JSON data:

```bash
npm run migrate
```

This will:
1. Read the `CHOOSEMYAI_Nov29_export.json` file
2. Transform the data to match the database schema
3. Insert all tools into the Supabase database

## Step 6: Verify the Setup

1. Go to your Supabase dashboard
2. Navigate to the Table Editor
3. Select the `ai_tools` table
4. You should see all your tools imported

## Database Schema

### ai_tools table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key, auto-incrementing |
| name | TEXT | Tool name (required) |
| description | TEXT | HTML description of the tool (required) |
| categories | TEXT[] | Array of category strings |
| url | TEXT | Main website URL (required) |
| image_url | TEXT | URL to tool's image/logo |
| youtube_url | TEXT | YouTube demo/tutorial URL |
| resources | JSONB | Array of resource objects with title and url |
| created_at | TIMESTAMP | When the record was created |

### Resource Object Structure

```json
{
  "title": "Resource Title",
  "url": "https://example.com/resource"
}
```

### blog_posts table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key, auto-incrementing |
| title | TEXT | Blog post title (required) |
| slug | TEXT | Unique slug for the blog post (required) |
| content | TEXT | Blog post content (required) |
| excerpt | TEXT | Blog post excerpt |
| featured_image | TEXT | URL to the blog post's featured image |
| author | TEXT | Blog post author |
| categories | TEXT[] | Array of category strings |
| tags | TEXT[] | Array of tag strings |
| published | BOOLEAN | Whether the blog post is published |
| published_at | TIMESTAMP | When the blog post was published |
| created_at | TIMESTAMP | When the blog post was created |
| updated_at | TIMESTAMP | When the blog post was last updated |

## Security

The table has Row Level Security (RLS) enabled with a policy that allows public read access. This means:
- Anyone can read the tools data
- No one can modify data without proper authentication
- Perfect for a public directory

## Performance

The setup includes several indexes for optimal performance:
- GIN index on categories for fast category filtering
- Index on name for sorting
- Index on created_at for recent sorting
- Full-text search index for search functionality

## Troubleshooting

### Migration fails with "Invalid API key"
- Check that your environment variables are correctly set
- Ensure you're using the service_role key for the migration script

### Data not appearing in the app
- Verify the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Check the browser console for any errors
- Ensure RLS policies are correctly set

### Search not working
- Verify the full-text search index was created
- Test search queries directly in the SQL Editor

## Development

To start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000 