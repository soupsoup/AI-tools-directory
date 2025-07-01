'use client'

import { useState } from 'react'
import { HeroSection } from "@/components/hero-section"
import { ToolsGrid } from "@/components/tools-grid"
import { Filters } from "@/components/filters"

export default function Home() {
  const [filters, setFilters] = useState<{
    category?: string
    search?: string
    sortBy?: 'popular' | 'recent' | 'rated'
  }>({})

  const handleFiltersChange = (newFilters: {
    category?: string
    search?: string
    sortBy?: 'popular' | 'recent' | 'rated'
  }) => {
    setFilters(newFilters)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <HeroSection />
      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        <Filters onFiltersChange={handleFiltersChange} />
        <ToolsGrid filters={filters} />
      </div>
    </div>
  )
}

