"use client";

import { useState } from "react";

export default function AccountCommunity() {
  const [communityData] = useState({
    userStats: {
      reputation: 850,
      posts: 23,
      likes: 156,
      comments: 89,
      followers: 45,
      following: 32,
      joinedCommunities: 8
    },
    recentActivity: [
      {
        id: 1,
        type: "post",
        content: "Just unboxed an amazing gaming headset from the Tech Box! 🎧",
        timestamp: "2 hours ago",
        likes: 12,
        comments: 3
      },
      {
        id: 2,
        type: "comment",
        content: "Replied to a discussion about rare item drop rates",
        timestamp: "5 hours ago",
        likes: 8,
        comments: 0
      },
      {
        id: 3,
        type: "like",
        content: "Liked a post about mystery box strategies",
        timestamp: "1 day ago",
        likes: 0,
        comments: 0
      },
      {
        id: 4,
        type: "follow",
        content: "Started following @mystery_master",
        timestamp: "2 days ago",
        likes: 0,
        comments: 0
      }
    ],
    communities: [
      {
        id: 1,
        name: "Mystery Box Masters",
        members: 1250,
        description: "Tips, tricks, and strategies for mystery box enthusiasts",
        role: "member",
        joined: "2024-01-10"
      },
      {
        id: 2,
        name: "Rare Item Collectors",
        members: 890,
        description: "Showcase your rare finds and discuss collection strategies",
        role: "moderator",
        joined: "2024-01-05"
      },
      {
        id: 3,
        name: "Gaming Gear Reviews",
        members: 2100,
        description: "Reviews and discussions about gaming equipment",
        role: "member",
        joined: "2023-12-20"
      },
      {
        id: 4,
        name: "Experience Sharers",
        members: 650,
        description: "Share your amazing experiences won from mystery boxes",
        role: "member",
        joined: "2023-12-15"
      }
    ],
    achievements: [
      {
        id: 1,
        name: "First Post",
        description: "Made your first community post",
        icon: "📝",
        earned: true,
        date: "2024-01-10"
      },
      {
        id: 2,
        name: "Popular Poster",
        description: "Get 50+ likes on a single post",
        icon: "❤️",
        earned: true,
        date: "2024-01-12"
      },
      {
        id: 3,
        name: "Helpful Member",
        description: "Help 10 community members",
        icon: "🤝",
        earned: true,
        date: "2024-01-15"
      },
      {
        id: 4,
        name: "Community Leader",
        description: "Become a moderator in a community",
        icon: "👑",
        earned: true,
        date: "2024-01-20"
      },
      {
        id: 5,
        name: "Social Butterfly",
        description: "Follow 50+ community members",
        icon: "🦋",
        earned: false,
        progress: 32,
        target: 50
      },
      {
        id: 6,
        name: "Content Creator",
        description: "Create 100+ posts and comments",
        icon: "🎨",
        earned: false,
        progress: 112,
        target: 100
      }
    ]
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post": return "📝";
      case "comment": return "💬";
      case "like": return "❤️";
      case "follow": return "👥";
      default: return "📌";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "moderator": return "text-purple-500 bg-purple-500/10";
      case "admin": return "text-red-500 bg-red-500/10";
      default: return "text-blue-500 bg-blue-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Community Overview */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">🌟 Community Profile</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{communityData.userStats.reputation}</div>
            <div className="text-sm text-muted-foreground">Reputation</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{communityData.userStats.posts}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-600 mb-1">{communityData.userStats.likes}</div>
            <div className="text-sm text-muted-foreground">Likes Received</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{communityData.userStats.followers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            📝 Create Post
          </button>
          <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
            👥 Find Friends
          </button>
          <button className="bg-muted text-muted-foreground px-6 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors">
            🔍 Explore Communities
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">📊 Recent Activity</h4>
        
        <div className="space-y-3">
          {communityData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
              <div className="text-xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="text-foreground">{activity.content}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{activity.timestamp}</span>
                  {activity.likes > 0 && (
                    <span className="flex items-center gap-1">
                      ❤️ {activity.likes}
                    </span>
                  )}
                  {activity.comments > 0 && (
                    <span className="flex items-center gap-1">
                      💬 {activity.comments}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-primary hover:text-primary/80 transition-colors text-sm">
            View All Activity →
          </button>
        </div>
      </div>

      {/* Communities */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">🏘️ Your Communities</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityData.communities.map((community) => (
            <div key={community.id} className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-foreground">{community.name}</h5>
                  <p className="text-sm text-muted-foreground">{community.members.toLocaleString()} members</p>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${getRoleColor(community.role)}`}>
                  {community.role}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {community.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Joined {community.joined}
                </span>
                <button className="text-primary hover:text-primary/80 transition-colors text-sm">
                  Visit →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Join More Communities
          </button>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">🏆 Community Achievements</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communityData.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-lg border p-4 ${
                achievement.earned
                  ? "border-green-500/20 bg-green-500/10"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h5 className={`font-semibold ${
                    achievement.earned ? "text-green-600" : "text-foreground"
                  }`}>
                    {achievement.name}
                  </h5>
                  {achievement.earned && (
                    <p className="text-xs text-green-500">Earned {achievement.date}</p>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </p>
              
              {!achievement.earned && achievement.progress !== undefined && (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.target}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((achievement.progress! / achievement.target!) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
