"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Users, Eye, ChevronLeft, ChevronRight, Wifi, WifiOff, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Mock data for current users with dynamic online status
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
        firstName: 'Yuki',
        lastName: 'Tanaka',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Tokyo'
      },
      {
        id: '4',
        username: 'MysteryMaster',
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Dubai'
      },
      {
        id: '5',
        username: 'BoxExplorer',
        firstName: 'Sophie',
        lastName: 'Anderson',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Sydney'
      },
      {
        id: '6',
        username: 'PrizeHunter',
        firstName: 'Marie',
        lastName: 'Dubois',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Paris'
      },
      {
        id: '7',
        username: 'LuckyStreak',
        firstName: 'Klaus',
        lastName: 'Mueller',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Berlin'
      },
      {
        id: '8',
        username: 'BoxAdventurer',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        avatar: '/api/placeholder/32/32',
        isOnline: true,
        location: 'Miami'
      }
    ];

    setUsers(mockUsers);
    setOnlineCount(mockUsers.filter(user => user.isOnline).length);

    // Random timer for online users (simulate users coming online/offline)
    const interval = setInterval(() => {
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => {
          // Random chance to change online status (5% chance every 30 seconds)
          if (Math.random() < 0.05) {
            return { ...user, isOnline: !user.isOnline };
          }
          return user;
        });
        
        // Update online count
        const newOnlineCount = updatedUsers.filter(user => user.isOnline).length;
        setOnlineCount(newOnlineCount);
        
        return updatedUsers;
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('[data-drag-handle]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - (sidebarRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (sidebarRef.current?.offsetHeight || 0);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleHide = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={sidebarRef}
      className="fixed z-50"
      style={{
        left: position.x || 'auto',
        right: position.x ? 'auto' : '1rem',
        top: position.y || '50%',
        transform: position.y ? 'none' : 'translateY(-50%)',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={cn(
        "bg-black/95 border border-gray-700 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl",
        isExpanded ? "w-64" : "w-16",
        isDragging && "shadow-2xl"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div 
              data-drag-handle
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-800 transition-colors"
            >
              <GripVertical className="w-3 h-3 text-gray-400" />
            </div>
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
