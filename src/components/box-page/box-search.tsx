"use client"

import React, { useState } from "react"
import { Search, Filter, X, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import type { BoxStatus, MysteryBox } from "@/constant/box-data"

export interface SearchFilters {
  query: string
  status: BoxStatus[]
  locations: string[]
  priceRange: {
    min: number
    max: number
  }
  categories: string[]
}

interface BoxSearchProps {
  onSearch: (filters: SearchFilters) => void
  boxes: MysteryBox[]
  totalResults: number
}

const BoxSearch: React.FC<BoxSearchProps> = ({ onSearch, boxes, totalResults }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    status: [],
    locations: [],
    priceRange: { min: 0, max: 10000 },
    categories: [],
  })

  // Extract unique values for filter options
  const uniqueLocations = Array.from(new Set(boxes.map(box => box.location)))
  const uniqueCategories = Array.from(new Set(boxes.map(box => box.tag)))
  
  // Price ranges for filtering
  const priceRanges = [
    { label: "Under $500", min: 0, max: 500 },
    { label: "$500 - $1,000", min: 500, max: 1000 },
    { label: "$1,000 - $2,000", min: 1000, max: 2000 },
    { label: "$2,000 - $5,000", min: 2000, max: 5000 },
    { label: "Over $5,000", min: 5000, max: 10000 },
  ]

  const handleSearch = (newQuery?: string) => {
    const query = newQuery !== undefined ? newQuery : searchQuery
    const newFilters = { ...filters, query }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const toggleArrayFilter = (key: 'status' | 'locations' | 'categories', value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    handleFilterChange(key, newArray)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      status: [],
      locations: [],
      priceRange: { min: 0, max: 10000 },
      categories: [],
    }
    setSearchQuery("")
    setFilters(clearedFilters)
    onSearch(clearedFilters)
  }

  const activeFiltersCount = 
    filters.status.length + 
    filters.locations.length + 
    filters.categories.length + 
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <Input
          type="text"
          placeholder="Search mystery boxes by name, location, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          className="pl-10 pr-4 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-white/30"
        />
        <Button
          size="sm"
          onClick={() => handleSearch()}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Search
        </Button>
      </div>

      {/* Filters and Results */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Filter className="mr-2 h-4 w-4" />
                Status
                {filters.status.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {filters.status.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-white/20">
              <DropdownMenuLabel className="text-white">Box Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuCheckboxItem
                checked={filters.status.includes("OPEN")}
                onCheckedChange={() => toggleArrayFilter('status', 'OPEN')}
                className="text-white"
              >
                Open
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.status.includes("COMING SOON")}
                onCheckedChange={() => toggleArrayFilter('status', 'COMING SOON')}
                className="text-white"
              >
                Coming Soon
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Location Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Location
                {filters.locations.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {filters.locations.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-white/20">
              <DropdownMenuLabel className="text-white">Locations</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              {uniqueLocations.map((location) => (
                <DropdownMenuCheckboxItem
                  key={location}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={() => toggleArrayFilter('locations', location)}
                  className="text-white"
                >
                  {location}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Category
                {filters.categories.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {filters.categories.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-white/20">
              <DropdownMenuLabel className="text-white">Categories</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              {uniqueCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleArrayFilter('categories', category)}
                  className="text-white"
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Range Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Price
                {(filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-white/20">
              <DropdownMenuLabel className="text-white">Price Range</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              {priceRanges.map((range) => (
                <DropdownMenuItem
                  key={range.label}
                  onClick={() => handleFilterChange('priceRange', { min: range.min, max: range.max })}
                  className="text-white hover:bg-white/10"
                >
                  {range.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem
                onClick={() => handleFilterChange('priceRange', { min: 0, max: 10000 })}
                className="text-white hover:bg-white/10"
              >
                All Prices
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="mr-2 h-4 w-4" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-white/60">
          {totalResults} {totalResults === 1 ? 'box' : 'boxes'} found
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="bg-blue-500/20 text-blue-300 border-blue-500/30"
            >
              Status: {status}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('status', status)}
              />
            </Badge>
          ))}
          {filters.locations.map((location) => (
            <Badge
              key={location}
              variant="secondary"
              className="bg-green-500/20 text-green-300 border-green-500/30"
            >
              Location: {location}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('locations', location)}
              />
            </Badge>
          ))}
          {filters.categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="bg-purple-500/20 text-purple-300 border-purple-500/30"
            >
              Category: {category}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('categories', category)}
              />
            </Badge>
          ))}
          {(filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
            <Badge
              variant="secondary"
              className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
            >
              Price: ${filters.priceRange.min} - ${filters.priceRange.max}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('priceRange', { min: 0, max: 10000 })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export default BoxSearch
