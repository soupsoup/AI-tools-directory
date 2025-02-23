import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp } from "lucide-react"

export function ToolsGrid() {
  const tools = [
    {
      id: 1,
      name: "ChatGPT",
      description: "Advanced language model for natural conversations and content generation",
      category: "Chatbot",
      rating: 4.8,
      votes: 1250,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "DALL-E",
      description: "AI image generation from textual descriptions",
      category: "Image Generation",
      rating: 4.7,
      votes: 980,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Jasper",
      description: "AI writing assistant for marketing and content creation",
      category: "Writing",
      rating: 4.6,
      votes: 750,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <Card key={tool.id} className="flex flex-col">
          <CardHeader>
            <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
              <img src={tool.image || "/placeholder.svg"} alt={tool.name} className="object-cover w-full h-full" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{tool.name}</h3>
              <Badge variant="secondary">{tool.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm">{tool.rating}</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm text-muted-foreground">{tool.votes}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

