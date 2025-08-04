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
}

export default function BriefingCard({
  title,
  description,
  type,
  items = [],
  helperText,
  timeEstimate,
  showRandomizer = false,
  randomContent = []
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
  }

  const handleMainCheck = (checked: boolean) => {
    setCompleted(checked)
    // Also check/uncheck all sub-items
    const newItemsChecked = new Array(items.length).fill(checked)
    setItemsChecked(newItemsChecked)
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
    <Card className="h-full max-h-full overflow-hidden shadow-lg border-gray-200 hover:shadow-xl transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold leading-tight">{title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={completed}
              onCheckedChange={handleMainCheck}
              className="h-5 w-5 flex-shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-4 py-0 pb-4 overflow-hidden">
        {/* Description */}
        {description && (
          <div className="mb-6 flex-shrink-0">
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center min-h-0">
          {/* Type-specific content */}
          {type === 'manifesto' && (
            <div className="space-y-4 px-2">
              {items.map((item: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(item.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary leading-tight mb-1">{item.text}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'overview' && (
            <div className="flex flex-col items-center justify-center">
              <div className="mb-3">
                <img 
                  src="/arrow.png" 
                  alt="CABS Arrow" 
                  width={40} 
                  height={40}
                  className="opacity-60"
                />
              </div>
              <p className="text-sm text-gray-400 italic">Overview in CABS.</p>
            </div>
          )}

          {(type === 'hot-zones' || type === 'check-in') && helperText && (
            <div className="flex items-center justify-center text-center px-3">
              <p className="text-sm text-gray-400 italic leading-relaxed max-w-full">{helperText}</p>
            </div>
          )}

          {/* Show random content for principles card */}
          {type === 'principles' && showRandomizer && mounted && currentRandomContent && (
            <div className="text-left space-y-1 px-2">
              {currentRandomContent.split('\n').map((line, index) => (
                <p key={index} className={index === 0 ? "text-xs font-semibold text-primary mb-2" : "text-sm text-primary/80 leading-relaxed"}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
        
        {/* Refresh button for principles card - positioned above time estimate */}
        {type === 'principles' && showRandomizer && (
          <div className="flex justify-center pt-2 pb-2">
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
        
        {/* Time estimate at bottom */}
        <div className="mt-auto pt-4 flex-shrink-0">
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-lg text-center w-full">
            <span className="text-base font-medium">{timeEstimate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 