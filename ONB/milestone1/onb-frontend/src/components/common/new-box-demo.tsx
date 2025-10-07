"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNewBoxNotification } from '@/contexts/NewBoxNotificationContext';
import { Gift, Sparkles } from 'lucide-react';
import NewBoxAnimation from './new-box-animation';
import SoundEffectSimulator from './sound-effect-simulator';

const NewBoxDemo: React.FC = () => {
  const { addNewBox, clearNotifications } = useNewBoxNotification();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSoundEffect, setShowSoundEffect] = useState(false);

  const handleAddNewBox = () => {
    setShowAnimation(true);
    setShowSoundEffect(true);
    addNewBox();
  };

  const handleClearNotifications = () => {
    clearNotifications();
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <Button
          onClick={handleAddNewBox}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <Gift className="w-4 h-4" />
          Add New Box
        </Button>
        
        <Button
          onClick={handleClearNotifications}
          variant="outline"
          className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700 py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Clear Notifications
        </Button>
      </div>

      {/* Animation overlay */}
      <NewBoxAnimation 
        trigger={showAnimation} 
        onComplete={handleAnimationComplete}
      />

      {/* Sound effect simulation */}
      <SoundEffectSimulator 
        trigger={showSoundEffect} 
        type="success"
      />
    </>
  );
};

export default NewBoxDemo;
