"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const BoxDetailSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Spinner Card Skeleton */}
      <Card className="border-white/15 bg-white/5">
        <CardHeader>
          <Skeleton className="h-8 w-64 bg-white/10" />
          <Skeleton className="h-4 w-96 bg-white/10" />
        </CardHeader>
        <CardContent>
          {/* Spinner Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32 bg-white/10" />
              <Skeleton className="h-10 w-20 bg-white/10" />
            </div>
            <Skeleton className="h-12 w-32 bg-white/10" />
          </div>
          
          {/* Spinner Track */}
          <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[220px] shrink-0 rounded-2xl border border-white/10 bg-white/10/50 px-5 py-6">
                  <div className="mb-3 flex items-center justify-between">
                    <Skeleton className="h-5 w-16 bg-white/10" />
                    <Skeleton className="h-4 w-8 bg-white/10" />
                  </div>
                  <Skeleton className="mx-auto mb-4 h-32 w-full rounded-xl bg-white/10" />
                  <div className="space-y-2 text-center">
                    <Skeleton className="h-4 w-24 mx-auto bg-white/10" />
                    <Skeleton className="h-6 w-16 mx-auto bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Box Information and Stats Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Box Information Card */}
        <Card className="border-white/15 bg-white/5">
          <CardHeader>
            <Skeleton className="h-8 w-48 bg-white/10" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-6 w-32 bg-white/10" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Box Stats Card */}
        <Card className="border-white/15 bg-white/5">
          <CardHeader>
            <Skeleton className="h-8 w-32 bg-white/10" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 bg-white/10" />
                <Skeleton className="h-6 w-16 bg-white/10" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* All Items Section */}
      <Card className="border-white/15 bg-white/5">
        <CardHeader>
          <Skeleton className="h-8 w-32 bg-white/10" />
          <Skeleton className="h-4 w-64 bg-white/10" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="group relative">
                {/* Image Container Skeleton */}
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 bg-white/5">
                  <Skeleton className="h-full w-full bg-white/10" />
                  
                  {/* Tier Badge Skeleton */}
                  <div className="absolute top-1 left-1">
                    <Skeleton className="h-4 w-12 bg-white/10" />
                  </div>
                </div>
                
                {/* Item Information Below Image Skeleton */}
                <div className="mt-2 text-center">
                  <Skeleton className="h-3 w-16 mx-auto mb-1 bg-white/10" />
                  <div className="flex items-center justify-center gap-1">
                    <Skeleton className="h-3 w-8 bg-white/10" />
                    <Skeleton className="h-3 w-1 bg-white/10" />
                    <Skeleton className="h-3 w-10 bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BoxDetailSkeleton
