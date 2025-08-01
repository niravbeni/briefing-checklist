'use client'

import { useState } from 'react'
import BriefingCard from '@/components/BriefingCard'
import TodoSection from '@/components/TodoSection'
import PrinciplesEditor from '@/components/PrinciplesEditor'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { servicePrinciples as defaultPrinciples } from '@/data/service-principles'

export default function Home() {
  const [showEditor, setShowEditor] = useState(false)
  const [servicePrinciples, setServicePrinciples] = useState(defaultPrinciples)
  const [briefingCards, setBriefingCards] = useState([
    {
      title: "Manifesto",
      description: "When have you seen these things happen?",
      timeEstimate: "2 min",
      items: [
        "Guest recognized by name without asking",
        "Problem solved before escalation",
        "Extra mile service moment",
        "Team collaboration success",
        "Positive guest feedback received"
      ]
    },
    {
      title: "Mission Snapshot", 
      description: "What is happening today? (Switch to CABS overview)",
      timeEstimate: "8 min",
      items: [
        "Review daily occupancy levels",
        "Check special events and VIP arrivals",
        "Review weather and traffic conditions",
        "Confirm staffing levels and schedules",
        "Update on building maintenance or closures"
      ]
    },
    {
      title: "Hot Zones",
      description: "Which meetings deserve special attention: (VIPs, large groups, critical transitions, room flips, A/V resets, catering swaps, security handoffs).",
      timeEstimate: "3 min",
      items: [
        "Identify VIP guests and special requirements",
        "Large group events requiring extra attention",
        "Critical room transitions and setup changes",
        "A/V equipment that needs monitoring",
        "Catering deliveries and setup coordination",
        "Security protocols and access changes"
      ]
    },
    {
      title: "Check-in",
      description: "Anything else that others need to know about your team today?",
      timeEstimate: "5 min",
      items: [
        "Team member updates or schedule changes",
        "Equipment issues or maintenance alerts",
        "Guest feedback or special requests",
        "Upcoming training or meetings",
        "Building policy updates or reminders"
      ]
    }
  ])
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (showEditor) {
    return (
      <PrinciplesEditor
        principles={servicePrinciples}
        onSavePrinciples={setServicePrinciples}
        briefingCards={briefingCards}
        onSaveBriefingCards={setBriefingCards}
        onClose={() => setShowEditor(false)}
      />
    )
  }

  return (
    <div className="h-screen flex flex-col p-3 sm:p-4 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start py-2 sm:py-3 flex-shrink-0 mb-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Daily Briefing Checklist
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
            {currentDate}
          </p>
          
          {/* Discreet settings button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditor(true)}
            className="text-gray-400 hover:text-primary opacity-50 hover:opacity-100 h-8 w-8 transition-all duration-200"
            title="Edit Service Principles"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Cards Grid - Takes up top half */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-6 overflow-hidden" style={{height: '40vh', maxHeight: '40vh'}}>
        {briefingCards.map((card, index) => (
          <BriefingCard
            key={index}
            title={card.title}
            description={card.description}
            timeEstimate={card.timeEstimate}
            items={card.items}
          />
        ))}
        
        {/* Principles Spotlight Card */}
        <BriefingCard
          title="Principles Spotlight"
          description="Get a random prompt"
          timeEstimate="2 min"
          showRandomizer={true}
          randomContent={servicePrinciples}
        />
      </div>

      {/* Todo Section - Takes up bottom half */}
      <div className="flex-1 min-h-0">
        <TodoSection />
      </div>
    </div>
  )
} 