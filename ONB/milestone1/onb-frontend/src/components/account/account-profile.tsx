"use client";

import { useState } from "react";
import Image from "next/image";

export default function AccountProfile() {
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    username: "alexj_gamer",
    joinDate: "January 2024",
    avatar: "/images/default-avatar.webp",
    level: 18,
    experience: 3250,
    nextLevelExp: 4000,
    location: "San Francisco, CA",
    membershipType: "Premium",
  });

  const progressPercentage = (user.experience / user.nextLevelExp) * 100;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
            </div>
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full">
            Lv.{user.level}
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-1">{user.name}</h2>
        <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
        <p className="text-xs text-muted-foreground">Member since {user.joinDate}</p>
      </div>

      {/* Experience Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Experience</span>
          <span className="text-sm text-muted-foreground">{user.experience}/{user.nextLevelExp} XP</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {user.nextLevelExp - user.experience} XP to next level
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">67</div>
          <div className="text-xs text-muted-foreground">Boxes Opened</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary mb-1">184</div>
          <div className="text-xs text-muted-foreground">Items Won</div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Location:</span>
          <span className="text-foreground">{user.location}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Membership:</span>
          <span className="text-primary font-medium">{user.membershipType}</span>
        </div>
      </div>
    </div>
  );
}
