import React from 'react'
import { Card } from '@/components/ui/card'
import { Users, Sprout, Hand } from 'lucide-react'

const StoryOfTheDay = () => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'team':
        return <Users className="h-5 w-5 text-white" />
      case 'growth':
        return <Sprout className="h-5 w-5 text-white" />
      case 'hand':
        return <Hand className="h-5 w-5 text-white" />
      default:
        return null
    }
  }

  return (
    <Card className="text-white p-4 sm:p-6 mb-4 sm:mb-6 border-none shadow-lg" style={{ backgroundColor: '#730541' }}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Left side - Header */}
        <div className="lg:w-1/4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            1. Our Culture
          </h2>
          <p className="text-sm sm:text-base text-white text-opacity-90 leading-relaxed">
            When have you seen these things happen?
          </p>
        </div>
        
        {/* Right side - Culture principles */}
        <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon('team')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight mb-1" style={{ color: '#FE30B2' }}>We are one team.</p>
              <p className="text-sm text-white text-opacity-80 leading-relaxed">We share in each other's victories and challenges.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon('growth')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight mb-1" style={{ color: '#FE30B2' }}>We bring a growth mindset.</p>
              <p className="text-sm text-white text-opacity-80 leading-relaxed">In this meeting, we care about progress over perfection.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon('hand')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight mb-1" style={{ color: '#FE30B2' }}>We take charge.</p>
              <p className="text-sm text-white text-opacity-80 leading-relaxed">Individual ownership, with collective support.</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default StoryOfTheDay 