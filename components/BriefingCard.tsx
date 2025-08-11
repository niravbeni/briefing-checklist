'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RefreshCw, RotateCcw, Users, Sprout, Hand, RotateCw } from 'lucide-react'

interface BriefingCardProps {
  title: string
  description: string
  type?: string
  items?: any[]
  helperText?: string
  timeEstimate: string
  showRandomizer?: boolean
  randomContent?: string[]
  cardIndex: number
  isActive: boolean
  timer?: {remaining: number, isRunning: boolean, originalTime: number, isReset: boolean}
  onComplete: (cardIndex: number, isCompleted: boolean) => void
  onStartTimer: (cardIndex: number, timeStr: string) => void
  formatTime: (seconds: number) => string
}

export default function BriefingCard({
  title,
  description,
  type,
  items = [],
  helperText,
  timeEstimate,
  showRandomizer = false,
  randomContent = [],
  cardIndex,
  isActive,
  timer,
  onComplete,
  onStartTimer,
  formatTime
}: BriefingCardProps) {
  const [completed, setCompleted] = useState(false)
  const [itemsChecked, setItemsChecked] = useState<boolean[]>([])
  const [currentRandomContent, setCurrentRandomContent] = useState('')
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by only setting random content on client
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && randomContent.length > 0) {
      setCurrentRandomContent(randomContent[Math.floor(Math.random() * randomContent.length)])
    }
  }, [randomContent])

  useEffect(() => {
    setItemsChecked(new Array(items.length).fill(false))
  }, [items])

  const handleRefresh = () => {
    if (randomContent.length > 1) {
      const availableContent = randomContent.filter(content => content !== currentRandomContent);
      const randomIndex = Math.floor(Math.random() * availableContent.length);
      setCurrentRandomContent(availableContent[randomIndex]);
    }
  }

  const handleItemCheck = (index: number, checked: boolean) => {
    const newItemsChecked = [...itemsChecked]
    newItemsChecked[index] = checked
    setItemsChecked(newItemsChecked)
    
    // Update main completed state based on all items
    const allChecked = newItemsChecked.every(item => item)
    setCompleted(allChecked)
    
    // Notify parent component about completion
    onComplete(cardIndex, allChecked)
  }

  const handleMainCheck = (checked: boolean) => {
    setCompleted(checked)
    // Also check/uncheck all sub-items
    const newItemsChecked = new Array(items.length).fill(checked)
    setItemsChecked(newItemsChecked)
    
    // Notify parent component about completion
    onComplete(cardIndex, checked)
  }

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'team':
        return <Users className="h-4 w-4 text-primary" />
      case 'growth':
        return <Sprout className="h-4 w-4 text-primary" />
      case 'hand':
        return <Hand className="h-4 w-4 text-primary" />
      default:
        return null
    }
  }

  return (
    <Card className={`transition-all duration-300 flex flex-col ${
      isActive 
        ? 'border-primary border-2 bg-gradient-to-br from-primary/5 to-primary/10' 
        : 'border-gray-200 border-2'
    }`}>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="text-base sm:text-lg font-semibold leading-tight break-words">{title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={completed}
              onCheckedChange={handleMainCheck}
              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-3 sm:px-4 py-0 pb-4 sm:pb-6">
        {/* Description */}
        {description && (
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{description}</p>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          {/* Type-specific content */}
          {type === 'manifesto' && (
            <div className="space-y-3 sm:space-y-4 px-1 sm:px-2 mb-4">
              {items.map((item: any, index: number) => (
                <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(item.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-primary leading-tight mb-1 break-words">{item.text}</p>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{item.subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'overview' && (
            <div className="flex flex-col items-center justify-center py-6 mb-4">
              <div className="mb-3">
                <img 
                  src="/arrow.png" 
                  alt="CABS Arrow" 
                  width={40} 
                  height={40}
                  className="w-10 h-10 opacity-60"
                />
              </div>
              <p className="text-sm text-gray-400 italic">Overview in CABS.</p>
            </div>
          )}

          {(type === 'hot-zones' || type === 'check-in') && helperText && (
            <div className="flex items-center justify-center text-center px-2 sm:px-3 py-6 mb-4">
              <p className="text-xs sm:text-sm text-gray-400 italic leading-relaxed break-words hyphens-auto">{helperText}</p>
            </div>
          )}

          {/* Show random content for principles card */}
          {type === 'principles' && showRandomizer && (
            <div className="text-left space-y-3 px-1 sm:px-2 py-4 mb-4">
              {mounted && currentRandomContent ? (
                currentRandomContent.split('\n').map((line, index) => (
                  <p key={index} className={index === 0 ? "text-sm sm:text-base font-semibold text-primary mb-2 break-words leading-tight" : "text-sm sm:text-base text-primary/80 leading-relaxed break-words"}>
                    {line}
                  </p>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 italic">Loading principle...</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Refresh button for principles card - positioned above time estimate */}
        {type === 'principles' && showRandomizer && (
          <div className="flex justify-center pb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 flex-shrink-0 transition-colors border-primary/30"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Time estimate/timer at bottom */}
        <div className="mt-auto">
          <Button
            onClick={() => onStartTimer(cardIndex, timeEstimate)}
            disabled={timer?.isRunning}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-3 rounded-lg text-center w-full transition-all duration-200 disabled:opacity-70"
          >
            <span className="text-sm sm:text-base font-medium">
              {timer?.isRunning ? formatTime(timer.remaining) : 
               timer?.remaining === 0 ? "Done" : 
               timeEstimate}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 