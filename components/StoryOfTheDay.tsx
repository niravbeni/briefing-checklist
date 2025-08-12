import React from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

const StoryOfTheDay = () => {
  return (
    <Card className="text-white p-4 sm:p-6 mb-4 sm:mb-6 border-none shadow-lg" style={{ backgroundColor: '#730541' }}>
      <div className="flex items-center gap-4">
        {/* Star Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center border border-white border-opacity-30">
            <Image
              src="/star.png"
              alt="Star"
              width={24}
              height={24}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Story of the day (2 min)
          </h2>
          <p className="text-sm sm:text-base text-white text-opacity-90 leading-relaxed">
            What's a standout story from our guest services history that still inspires today?
          </p>
        </div>
      </div>
    </Card>
  )
}

export default StoryOfTheDay 