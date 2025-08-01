'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface BriefingCardProps {
  title: string
  description: string
  timeEstimate: string
  isCompleted?: boolean
  items?: string[]
  showRandomizer?: boolean
  randomContent?: string[]
  onRefresh?: () => void
}

export default function BriefingCard({ 
  title, 
  description, 
  timeEstimate, 
  isCompleted = false, 
  items = [],
  showRandomizer = false,
  randomContent = [],
  onRefresh
}: BriefingCardProps) {
  const [completed, setCompleted] = useState(isCompleted)
  const [itemsChecked, setItemsChecked] = useState<boolean[]>(new Array(items.length).fill(false))
  const [currentRandomContent, setCurrentRandomContent] = useState('')
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by only setting random content on client
  useEffect(() => {
    if (typeof window !== 'undefined' && randomContent.length > 0) {
      setCurrentRandomContent(randomContent[Math.floor(Math.random() * randomContent.length)])
    }
    setMounted(true)
  }, [])

  const handleMainCheck = (checked: boolean) => {
    setCompleted(checked)
    // If main checkbox is checked, check all sub-items
    if (checked && items.length > 0) {
      setItemsChecked(new Array(items.length).fill(true))
    }
    // If main checkbox is unchecked, uncheck all sub-items
    if (!checked && items.length > 0) {
      setItemsChecked(new Array(items.length).fill(false))
    }
  }

  const handleItemCheck = (index: number, checked: boolean) => {
    const newItemsChecked = [...itemsChecked]
    newItemsChecked[index] = checked
    setItemsChecked(newItemsChecked)
    
    // Auto-check main card if all items are checked
    const allChecked = newItemsChecked.every(item => item)
    if (allChecked && items.length > 0) {
      setCompleted(true)
    } else if (!checked && completed) {
      // Uncheck main card if an item gets unchecked
      setCompleted(false)
    }
  }

  const handleRefresh = () => {
    if (randomContent.length > 0) {
      const newContent = randomContent[Math.floor(Math.random() * randomContent.length)]
      setCurrentRandomContent(newContent)
    }
    onRefresh?.()
  }

  return (
    <Card className={`h-full max-h-full transition-all duration-300 ${completed ? 'border-primary bg-primary/8 shadow-lg' : 'hover:shadow-lg border-gray-200'} flex flex-col shadow-sm overflow-hidden`}>
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
              <Checkbox
                checked={completed}
                onCheckedChange={handleMainCheck}
                className="h-5 w-5 flex-shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base lg:text-lg leading-tight font-semibold">{title}</CardTitle>
            </div>
          </div>
          {showRandomizer && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="h-7 w-7 sm:h-8 sm:w-8 text-primary hover:text-primary hover:bg-primary/10 flex-shrink-0 transition-colors"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-grow flex flex-col p-2 sm:p-3 overflow-hidden">
        <div className="flex-grow flex flex-col min-h-0">
          {/* Show description */}
          {description && (
            <div className="mb-3 p-2 bg-gradient-to-r from-gray-50 to-white rounded border-l-4 border-primary/40 shadow-sm">
              <p className="text-xs text-gray-700 leading-tight font-medium">{description}</p>
            </div>
          )}
          
          {/* Show random content for principles card */}
          {showRandomizer && mounted && currentRandomContent && (
            <div className="mb-3 p-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded border border-primary/30 shadow-sm">
              <p className="text-xs font-semibold text-primary leading-tight">{currentRandomContent}</p>
            </div>
          )}
          
          {/* Show checklist items */}
          {items.length > 0 && (
            <div 
              className="flex-grow min-h-0"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div 
                className="flex-1 pr-2"
                style={{
                  overflowY: 'scroll',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#F472B6 #f1f5f9',
                  minHeight: '60px'
                }}
              >
                <div className="space-y-1">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2 p-0.5 hover:bg-gray-50/50 rounded transition-colors">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={itemsChecked[index]}
                          onCheckedChange={(checked) => handleItemCheck(index, Boolean(checked))}
                          className="h-4 w-4 flex-shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                      <span className={`text-xs leading-tight ${itemsChecked[index] ? 'line-through text-muted-foreground' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs sm:text-sm font-semibold text-primary/80 mt-2 flex-shrink-0 bg-primary/5 px-2 py-1 rounded text-center">
          {timeEstimate}
        </div>
      </CardContent>
    </Card>
  )
} 