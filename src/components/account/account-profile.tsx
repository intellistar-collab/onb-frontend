"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountProfile() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 0,
    nextLevelExp: 1000,
    boxesOpened: 0,
    itemsWon: 0,
    location: "",
    membershipType: "Free",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/login');
    }
  }, [session, sessionLoading, router]);

  // Calculate join date from session createdAt if available
  const getJoinDate = () => {
    if (session?.user?.createdAt) {
      return new Date(session.user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }
    return "Recently";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.split(" ").map(n => n[0]).join("").toUpperCase();
    }
    if (session?.user?.username) {
      return session.user.username.substring(0, 2).toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const progressPercentage = (userStats.experience / userStats.nextLevelExp) * 100;

  // Show loading skeleton while session is loading
  if (sessionLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <div className="text-center mb-6">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto mb-1" />
          <Skeleton className="h-3 w-28 mx-auto" />
        </div>
        <div className="mb-6">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-24 mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Show message if no session (shouldn't happen due to redirect, but just in case)
  if (!session) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {getUserInitials()}
                </span>
              </div>
            </div>
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full">
            Lv.{userStats.level}
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-1">
          {session.user?.name || session.user?.username || "User"}
        </h2>
        {session.user?.username && (
          <p className="text-sm text-muted-foreground mb-2">@{session.user.username}</p>
        )}
        <p className="text-xs text-muted-foreground">Member since {getJoinDate()}</p>
      </div>

      {/* Experience Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Experience</span>
          <span className="text-sm text-muted-foreground">{userStats.experience}/{userStats.nextLevelExp} XP</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {userStats.nextLevelExp - userStats.experience} XP to next level
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">{userStats.boxesOpened}</div>
          <div className="text-xs text-muted-foreground">Boxes Opened</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary mb-1">{userStats.itemsWon}</div>
          <div className="text-xs text-muted-foreground">Items Won</div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Email:</span>
          <span className="text-foreground">{session.user?.email || "Not provided"}</span>
        </div>
        {userStats.location && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span className="text-foreground">{userStats.location}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Membership:</span>
          <span className="text-primary font-medium">{userStats.membershipType}</span>
        </div>
      </div>
    </div>
  );
}
