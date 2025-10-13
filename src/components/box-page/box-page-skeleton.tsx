import { Skeleton } from "@/components/ui/skeleton"

const BoxPageSkeleton = () => {
  return (
    <main>
      {/* Hot Picks Section Skeleton */}
      <section className="mt-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-16 w-64 mx-auto mb-3 bg-white/10" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/10" />
          </div>
          <div className="relative">
            {/* Carousel Skeleton */}
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[85%] sm:w-[45%] md:w-[28%] lg:w-[20%]">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    {/* Box Image Skeleton */}
                    <Skeleton className="aspect-square w-full rounded-xl mb-4 bg-white/10" />
                    
                    {/* Box Title Skeleton */}
                    <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />
                    
                    {/* Box Price Skeleton */}
                    <Skeleton className="h-5 w-1/2 mb-3 bg-white/10" />
                    
                    {/* Box Stats Skeleton */}
                    <div className="flex justify-between items-center mb-4">
                      <Skeleton className="h-4 w-16 bg-white/10" />
                      <Skeleton className="h-4 w-12 bg-white/10" />
                    </div>
                    
                    {/* Button Skeleton */}
                    <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Boxes Section Skeleton */}
      <section className="container mx-auto px-4 mt-10">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-80 mx-auto mb-3 bg-white/10" />
          <Skeleton className="h-px w-24 mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-8 w-48 mx-auto bg-white/10" />
        </div>
        
        {/* Categories Skeleton */}
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              {/* Category Header Skeleton */}
              <div className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-full bg-white/10" />
                <Skeleton className="h-8 w-48 bg-white/10" />
                <Skeleton className="h-6 w-20 bg-white/10" />
              </div>
              
              {/* Category Description Skeleton */}
              <Skeleton className="h-4 w-96 bg-white/10" />
              
              {/* Boxes Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, boxIndex) => (
                  <div key={boxIndex} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    {/* Box Image Skeleton */}
                    <Skeleton className="aspect-square w-full rounded-xl mb-4 bg-white/10" />
                    
                    {/* Box Title Skeleton */}
                    <Skeleton className="h-5 w-3/4 mb-2 bg-white/10" />
                    
                    {/* Box Price Skeleton */}
                    <Skeleton className="h-4 w-1/2 mb-3 bg-white/10" />
                    
                    {/* Box Stats Skeleton */}
                    <div className="flex justify-between items-center mb-4">
                      <Skeleton className="h-3 w-12 bg-white/10" />
                      <Skeleton className="h-3 w-10 bg-white/10" />
                    </div>
                    
                    {/* Button Skeleton */}
                    <Skeleton className="h-9 w-full rounded-lg bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Section Skeleton */}
      <section className="mt-16">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="text-center">
              <Skeleton className="h-12 w-80 mx-auto mb-4 bg-white/10" />
              <Skeleton className="h-6 w-96 mx-auto mb-6 bg-white/10" />
              <Skeleton className="h-12 w-48 mx-auto bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* New Box Section Skeleton */}
      <section className="mt-16">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="text-center">
              <Skeleton className="h-10 w-64 mx-auto mb-4 bg-white/10" />
              <Skeleton className="h-5 w-80 mx-auto mb-6 bg-white/10" />
              <Skeleton className="h-10 w-40 mx-auto bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default BoxPageSkeleton
