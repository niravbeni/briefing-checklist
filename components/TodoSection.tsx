'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Copy, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export default function TodoSection() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState('')
  const { toast } = useToast()

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false
      }
      setTodos([...todos, todo])
      setNewTodo('')
    }
  }

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const copyToClipboard = async () => {
    const todoText = todos.map(todo => `• ${todo.text}`).join('\n')
    
    if (todoText) {
      try {
        await navigator.clipboard.writeText(todoText)
        toast({
          title: "Copied to clipboard!",
          description: "Todo list has been copied to your clipboard.",
        })
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No todos to copy",
        description: "Add some todos first before copying.",
        variant: "destructive",
      })
    }
  }



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <Card className="w-full shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-start sm:justify-between text-base sm:text-lg font-semibold leading-tight space-y-3 sm:space-y-0">
          <div className="flex flex-col items-start">
            <span className="text-gray-900">To do's</span>
          </div>
          <div className="flex space-x-2 sm:mt-1">
            <Button
              onClick={copyToClipboard}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-all duration-200 text-sm"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">Copy</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 px-3 sm:px-4 pt-2 pb-6">
        {/* Add new todo */}
        <div className="flex space-x-2 sm:space-x-3">
          <Input
            placeholder="Add new to-do"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-xs sm:text-sm shadow-sm border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg min-w-0"
          />
          <Button 
            onClick={addTodo} 
            size="icon" 
            className="bg-primary hover:bg-primary/90 h-9 w-9 sm:h-10 sm:w-10 shadow-md transition-all duration-200 rounded-lg flex-shrink-0"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Todo list */}
        {todos.length > 0 && (
          <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:shadow-sm transition-all duration-200"
                  >
                <span className="text-xs sm:text-sm flex-1 pr-3 text-gray-700 break-words leading-relaxed">{todo.text}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTodo(todo.id)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0 transition-colors rounded-md"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
          )}
      </CardContent>
    </Card>
  )
} 