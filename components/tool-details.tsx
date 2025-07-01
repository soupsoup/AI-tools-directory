'use client'

import { useState } from 'react'
import { ArrowLeft, ExternalLink, Youtube, BookOpen, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AITool } from '@/lib/supabase'
import Link from 'next/link'

interface ToolDetailsProps {
  tool: AITool
}

export function ToolDetails({ tool }: ToolDetailsProps) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Link>
          </Button>
        </div>

        {/* Main Tool Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Tool Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-lg overflow-hidden border bg-muted">
                  {!imageError && tool.image_url ? (
                    <img
                      src={tool.image_url}
                      alt={tool.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">AI</div>
                        <div className="text-xs">No Image</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tool Header Info */}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-3xl lg:text-4xl font-bold mb-4">
                  {tool.name}
                </CardTitle>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                  
                  {tool.youtube_url && (
                    <Button asChild variant="outline" size="lg" className="gap-2">
                      <a 
                        href={tool.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Youtube className="h-4 w-4" />
                        Watch Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Separator className="mb-6" />
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About {tool.name}</h2>
              <div 
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: tool.description }}
              />
            </div>

            {/* Resources Section */}
            {tool.resources && tool.resources.length > 0 && (
              <>
                <Separator className="mb-6" />
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Additional Resources
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {tool.resources.map((resource, index) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 group"
                        >
                          <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium group-hover:text-primary transition-colors">
                              {resource.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {resource.url}
                            </p>
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Metadata */}
            <Separator className="mb-6" />
            <div>
              <h2 className="text-2xl font-semibold mb-4">Tool Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Added:</span>
                  <span>{formatDate(tool.created_at)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Categories:</span>
                  <span>{tool.categories.length}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Website:</span>
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-xs"
                  >
                    {tool.url}
                  </a>
                </div>
                {tool.youtube_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <Youtube className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Demo:</span>
                    <a 
                      href={tool.youtube_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Available
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center p-8 bg-muted/50">
          <h3 className="text-xl font-semibold mb-3">Ready to try {tool.name}?</h3>
          <p className="text-muted-foreground mb-6">
            Explore what this AI tool can do for you
          </p>
          <Button asChild size="lg" className="gap-2">
            <a 
              href={tool.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Get Started with {tool.name}
            </a>
          </Button>
        </Card>
      </div>
    </div>
  )
} 