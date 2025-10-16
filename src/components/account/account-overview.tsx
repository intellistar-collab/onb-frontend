"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { profileAPI, UserProfile } from "@/lib/api/account";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, X, Upload, Trash2 } from "lucide-react";

export default function AccountOverview() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock stats for now - these would come from a separate API in the future
  const [stats] = useState({
    totalSpent: 1850.75,
    totalWon: 3420.50,
    winRate: 74,
    favoriteBox: "Elite Gaming Box",
    lastActivity: "1 hour ago",
    currentStreak: 12,
    bestStreak: 23,
    totalBoxesOpened: 67,
    rareItemsWon: 8,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileAPI.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setAvatarLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('avatar', file);

      // For now, we'll use a simple approach - in a real app, you'd upload to a service like Cloudinary
      // and then update the profile with the URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatarUrl = e.target?.result as string;
        
        // Update profile with new avatar URL
        const updatedProfile = await profileAPI.updateProfile({ avatar: avatarUrl });
        setProfile(updatedProfile);
        setAvatarModalOpen(false);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setAvatarLoading(true);
      const updatedProfile = await profileAPI.updateProfile({ avatar: "" });
      setProfile(updatedProfile);
      setAvatarModalOpen(false);
    } catch (error) {
      console.error('Failed to remove avatar:', error);
      alert('Failed to remove avatar. Please try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  // Use real user data or fallback to auth user data
  const user = profile ? {
    email: profile.email || authUser?.email || '',
    username: profile.username || authUser?.username || '',
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    joinDate: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    avatar: profile.avatar || authUser?.avatar || null,
    level: 18, // Mock level - would come from stats API
    experience: 3250, // Mock experience - would come from stats API
    nextLevelExp: 4000, // Mock next level - would come from stats API
    location: profile.location || profile.city || 'Unknown',
    membershipType: authUser?.role === 'ADMIN' ? 'Admin' : 'Premium',
  } : {
    email: authUser?.email || '',
    username: authUser?.username || '',
    firstName: authUser?.firstName || 'User',
    lastName: authUser?.lastName || '',
    joinDate: 'Unknown',
    avatar: authUser?.avatar || null,
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    location: 'Unknown',
    membershipType: authUser?.role === 'ADMIN' ? 'Admin' : 'Standard',
  };

  const progressPercentage = (user.experience / user.nextLevelExp) * 100;
  const profit = stats.totalWon - stats.totalSpent;
  const profitPositive = profit > 0;

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-4 shadow-lg">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-muted"></div>
            <div className="flex-1">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-muted rounded"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-lg" suppressHydrationWarning>
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.firstName}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover rounded-full"
                  suppressHydrationWarning
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center" suppressHydrationWarning>
                  <span className="text-lg font-bold text-primary">
                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
            Lv.{user.level}
          </div>
          
          {/* Avatar Edit Button */}
          <Dialog open={avatarModalOpen} onOpenChange={setAvatarModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -top-1 -right-1 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Change Avatar</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Current Avatar Preview */}
                <div className="flex justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.firstName}
                          width={144}
                          height={144}
                          className="w-full h-full object-cover rounded-full"
                          suppressHydrationWarning
                        />
                      ) : (
                        <div className="w-36 h-36 rounded-full bg-muted flex items-center justify-center" suppressHydrationWarning>
                          <span className="text-6xl font-bold text-primary">
                            {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarLoading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {avatarLoading ? 'Uploading...' : 'Upload New Avatar'}
                  </Button>
                  
                  {user.avatar && (
                    <Button
                      onClick={handleRemoveAvatar}
                      disabled={avatarLoading}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {avatarLoading ? 'Removing...' : 'Remove Avatar'}
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
        </div>
      </div>

      {/* Experience Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-foreground">Experience</span>
          <span className="text-xs text-muted-foreground">{user.experience}/{user.nextLevelExp} XP</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <div className="text-sm text-muted-foreground mb-1">Spent</div>
          <div className="text-lg font-bold text-foreground">${stats.totalSpent.toFixed(0)}</div>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <div className="text-sm text-muted-foreground mb-1">Won</div>
          <div className="text-lg font-bold text-foreground">${stats.totalWon.toFixed(0)}</div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <div className="flex items-center gap-2">
            <div className="w-12 bg-muted rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
            <span className="font-semibold text-foreground text-sm">{stats.winRate}%</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current Streak</span>
          <span className="font-semibold text-secondary">{stats.currentStreak}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Best Streak</span>
          <span className="font-semibold text-primary">{stats.bestStreak}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Rare Items</span>
          <span className="font-semibold text-yellow-500">{stats.rareItemsWon}</span>
        </div>
      </div>

      {/* Net Profit */}
      <div className="pt-3 border-t border-border text-center">
        <div className="text-sm text-muted-foreground mb-1">Net Profit</div>
        <div className={`text-xl font-bold ${profitPositive ? 'text-green-500' : 'text-red-500'}`}>
          {profitPositive ? '+' : ''}${profit.toFixed(0)}
        </div>
      </div>

      {/* Additional Profile Information */}
      {profile && (
        <div className="pt-3 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">Profile Details</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            {user.email && (
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="text-foreground truncate max-w-[150px]">{user.email}</span>
              </div>
            )}
            {profile.address && (
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="text-foreground truncate max-w-[150px]">{profile.address}</span>
              </div>
            )}
            {user.location && user.location !== 'Unknown' && (
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-foreground">📍 {user.location}</span>
              </div>
            )}
            {profile.mobile && (
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="text-foreground">{profile.mobile}</span>
              </div>
            )}
            {profile.gender && (
              <div className="flex justify-between">
                <span>Gender:</span>
                <span className="text-foreground capitalize">{profile.gender}</span>
              </div>
            )}
            {profile.dob && (
              <div className="flex justify-between">
                <span>Age:</span>
                <span className="text-foreground">
                  {Math.floor((new Date().getTime() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                </span>
              </div>
            )}
            {profile.country && (
              <div className="flex justify-between">
                <span>Country:</span>
                <span className="text-foreground">{profile.country}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Member since:</span>
              <span className="text-foreground">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Last updated:</span>
              <span className="text-foreground">{new Date(profile.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
