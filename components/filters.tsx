import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function Filters() {
  return (
    <Card className="p-6 space-y-6 h-fit">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Input placeholder="Search tools..." />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="chatbots">Chatbots</SelectItem>
            <SelectItem value="image">Image Generation</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="coding">Coding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Most Popular" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="rated">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </Card>
  )
}

