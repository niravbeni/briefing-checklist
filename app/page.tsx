'use client'

import { useState } from 'react'
import BriefingCard from '@/components/BriefingCard'
import TodoSection from '@/components/TodoSection'
import { defaultPrinciples } from '@/data/service-principles'

export default function Home() {
  const [servicePrinciples] = useState(defaultPrinciples)

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
      description: "Answer a randomised prompt about one of the principles.",
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
                 {briefingCards.map((card) => (
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