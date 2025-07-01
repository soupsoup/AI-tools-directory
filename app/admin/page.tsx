'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Youtube,
  Loader2,
  Save,
  FileText,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { DataService } from '@/lib/data-service'
import { AITool, BlogPost } from '@/lib/supabase'

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  
  // Tools state
  const [tools, setTools] = useState<AITool[]>([])
  const [editingTool, setEditingTool] = useState<AITool | null>(null)
  
  // Blog posts state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  
  // Common state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('tools')

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth')
    }
  }, [user, isAdmin, authLoading, router])

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [toolsData, postsData] = await Promise.all([
          DataService.getTools(),
          DataService.getBlogPosts({ published: undefined }) // Get all posts for admin
        ])
        setTools(toolsData)
        setBlogPosts(postsData)
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    if (user && isAdmin) {
      loadData()
    }
  }, [user, isAdmin])

  // Tool handlers
  const handleSaveTool = async (toolData: Partial<AITool>) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingTool) {
        const updatedTool = await DataService.updateTool(editingTool.id!, toolData)
        if (updatedTool) {
          setTools(tools.map(t => t.id === editingTool.id ? updatedTool : t))
          setSuccess('Tool updated successfully!')
        }
      } else {
        const newTool = await DataService.addTool(toolData as Omit<AITool, 'id'>)
        if (newTool) {
          setTools([...tools, newTool])
          setSuccess('Tool added successfully!')
        }
      }
      setEditingTool(null)
    } catch (err) {
      setError('Failed to save tool')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTool = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tool?')) return

    try {
      const success = await DataService.deleteTool(id)
      if (success) {
        setTools(tools.filter(t => t.id !== id))
        setSuccess('Tool deleted successfully!')
      }
    } catch (err) {
      setError('Failed to delete tool')
    }
  }

  // Blog post handlers
  const handleSaveBlogPost = async (postData: Partial<BlogPost>) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingPost) {
        const updatedPost = await DataService.updateBlogPost(editingPost.id!, postData)
        if (updatedPost) {
          setBlogPosts(blogPosts.map(p => p.id === editingPost.id ? updatedPost : p))
          setSuccess('Blog post updated successfully!')
        }
      } else {
        const newPost = await DataService.addBlogPost(postData as Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>)
        if (newPost) {
          setBlogPosts([...blogPosts, newPost])
          setSuccess('Blog post added successfully!')
        }
      }
      setEditingPost(null)
    } catch (err) {
      setError('Failed to save blog post')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBlogPost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const success = await DataService.deleteBlogPost(id)
      if (success) {
        setBlogPosts(blogPosts.filter(p => p.id !== id))
        setSuccess('Blog post deleted successfully!')
      }
    } catch (err) {
      setError('Failed to delete blog post')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage AI tools and blog posts</p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tools.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                {blogPosts.filter(p => p.published).length} published
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(tools.flatMap(t => t.categories)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Demos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tools.filter(t => t.youtube_url).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tools">AI Tools</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Tools Management</h2>
                <p className="text-muted-foreground">View and manage all AI tools in your directory</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => setEditingTool(null)}>
                    <Plus className="h-4 w-4" />
                    Add New Tool
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTool ? 'Edit Tool' : 'Add New Tool'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTool ? 'Update the tool information' : 'Add a new AI tool to the directory'}
                    </DialogDescription>
                  </DialogHeader>
                  <ToolForm 
                    tool={editingTool} 
                    onSave={handleSaveTool} 
                    saving={saving}
                    onCancel={() => setEditingTool(null)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>Links</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tools.map((tool) => (
                        <TableRow key={tool.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <img 
                                src={tool.image_url || '/placeholder.svg'} 
                                alt={tool.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              {tool.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {tool.categories.slice(0, 2).map((cat, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                              {tool.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{tool.categories.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button asChild size="sm" variant="ghost">
                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                              {tool.youtube_url && (
                                <Button asChild size="sm" variant="ghost">
                                  <a href={tool.youtube_url} target="_blank" rel="noopener noreferrer">
                                    <Youtube className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(tool.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => setEditingTool(tool)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Edit Tool</DialogTitle>
                                    <DialogDescription>
                                      Update the tool information
                                    </DialogDescription>
                                  </DialogHeader>
                                  <ToolForm 
                                    tool={editingTool} 
                                    onSave={handleSaveTool} 
                                    saving={saving}
                                    onCancel={() => setEditingTool(null)}
                                  />
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteTool(tool.id!)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Posts Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Blog Management</h2>
                <p className="text-muted-foreground">Create and manage blog posts</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => setEditingPost(null)}>
                    <Plus className="h-4 w-4" />
                    Add New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPost ? 'Update the blog post' : 'Create a new blog post'}
                    </DialogDescription>
                  </DialogHeader>
                  <BlogPostForm 
                    post={editingPost} 
                    onSave={handleSaveBlogPost} 
                    saving={saving}
                    onCancel={() => setEditingPost(null)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{post.title}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {post.excerpt}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{post.author}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {post.published ? (
                                <Badge variant="default" className="gap-1">
                                  <Eye className="h-3 w-3" />
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  <EyeOff className="h-3 w-3" />
                                  Draft
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {post.categories.slice(0, 2).map((cat, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                              {post.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{post.categories.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(post.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => setEditingPost(post)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Edit Blog Post</DialogTitle>
                                    <DialogDescription>
                                      Update the blog post
                                    </DialogDescription>
                                  </DialogHeader>
                                  <BlogPostForm 
                                    post={editingPost} 
                                    onSave={handleSaveBlogPost} 
                                    saving={saving}
                                    onCancel={() => setEditingPost(null)}
                                  />
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteBlogPost(post.id!)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Tool Form Component
function ToolForm({ 
  tool, 
  onSave, 
  saving, 
  onCancel 
}: { 
  tool: AITool | null
  onSave: (data: Partial<AITool>) => void
  saving: boolean
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: tool?.name || '',
    description: tool?.description || '',
    url: tool?.url || '',
    image_url: tool?.image_url || '',
    youtube_url: tool?.youtube_url || '',
    categories: tool?.categories?.join(', ') || '',
    resources: JSON.stringify(tool?.resources || [], null, 2)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const categories = formData.categories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0)
      
      const resources = formData.resources 
        ? JSON.parse(formData.resources)
        : []

      onSave({
        name: formData.name,
        description: formData.description,
        url: formData.url,
        image_url: formData.image_url,
        youtube_url: formData.youtube_url,
        categories,
        resources
      })
    } catch (err) {
      alert('Invalid JSON in resources field')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({...formData, url: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description (HTML)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
          rows={6}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="youtube_url">YouTube URL (optional)</Label>
          <Input
            id="youtube_url"
            type="url"
            value={formData.youtube_url}
            onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="categories">Categories (comma-separated)</Label>
        <Input
          id="categories"
          value={formData.categories}
          onChange={(e) => setFormData({...formData, categories: e.target.value})}
          placeholder="e.g. Image Generator, Code Assistants"
          required
        />
      </div>

      <div>
        <Label htmlFor="resources">Resources (JSON)</Label>
        <Textarea
          id="resources"
          value={formData.resources}
          onChange={(e) => setFormData({...formData, resources: e.target.value})}
          placeholder='[{"title": "Resource Title", "url": "https://example.com"}]'
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {tool ? 'Update' : 'Create'} Tool
        </Button>
      </div>
    </form>
  )
}

// Blog Post Form Component
function BlogPostForm({ 
  post, 
  onSave, 
  saving, 
  onCancel 
}: { 
  post: BlogPost | null
  onSave: (data: Partial<BlogPost>) => void
  saving: boolean
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    featured_image: post?.featured_image || '',
    author: post?.author || '',
    categories: post?.categories?.join(', ') || '',
    tags: post?.tags?.join(', ') || '',
    published: post?.published || false
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: DataService.generateSlug(formData.title)
      }))
    }
  }, [formData.title, post])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const categories = formData.categories
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat.length > 0)
    
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    onSave({
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      featured_image: formData.featured_image || undefined,
      author: formData.author,
      categories,
      tags,
      published: formData.published
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          required
          rows={2}
          placeholder="Brief description of the blog post..."
        />
      </div>

      <div>
        <Label htmlFor="content">Content (HTML/Markdown)</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          required
          rows={12}
          placeholder="Write your blog post content here..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            required
            placeholder="Author name"
          />
        </div>
        <div>
          <Label htmlFor="featured_image">Featured Image URL (optional)</Label>
          <Input
            id="featured_image"
            type="url"
            value={formData.featured_image}
            onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="categories">Categories (comma-separated)</Label>
          <Input
            id="categories"
            value={formData.categories}
            onChange={(e) => setFormData({...formData, categories: e.target.value})}
            placeholder="e.g. AI News, Tutorials, Reviews"
            required
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="e.g. machine learning, productivity, guide"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({...formData, published: checked})}
        />
        <Label htmlFor="published">Publish immediately</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {post ? 'Update' : 'Create'} Post
        </Button>
      </div>
    </form>
  )
} 