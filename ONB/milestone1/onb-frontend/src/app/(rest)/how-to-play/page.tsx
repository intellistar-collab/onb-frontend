"use client";

import React, { useState, useEffect } from "react";
import { m, AnimatePresence } from "motion/react";
import { howToPlay } from "@/constant/how-to-play";
import { Trophy, Zap, Star, Gift, Rocket, Sparkles, Target, Award } from "lucide-react";
import Link from "next/link";

const HowToPlay = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [showCTA, setShowCTA] = useState(false);
  const [userClosedModal, setUserClosedModal] = useState(false);

  const getStepIcon = (index: number) => {
    const icons = [Rocket, Gift, Zap, Trophy];
    return icons[index] || Star;
  };

  const getStepColor = (index: number) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-blue-500 to-cyan-500", 
      "from-purple-500 to-violet-500",
      "from-yellow-500 to-orange-500"
    ];
    return colors[index] || "from-primary to-secondary";
  };

  // Simple scroll detection for CTA animation
  useEffect(() => {
    const handleScroll = () => {
      // Don't override if user manually closed the modal
      if (userClosedModal) {
        return;
      }

      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Simple trigger: when scrolled 60% of the page
      const scrollPercentage = scrollY / (documentHeight - windowHeight);
      const shouldShowCTA = scrollPercentage > 0.6 || scrollY > 1000;
      
      
      setShowCTA(shouldShowCTA);
    };

    // Simple scroll listener
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    // Fallback: Show CTA after 3 seconds if not triggered by scroll
    const fallbackTimer = setTimeout(() => {
      if (!showCTA && !userClosedModal) {
        setShowCTA(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(fallbackTimer);
    };
  }, [showCTA, userClosedModal]);

  return (
    <>
      <style jsx>{`
        @keyframes emergency-flash {
          0%, 100% { 
            color: #ef4444; 
            text-shadow: 0 0 20px #ef4444, 0 0 40px #ef4444;
            transform: scale(1);
          }
          25% { 
            color: #fbbf24; 
            text-shadow: 0 0 30px #fbbf24, 0 0 60px #fbbf24;
            transform: scale(1.05);
          }
          50% { 
            color: #ef4444; 
            text-shadow: 0 0 20px #ef4444, 0 0 40px #ef4444;
            transform: scale(1);
          }
          75% { 
            color: #f59e0b; 
            text-shadow: 0 0 25px #f59e0b, 0 0 50px #f59e0b;
            transform: scale(1.02);
          }
        }
        
        @keyframes emergency-shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-2px) rotate(-1deg); }
          20% { transform: translateX(2px) rotate(1deg); }
          30% { transform: translateX(-2px) rotate(-1deg); }
          40% { transform: translateX(2px) rotate(1deg); }
          50% { transform: translateX(-1px) rotate(-0.5deg); }
          60% { transform: translateX(1px) rotate(0.5deg); }
          70% { transform: translateX(-1px) rotate(-0.5deg); }
          80% { transform: translateX(1px) rotate(0.5deg); }
          90% { transform: translateX(-1px) rotate(-0.5deg); }
        }
        
        .emergency-text {
          animation: emergency-flash 0.8s infinite, emergency-shake 0.5s infinite;
        }
      `}</style>
      <main className="space-y-0 relative overflow-hidden">

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-0 relative">
              {/* Simple visible text fallback */}

              {/* Animated background particles */}
              <div className="absolute inset-0 pointer-events-none">
                <m.div
                  className="absolute top-0 left-1/4 w-2 h-2 bg-primary/40 rounded-full"
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                    rotate: [0, 360, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <m.div
                  className="absolute top-0 right-1/3 w-1.5 h-1.5 bg-secondary/50 rounded-full"
                  animate={{
                    y: [0, -25, 0],
                    x: [0, -15, 0],
                    opacity: [0.2, 0.9, 0.2],
                    scale: [1, 1.8, 1],
                    rotate: [0, -360, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <m.div
                  className="absolute top-0 left-1/2 w-1 h-1 bg-accent/60 rounded-full"
                  animate={{
                    y: [0, -35, 0],
                    x: [0, 25, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>

              {/* Large Attention-Grabbing Text */}
              <div className="text-3xl md:text-4xl lg:text-5xl text-white max-w-6xl mx-auto leading-tight relative z-10 font-bold">
                <div className="mb-4">
                  Master the art of{" "}
                  <span className="inline-block font-black text-4xl md:text-5xl lg:text-6xl relative emergency-text">
                    MYSTERY BOX
                  </span>
                </div>
                <div className="mb-0">
                  gaming in{" "}
                  <span className="inline-block font-black text-cyan-400 animate-bounce text-4xl md:text-5xl lg:text-6xl">
                    4 SIMPLE STEPS
                  </span>
                </div>
                {/* <div className="text-xl md:text-2xl text-white/90 font-medium">
                  Start your journey to amazing rewards and unforgettable experiences.
                </div> */}
              </div>

              {/* Large Attention-Grabbing Icons */}
              {/* <div className="flex justify-center gap-12 mt-8">
                <div className="animate-bounce">
                  <Sparkles className="h-12 w-12 text-yellow-400" />
                </div>
                <div className="animate-pulse">
                  <Target className="h-12 w-12 text-cyan-400" />
                </div>
                <div className="animate-ping">
                  <Award className="h-12 w-12 text-pink-400" />
                </div>
              </div> */}

            </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-4 sm:px-6 lg:px-8" id="steps-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-2">
            {howToPlay.map((item, index) => {
              const IconComponent = getStepIcon(index);
              const isCompleted = completedSteps.includes(index);
              const isHovered = hoveredStep === index;
              const stepColor = getStepColor(index);
              
              return (
                <div 
                  key={item.title} 
                  className="group"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-3 hover:bg-card/70 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row gap-3">
                      {/* Left Column - Step Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-green-500 shadow-lg shadow-green-500/30' 
                              : isHovered
                              ? `bg-gradient-to-r ${stepColor} shadow-lg`
                              : 'bg-primary'
                          }`}>
                            {isCompleted ? (
                              <Trophy className="h-4 w-4 text-white" />
                            ) : (
                              <IconComponent className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-primary mb-0.5">
                              Step {index + 1}
                            </p>
                            <h3 className="text-lg font-pricedown text-white">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {item.instructions.map((ins, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 border border-primary/30 flex-shrink-0">
                                <span className="text-xs font-bold text-primary">
                                  {String.fromCharCode(65 + i)}
                                </span>
                              </div>
                              <p className="text-white/90 leading-relaxed flex-1 text-sm pt-0.5">
                                {ins.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right Column - CTA */}
                      <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-2 border border-primary/20">
                          <h4 className="text-sm font-semibold text-white mb-1">
                            Ready for this step?
                          </h4>
                          <p className="text-white/70 text-xs mb-2">
                            {index === 0 && "Create your account to start your ONB journey and unlock exclusive rewards."}
                            {index === 1 && "Add funds to your wallet using secure payment methods or cryptocurrency."}
                            {index === 2 && "Explore our curated mystery boxes and discover amazing prizes waiting for you."}
                            {index === 3 && "Check your pack to see your rewards and manage your winnings."}
                          </p>
                          
                          {index === 0 && (
                            <Link 
                              href="/auth/signup" 
                              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                            >
                              <Rocket className="h-3 w-3" />
                              Create Account
                            </Link>
                          )}
                          {index === 1 && (
                            <Link 
                              href="/account/wallet" 
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                            >
                              <Gift className="h-3 w-3" />
                              Go to Wallet
                            </Link>
                          )}
                          {index === 2 && (
                            <Link 
                              href="/box" 
                              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                            >
                              <Zap className="h-3 w-3" />
                              Browse Boxes
                            </Link>
                          )}
                          {index === 3 && (
                            <Link 
                              href="/account/packs" 
                              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                            >
                              <Trophy className="h-3 w-3" />
                              View My Pack
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Enhanced Call to Action Section */}
      <section className="px-4 sm:px-6 lg:px-8" id="cta-section">
        <div className="max-w-7xl mx-auto">
          {/* Modern Professional Modal */}
          {showCTA && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setUserClosedModal(true);
                  setShowCTA(false);
                }
              }}
            >
              <div className="bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full text-center relative shadow-2xl border border-blue-500/30 overflow-hidden">
                {/* Exciting Blue Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/8 to-blue-600/12"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-cyan-400/25 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/25 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-300/20 to-cyan-300/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-400/25 to-indigo-400/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1.5s'}}></div>
                
                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUserClosedModal(true);
                    setShowCTA(false);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-light bg-gray-800/50 hover:bg-gray-700/70 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 z-10 backdrop-blur-sm"
                >
                  ×
                </button>
                
                {/* Exciting Header */}
                <div className="mb-8 relative z-10">
                  <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse relative">
                    <span className="inline-block animate-bounce">You're</span>
                    <span className="inline-block animate-ping mx-2">Ready!</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse opacity-75">
                      You're Ready!
                    </div>
                  </h2>
                  <p className="text-blue-200 text-lg font-medium animate-pulse">
                    Time to unlock amazing rewards!
                  </p>
                </div>
                
                {/* Exciting Stats */}
                <div className="mb-8 relative z-10">
                  <div className="flex justify-center gap-6 mb-6">
                    <div className="text-center group relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 animate-pulse">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                        </div>
                      </div>
                      <div className="text-4xl font-black text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:scale-110 animate-bounce">1000+</div>
                      <div className="text-sm text-gray-400 font-medium">Active Players</div>
                    </div>
                    <div className="text-center group relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 animate-pulse">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
                        </div>
                      </div>
                      <div className="text-4xl font-black text-purple-400 group-hover:text-purple-300 transition-all duration-300 group-hover:scale-110 animate-bounce">50+</div>
                      <div className="text-sm text-gray-400 font-medium">Mystery Boxes</div>
                    </div>
                    <div className="text-center group relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-all duration-300 group-hover:scale-110 animate-pulse">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-yellow-600 rounded-sm"></div>
                        </div>
                      </div>
                      <div className="text-4xl font-black text-yellow-400 group-hover:text-yellow-300 transition-all duration-300 group-hover:scale-110 animate-bounce">24/7</div>
                      <div className="text-sm text-gray-400 font-medium">Support</div>
                    </div>
                  </div>
                </div>
                
                {/* Urgent Action Buttons */}
                <div className="space-y-4 relative z-10">
                  <Link 
                    href="/box"
                    className="group block bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-400 hover:via-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 active:scale-95 relative overflow-hidden animate-pulse"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 via-cyan-300/30 to-blue-300/20 animate-pulse"></div>
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <span className="text-lg font-extrabold animate-bounce">Start Exploring!</span>
                    </div>
                  </Link>
                  
                  <Link 
                    href="/auth/signup"
                    className="group block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-2 border-blue-400 hover:border-blue-300 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/40 transform hover:scale-110 active:scale-95 relative overflow-hidden animate-pulse"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-300/30 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/25 to-blue-400/20 animate-pulse"></div>
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <span className="text-lg font-extrabold animate-bounce">Join Now!</span>
                    </div>
                  </Link>
                </div>
                
                {/* Fun Footer */}
                {/* <div className="mt-8 text-sm text-gray-400 relative z-10">
                  <p className="flex items-center justify-center gap-2">
                    <span className="animate-pulse">✨</span>
                    <span>Ready for your adventure?</span>
                    <span className="animate-pulse">✨</span>
                  </p>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </section>
      </main>
    </>
  );
};

export default HowToPlay;
