'use client'

import { useState, useEffect } from 'react'
import BriefingCard from '@/components/BriefingCard'
import TodoSection from '@/components/TodoSection'
import StoryOfTheDay from '@/components/StoryOfTheDay'
import { defaultPrinciples } from '@/data/service-principles'

export default function Home() {
  const [servicePrinciples] = useState(defaultPrinciples)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [timers, setTimers] = useState<{[key: number]: {remaining: number, isRunning: boolean, originalTime: number, isReset: boolean}}>({})

  // Get current date formatted nicely
  const getCurrentDate = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }
    return today.toLocaleDateString('en-US', options)
  }

  // Parse time string to seconds
  const parseTimeToSeconds = (timeStr: string) => {
    const minutes = parseInt(timeStr.replace(' min', ''))
    return minutes * 60
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle card completion - move to next card
  const handleCardComplete = (cardIndex: number, isCompleted: boolean) => {
    // Stop timer when card is completed
    if (isCompleted) {
      setTimers(prev => ({
        ...prev,
        [cardIndex]: {
          ...prev[cardIndex],
          isRunning: false
        }
      }))
    }

    if (isCompleted && cardIndex === activeCardIndex) {
      // If this is the last card (principles card), remove highlight
      if (cardIndex === briefingCards.length - 1) {
        setActiveCardIndex(-1) // No card highlighted
      } else {
        // Move to next uncompleted card
        const nextIndex = cardIndex + 1
        if (nextIndex < briefingCards.length) {
          setActiveCardIndex(nextIndex)
        }
      }
    } else if (!isCompleted && cardIndex < activeCardIndex) {
      // If unchecking a previous card, move active back to it
      setActiveCardIndex(cardIndex)
    } else if (!isCompleted && cardIndex === briefingCards.length - 1) {
      // If unchecking the last card, make it active again
      setActiveCardIndex(cardIndex)
    }
  }

  // Start/handle timer for a card
  const startTimer = (cardIndex: number, timeStr: string) => {
    const currentTimer = timers[cardIndex]
    const seconds = parseTimeToSeconds(timeStr)
    
    // If timer is done (remaining === 0), reset to show original time
    if (currentTimer?.remaining === 0 && !currentTimer.isRunning) {
      setTimers(prev => ({
        ...prev,
        [cardIndex]: {
          remaining: seconds,
          isRunning: false,
          originalTime: seconds,
          isReset: true
        }
      }))
    } else {
      // Start or restart the countdown
      setTimers(prev => ({
        ...prev,
        [cardIndex]: {
          remaining: seconds,
          isRunning: true,
          originalTime: seconds,
          isReset: false
        }
      }))
    }
  }

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(key => {
          const cardIndex = parseInt(key)
          const timer = updated[cardIndex]
          if (timer.isRunning && timer.remaining > 0) {
            updated[cardIndex] = {
              ...timer,
              remaining: timer.remaining - 1
            }
          } else if (timer.isRunning && timer.remaining <= 0) {
            updated[cardIndex] = {
              ...timer,
              isRunning: false,
              isReset: false
            }
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Hardcoded briefing cards content
  const briefingCards = [
    {
      id: 1,
      title: "2. Check-in",
      description: "How is it going?",
      type: "check-in",
      helperText: "Think of team member updates, equipment issues, guest feedback, policy updates etc.",
      items: [],
      timeEstimate: "5 min",
      showRandomizer: false
    },
    {
      id: 2,
      title: "3. Overview",
      description: "What is happening today?",
      type: "overview",
      items: [],
      timeEstimate: "10 min",
      showRandomizer: false
    },
    {
      id: 3,
      title: "4. Hot Zones", 
      description: "Which meetings deserve special attention?",
      type: "hot-zones",
      helperText: "Think of VIPs, large group, critical transitions, room flips, A/V resets, catering swaps, security handoffs.",
      items: [],
      timeEstimate: "10 min",
      showRandomizer: false
    },
    {
      id: 4,
      title: "5. Principles",
      description: "Zoom in on one service principle and reflect on how this can show up today.",
      type: "principles",
      items: [],
      timeEstimate: "3 min", 
      showRandomizer: true,
      randomContent: [
        "Anticipate needs",
        "Make it personal",
        "Project calm confidence", 
        "Stay in tune",
        "Perfect the details",
        "Own the journey"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 xl:p-12">
      <div className="max-w-none mx-auto">
      {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end py-1 sm:py-2 mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
            Daily Briefing
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-xs sm:text-sm text-gray-600 font-normal">
              {getCurrentDate()}
            </div>
          </div>
        </div>

        {/* Story of the Day */}
        <div className="mb-4 sm:mb-6">
          <StoryOfTheDay />
        </div>

      {/* Main cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {briefingCards.map((card, index) => (
            <BriefingCard
              key={card.id}
              title={card.title}
              description={card.description}
              type={card.type}
              items={card.items}
              helperText={card.helperText}
              timeEstimate={card.timeEstimate}
              showRandomizer={card.showRandomizer}
              randomContent={card.randomContent || []}
              cardIndex={index}
              isActive={index === activeCardIndex}
              onComplete={handleCardComplete}
            />
          ))}
        </div>

      {/* Key Points Section */}
        <div className="mb-6">
          <TodoSection />
        </div>
      </div>
    </div>
  )
} 