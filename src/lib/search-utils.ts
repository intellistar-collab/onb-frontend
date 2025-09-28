import type { MysteryBox } from "@/constant/box-data"
import type { SearchFilters } from "@/components/box-page/box-search"

/**
 * Parse price string to number for comparison
 * e.g., "$1,500" -> 1500
 */
const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/[$,]/g, ''), 10) || 0
}

/**
 * Check if a box matches the search query
 */
const matchesQuery = (box: MysteryBox, query: string): boolean => {
  if (!query.trim()) return true
  
  const searchTerm = query.toLowerCase()
  
  return (
    box.title.toLowerCase().includes(searchTerm) ||
    box.location.toLowerCase().includes(searchTerm) ||
    box.tag.toLowerCase().includes(searchTerm) ||
    box.description.toLowerCase().includes(searchTerm) ||
    box.price.toLowerCase().includes(searchTerm)
  )
}

/**
 * Check if a box matches the status filter
 */
const matchesStatus = (box: MysteryBox, statusFilters: string[]): boolean => {
  if (statusFilters.length === 0) return true
  return statusFilters.includes(box.status)
}

/**
 * Check if a box matches the location filter
 */
const matchesLocation = (box: MysteryBox, locationFilters: string[]): boolean => {
  if (locationFilters.length === 0) return true
  return locationFilters.includes(box.location)
}

/**
 * Check if a box matches the category filter
 */
const matchesCategory = (box: MysteryBox, categoryFilters: string[]): boolean => {
  if (categoryFilters.length === 0) return true
  return categoryFilters.includes(box.tag)
}

/**
 * Check if a box matches the price range filter
 */
const matchesPriceRange = (box: MysteryBox, priceRange: { min: number; max: number }): boolean => {
  const boxPrice = parsePrice(box.price)
  return boxPrice >= priceRange.min && boxPrice <= priceRange.max
}

/**
 * Filter boxes based on search criteria
 */
export const filterBoxes = (boxes: MysteryBox[], filters: SearchFilters): MysteryBox[] => {
  return boxes.filter(box => 
    matchesQuery(box, filters.query) &&
    matchesStatus(box, filters.status) &&
    matchesLocation(box, filters.locations) &&
    matchesCategory(box, filters.categories) &&
    matchesPriceRange(box, filters.priceRange)
  )
}

/**
 * Sort boxes based on different criteria
 */
export type SortOption = 'name' | 'price-asc' | 'price-desc' | 'status' | 'experience' | 'odds'

export const sortBoxes = (boxes: MysteryBox[], sortBy: SortOption): MysteryBox[] => {
  const sortedBoxes = [...boxes]
  
  switch (sortBy) {
    case 'name':
      return sortedBoxes.sort((a, b) => a.title.localeCompare(b.title))
    
    case 'price-asc':
      return sortedBoxes.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    
    case 'price-desc':
      return sortedBoxes.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
    
    case 'status':
      return sortedBoxes.sort((a, b) => {
        if (a.status === 'OPEN' && b.status === 'COMING SOON') return -1
        if (a.status === 'COMING SOON' && b.status === 'OPEN') return 1
        return 0
      })
    
    case 'experience':
      return sortedBoxes.sort((a, b) => b.experience - a.experience)
    
    case 'odds':
      return sortedBoxes.sort((a, b) => {
        const aOdds = parseFloat(a.percentage.replace('%', ''))
        const bOdds = parseFloat(b.percentage.replace('%', ''))
        return bOdds - aOdds // Higher odds first
      })
    
    default:
      return sortedBoxes
  }
}

/**
 * Get search suggestions based on query
 */
export const getSearchSuggestions = (boxes: MysteryBox[], query: string, limit = 5): string[] => {
  if (!query.trim()) return []
  
  const searchTerm = query.toLowerCase()
  const suggestions = new Set<string>()
  
  boxes.forEach(box => {
    // Add matching titles
    if (box.title.toLowerCase().includes(searchTerm)) {
      suggestions.add(box.title)
    }
    
    // Add matching locations
    if (box.location.toLowerCase().includes(searchTerm)) {
      suggestions.add(box.location)
    }
    
    // Add matching tags
    if (box.tag.toLowerCase().includes(searchTerm)) {
      suggestions.add(box.tag)
    }
  })
  
  return Array.from(suggestions).slice(0, limit)
}
