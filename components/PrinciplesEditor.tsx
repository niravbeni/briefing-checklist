'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BriefingCard {
  title: string
  description: string
  timeEstimate: string
  items: string[]
}

interface PrinciplesEditorProps {
  principles: string[]
  onSavePrinciples: (principles: string[]) => void
  briefingCards: BriefingCard[]
  onSaveBriefingCards: (cards: BriefingCard[]) => void
  onClose: () => void
}

export default function PrinciplesEditor({ principles, onSavePrinciples, briefingCards, onSaveBriefingCards, onClose }: PrinciplesEditorProps) {
  const [editablePrinciples, setEditablePrinciples] = useState([...principles])
  const [newPrinciple, setNewPrinciple] = useState('')
  const [editableCards, setEditableCards] = useState([...briefingCards])
  const [activeTab, setActiveTab] = useState<'principles' | 'cards'>('principles')
  const { toast } = useToast()

  const addPrinciple = () => {
    if (newPrinciple.trim()) {
      setEditablePrinciples([...editablePrinciples, newPrinciple.trim()])
      setNewPrinciple('')
    }
  }

  const removePrinciple = (index: number) => {
    setEditablePrinciples(editablePrinciples.filter((_, i) => i !== index))
  }

  const updatePrinciple = (index: number, value: string) => {
    const updated = [...editablePrinciples]
    updated[index] = value
    setEditablePrinciples(updated)
  }

  const handleSave = () => {
    const validPrinciples = editablePrinciples.filter(p => p.trim().length > 0)
    const validCards = editableCards.map(card => ({
      ...card,
      items: card.items.filter(item => item.trim().length > 0)
    }))
    
    onSavePrinciples(validPrinciples)
    onSaveBriefingCards(validCards)
    
    toast({
      title: "Settings updated!",
      description: `Saved ${validPrinciples.length} principles and ${validCards.length} cards.`,
    })
    onClose()
  }

  const updateCardField = (cardIndex: number, field: keyof BriefingCard, value: string | string[]) => {
    const updated = [...editableCards]
    updated[cardIndex] = { ...updated[cardIndex], [field]: value }
    setEditableCards(updated)
  }

  const addItemToCard = (cardIndex: number) => {
    const updated = [...editableCards]
    updated[cardIndex] = { 
      ...updated[cardIndex], 
      items: [...updated[cardIndex].items, ''] 
    }
    setEditableCards(updated)
  }

  const updateCardItem = (cardIndex: number, itemIndex: number, value: string) => {
    const updated = [...editableCards]
    updated[cardIndex] = {
      ...updated[cardIndex],
      items: updated[cardIndex].items.map((item, i) => i === itemIndex ? value : item)
    }
    setEditableCards(updated)
  }

  const removeCardItem = (cardIndex: number, itemIndex: number) => {
    const updated = [...editableCards]
    updated[cardIndex] = {
      ...updated[cardIndex],
      items: updated[cardIndex].items.filter((_, i) => i !== itemIndex)
    }
    setEditableCards(updated)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPrinciple()
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="text-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings & Configuration</h1>
            <p className="text-gray-600">Manage your briefing content and service principles</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'principles' ? 'default' : 'outline'}
          onClick={() => setActiveTab('principles')}
        >
          Service Principles ({editablePrinciples.length})
        </Button>
        <Button
          variant={activeTab === 'cards' ? 'default' : 'outline'}
          onClick={() => setActiveTab('cards')}
        >
          Briefing Cards ({editableCards.length})
        </Button>
      </div>

      {/* Editor */}
      <Card className="flex-grow flex flex-col">
        {activeTab === 'principles' ? (
          <>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Service Principles ({editablePrinciples.length})</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-grow flex flex-col space-y-4">
              {/* Add new principle */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a new service principle..."
                  value={newPrinciple}
                  onChange={(e) => setNewPrinciple(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={addPrinciple} size="icon" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Principles list */}
              <div className="flex-grow overflow-y-auto space-y-3">
                {editablePrinciples.map((principle, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                    <div className="text-sm text-gray-500 mt-2 font-mono w-8 flex-shrink-0">
                      {index + 1}.
                    </div>
                    <Input
                      value={principle}
                      onChange={(e) => updatePrinciple(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrinciple(index)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {editablePrinciples.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No principles yet. Add one above to get started!</p>
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Briefing Cards Content</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-y-auto space-y-6">
              {editableCards.map((card, cardIndex) => (
                <div key={cardIndex} className="p-4 bg-white rounded-lg border space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <Input
                        value={card.title}
                        onChange={(e) => updateCardField(cardIndex, 'title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Time Estimate</label>
                      <Input
                        value={card.timeEstimate}
                        onChange={(e) => updateCardField(cardIndex, 'timeEstimate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Input
                        value={card.description}
                        onChange={(e) => updateCardField(cardIndex, 'description', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Checklist Items</label>
                      <Button
                        size="sm"
                        onClick={() => addItemToCard(cardIndex)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {card.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <Input
                            value={item}
                            onChange={(e) => updateCardItem(cardIndex, itemIndex, e.target.value)}
                            placeholder="Enter checklist item..."
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCardItem(cardIndex, itemIndex)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
} 