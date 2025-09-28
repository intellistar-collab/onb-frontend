"use client"

import React, { useState, useMemo } from "react"
import { ArrowUpDown } from "lucide-react"

import { mockBoxCategories } from "@/constant/box-data"
import { filterBoxes, sortBoxes, type SortOption } from "@/lib/search-utils"
import type { SearchFilters } from "./box-search"
import BoxCard from "./box-card"
import BoxSearch from "./box-search"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const flattenBoxes = () =>
  mockBoxCategories
    .flatMap((category) => category.boxes)

const BoxContent = () => {
  const allBoxes = flattenBoxes()
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
    status: [],
    locations: [],
    priceRange: { min: 0, max: 10000 },
    categories: [],
  })

  // Filter and sort boxes based on current filters and sort option
  const filteredAndSortedBoxes = useMemo(() => {
    const filtered = filterBoxes(allBoxes, searchFilters)
    return sortBoxes(filtered, sortBy)
  }, [allBoxes, searchFilters, sortBy])

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
  }

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'status', label: 'Status (Open First)' },
    { value: 'experience', label: 'Experience (High to Low)' },
    { value: 'odds', label: 'Odds (Best First)' },
  ]

  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Name (A-Z)'

  return (
    <section className="space-y-6">
      {/* Search Component */}
      <BoxSearch 
        onSearch={handleSearch}
        boxes={allBoxes}
        totalResults={filteredAndSortedBoxes.length}
      />

      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-suisse uppercase tracking-[0.3em] text-white/40">
            Mystery box rewards
          </p>
          <h2 className="text-3xl font-pricedown uppercase text-white">
            {searchFilters.query ? 'Search Results' : 'Complete Box Lineup'}
          </h2>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort: {currentSortLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-white/20">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className="text-white hover:bg-white/10"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Results */}
      {filteredAndSortedBoxes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedBoxes.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-xl font-pricedown text-white">No boxes found</h3>
            <p className="text-white/60 font-suisse max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more mystery boxes.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default BoxContent
 