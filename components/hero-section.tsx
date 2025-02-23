import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function HeroSection() {
  return (
    <div className="text-center space-y-6 py-12 md:py-24">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Find the Perfect AI Tool</h1>
      <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
        Discover and compare hundreds of AI tools to enhance your workflow
      </p>
      <div className="max-w-[500px] mx-auto flex gap-4">
        <Input placeholder="Search AI tools..." className="h-12" />
        <Button size="lg">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>
    </div>
  )
}

