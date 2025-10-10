"use client";

import React, { useState, useEffect } from 'react';
import { Users, Eye, ChevronLeft, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  location?: string;
}

const FloatingUsersSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);

  // Mock data for current users
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'Alex_Mystery',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'New York'
      },
      {
        id: '2',
        username: 'BoxHunter99',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'London'
      },
      {
        id: '3',
        username: 'LuckyWinner',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Tokyo'
      },
      {
        id: '4',
        username: 'MysteryMaster',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Dubai'
      },
      {
        id: '5',
        username: 'BoxExplorer',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Sydney'
      },
      {
        id: '6',
        username: 'PrizeHunter',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Paris'
      },
      {
        id: '7',
        username: 'LuckyStreak',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Berlin'
      },
      {
        id: '8',
        username: 'BoxAdventurer',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Miami'
      }
    ];

    setUsers(mockUsers);
    setOnlineCount(mockUsers.filter(user => user.isOnline).length);
  }, []);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleHide = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-1/2 right-4 z-50 transform translate-y-1/2">
      <div className={cn(
        "bg-black/95 border border-gray-700 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl",
        isExpanded ? "w-64" : "w-16"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-300 animate-pulse" />
            {isExpanded && (
              <div>
                <h3 className="text-white text-sm font-medium">Online Users</h3>
                <p className="text-gray-400 text-xs">{onlineCount} active</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleToggle}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:scale-110"
          >
            {isExpanded ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-3 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
            {users.slice(0, 6).map((user, index) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium hover:bg-gray-500 transition-colors">
                  {user.username.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">{user.username}</div>
                  <div className="text-gray-400 text-xs truncate">{user.location}</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Collapsed State - Single Element Only */}
        {!isExpanded && (
          <div className="p-4 flex items-center justify-center">
            <div className="relative group">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-all duration-200 hover:scale-105">
                <Users className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-xs font-bold text-black">{onlineCount}</span>
              </div>
            </div>
          </div>
        )}
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
