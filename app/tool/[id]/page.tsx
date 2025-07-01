import { notFound } from 'next/navigation'
import { DataService } from '@/lib/data-service'
import { ToolDetails } from '@/components/tool-details'

interface ToolPageProps {
  params: {
    id: string
  }
}

// Generate static params for all tools
export async function generateStaticParams() {
  try {
    const tools = await DataService.getTools()
    return tools
      .filter((tool) => tool.id !== undefined)
      .map((tool) => ({
        id: tool.id!.toString(),
      }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const toolId = parseInt(params.id)
  
  if (isNaN(toolId)) {
    notFound()
  }

  const tool = await DataService.getToolServer(toolId)

  if (!tool) {
    notFound()
  }

  return <ToolDetails tool={tool} />
}

export async function generateMetadata({ params }: ToolPageProps) {
  const toolId = parseInt(params.id)
  
  if (isNaN(toolId)) {
    return {
      title: 'Tool Not Found'
    }
  }

  const tool = await DataService.getToolServer(toolId)

  if (!tool) {
    return {
      title: 'Tool Not Found'
    }
  }

  // Strip HTML from description for meta description
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }

  const description = stripHtml(tool.description).substring(0, 160) + '...'

  return {
    title: `${tool.name} | AI Tools Directory`,
    description,
    openGraph: {
      title: tool.name,
      description,
      images: tool.image_url ? [tool.image_url] : [],
    },
  }
} 