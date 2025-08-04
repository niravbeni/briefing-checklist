'use client'

import { useState, useEffect } from 'react'
import BriefingCard from '@/components/BriefingCard'
import TodoSection from '@/components/TodoSection'
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
      title: "1. Manifesto",
      description: "When have you seen these things happen?",
      type: "manifesto",
      items: [
        { text: "We are one team.", subtext: "We share in each other's victories.", icon: "team" },
        { text: "We bring a growth mindset.", subtext: "Progress over perfection", icon: "growth" },
        { text: "We take charge.", subtext: "Individual ownership, with collective support", icon: "hand" }
      ],
      timeEstimate: "2 min",
      showRandomizer: false
    },
    {
      id: 2,
      title: "2. Overview", 
      description: "What is happening today?",
      type: "overview",
      items: [],
      timeEstimate: "8 min",
      showRandomizer: false
    },
    {
      id: 3,
      title: "3. Hot Zones",
      description: "Which meetings deserve special attention?",
      type: "hot-zones",
      helperText: "Think of VIPs, large group, critical transitions, room flips, A/V resets, catering swaps, security handoffs.",
      items: [],
      timeEstimate: "3 min",
      showRandomizer: false
    },
    {
      id: 4,
      title: "4. Check-in",
      description: "Anything else that the team needs to know today?",
      type: "check-in",
      helperText: "Think of team member updates, equipment issues, guest feedback, policy updates etc.",
      items: [],
      timeEstimate: "5 min", 
      showRandomizer: false
    },
    {
      id: 5,
      title: "5. Principles",
      description: "Answer this question about one of the principles.",
      type: "principles",
      items: [],
      timeEstimate: "2 min",
      showRandomizer: true,
      randomContent: servicePrinciples
    }
  ]

  return (
    <div className="h-screen flex flex-col p-3 sm:p-4 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end py-2 sm:py-3 flex-shrink-0 mb-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Daily Briefing
        </h1>
        <div className="text-xs sm:text-sm text-gray-600 font-normal">
          {getCurrentDate()}
        </div>
      </div>

      {/* Main cards grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 flex-shrink-0"
        style={{ height: '52vh', maxHeight: '52vh', overflow: 'hidden' }}
      >
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
             timer={timers[index]}
             onComplete={handleCardComplete}
             onStartTimer={startTimer}
             formatTime={formatTime}
           />
         ))}
      </div>

      {/* Todo Section */}
      <div className="flex-1 min-h-0">
        <TodoSection />
      </div>
    </div>
  )
} 