'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DataService } from "@/lib/data-service"

interface FiltersProps {
  onFiltersChange: (filters: {
    category?: string
    search?: string
    sortBy?: 'popular' | 'recent' | 'rated'
  }) => void
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rated'>('popular')
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await DataService.getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters()
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [search, category, sortBy])

  const applyFilters = () => {
    setIsLoading(true)
    onFiltersChange({
      search: search.trim() || undefined,
      category: category === 'all' ? undefined : category,
      sortBy
    })
    setTimeout(() => setIsLoading(false), 500) // Small delay for UX
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }

  const handleSortChange = (value: 'popular' | 'recent' | 'rated') => {
    setSortBy(value)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setSortBy('popular')
  }

  return (
    <Card className="p-6 space-y-6 h-fit">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Input 
          placeholder="Search tools..." 
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Most Popular" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="rated">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Button 
          onClick={applyFilters} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Applying...' : 'Apply Filters'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
          disabled={isLoading}
        >
          Clear Filters
        </Button>
      </div>

      {/* Filter Summary */}
      <div className="text-xs text-muted-foreground">
        {search && <div>Search: "{search}"</div>}
        {category !== 'all' && <div>Category: {category}</div>}
        <div>Sort: {
          sortBy === 'popular' ? 'Most Popular' :
          sortBy === 'recent' ? 'Most Recent' : 'A-Z'
        }</div>
      </div>
    </Card>
  )
}

