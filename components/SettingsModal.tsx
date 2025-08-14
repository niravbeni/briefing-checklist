'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Eye, EyeOff } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthenticate: (isAuthenticated: boolean) => void
}

export default function SettingsModal({ isOpen, onClose, onAuthenticate }: SettingsModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Check if code matches "4336"
    if (code === '4336') {
      onAuthenticate(true)
      onClose()
    } else {
      setError('Invalid code. Please try again.')
    }
    
    setIsLoading(false)
  }

  const handleClose = () => {
    setCode('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Settings</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Enter the 4-digit access code to view stored data
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter 4-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={4}
                className="text-center text-lg tracking-widest"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={code.length !== 4 || isLoading}
            >
              {isLoading ? 'Checking...' : 'Access Data'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 