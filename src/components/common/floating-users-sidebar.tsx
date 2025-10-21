"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  location?: string;
}

const FloatingUsersSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Generate shuffled users for display
  const generateDisplayedUsers = (users: User[], count: number): User[] => {
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push({
        ...shuffledUsers[i % shuffledUsers.length],
        id: `${shuffledUsers[i % shuffledUsers.length].id}-${i}`
      });
    }
    return result;
  };

  // Initialize component
  useEffect(() => {
    // Mock user data
    const mockUsers: User[] = [
      { id: '1', username: 'Alex_Mystery', isOnline: true, location: 'New York' },
      { id: '2', username: 'BoxHunter99', isOnline: true, location: 'London' },
      { id: '3', username: 'LuckyWinner', firstName: 'Yuki', lastName: 'Tanaka', isOnline: true, location: 'Tokyo' },
      { id: '4', username: 'MysteryMaster', firstName: 'Ahmed', lastName: 'Al-Rashid', isOnline: true, location: 'Dubai' },
      { id: '5', username: 'BoxExplorer', firstName: 'Sophie', lastName: 'Anderson', isOnline: true, location: 'Sydney' },
      { id: '6', username: 'PrizeHunter', firstName: 'Marie', lastName: 'Dubois', isOnline: true, location: 'Paris' },
      { id: '7', username: 'LuckyStreak', firstName: 'Klaus', lastName: 'Mueller', isOnline: true, location: 'Berlin' },
      { id: '8', username: 'BoxAdventurer', firstName: 'Carlos', lastName: 'Rodriguez', isOnline: true, location: 'Miami' }
    ];

    const initialCount = Math.floor(Math.random() * 900) + 100;
    setOnlineCount(initialCount);
    setDisplayedUsers(generateDisplayedUsers(mockUsers, initialCount));

    // Update online count and shuffle users every 10 seconds
    const interval = setInterval(() => {
      const newOnlineCount = Math.floor(Math.random() * 900) + 100;
      setOnlineCount(newOnlineCount);
      setDisplayedUsers(generateDisplayedUsers(mockUsers, newOnlineCount));
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      ref={sidebarRef}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
    >
      <div className={cn(
        "bg-black/95 border border-gray-700 rounded-lg shadow-lg transition-all duration-500 ease-in-out hover:shadow-xl overflow-hidden",
        isExpanded ? "w-64" : "w-20"
      )}>
        {/* Header */}
        <div className="flex items-center justify-center p-3 border-b border-gray-700">
          {isExpanded ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 transition-all duration-500 ease-in-out">
                <Users className="w-5 h-5 text-gray-300" />
                <div className="transition-all duration-500 ease-in-out">
                  <h3 className="text-white text-sm font-medium">Online Users</h3>
                  <p className="text-gray-400 text-xs">{onlineCount} active</p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 transition-all duration-500 ease-in-out">
              <button
                onClick={handleToggle}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="relative transition-all duration-500 ease-in-out">
                <Users className="w-5 h-5 text-gray-300" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden",
          isExpanded ? "max-h-60 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
        )}>
          <div className="p-3 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
            {displayedUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium hover:bg-gray-500 transition-colors">
                  {(user.firstName || user.username).charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  {user.firstName && (
                    <div className="text-white text-xs font-medium truncate">
                      {`${user.firstName} ${user.lastName}`}
                    </div>
                  )}
                  <div className="text-gray-400 text-xs truncate">{`@${user.username} • ${user.location}`}</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>

      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </div>
  );
};

export default FloatingUsersSidebar;
