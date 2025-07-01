'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Youtube, BookOpen } from "lucide-react"
import { DataService } from "@/lib/data-service"
import { AITool } from "@/lib/supabase"
import Link from 'next/link'

interface ToolsGridProps {
  filters?: {
    category?: string
    search?: string
    sortBy?: 'popular' | 'recent' | 'rated'
  }
}

export function ToolsGrid({ filters }: ToolsGridProps) {
  const [tools, setTools] = useState<AITool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true)
        const data = await DataService.getTools(filters)
        setTools(data)
      } catch (err) {
        console.error('Error fetching tools:', err)
        setError('Failed to load tools. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTools()
  }, [filters])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="flex flex-col animate-pulse">
            <CardHeader>
              <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tools found matching your criteria.</p>
      </div>
    )
  }

  // Function to strip HTML tags from description
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Function to get excerpt from description
  const getExcerpt = (text: string, maxLength: number = 150) => {
    const cleanText = stripHtml(text)
    if (cleanText.length <= maxLength) return cleanText
    return cleanText.substr(0, maxLength) + '...'
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <Card key={tool.id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
              <img 
                src={tool.image_url || "/placeholder.svg"} 
                alt={tool.name} 
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                }}
              />
            </div>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{tool.name}</h3>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {tool.categories.slice(0, 2).map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {tool.categories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.categories.length - 2} more
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">
              {getExcerpt(tool.description)}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 mt-auto">
            <div className="flex w-full gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/tool/${tool.id}`} className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Details
                </Link>
              </Button>
              {tool.youtube_url && (
                <Button asChild variant="outline" size="sm">
                  <a 
                    href={tool.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Youtube className="h-3 w-3" />
                    Demo
                  </a>
                </Button>
              )}
            </div>
            {tool.resources && tool.resources.length > 0 && (
              <div className="w-full">
                <p className="text-xs text-muted-foreground mb-1">Resources:</p>
                <div className="flex flex-wrap gap-1">
                  {tool.resources.slice(0, 2).map((resource, index) => (
                    <Button
                      key={index}
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <BookOpen className="h-2 w-2" />
                        {resource.title.length > 20 ? 
                          resource.title.substring(0, 20) + '...' : 
                          resource.title
                        }
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

