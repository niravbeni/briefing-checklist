'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Copy, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase, Todo, CreateTodoInput } from '@/lib/supabase'

export default function TodoSection() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Start with empty todos on each page load - they're saved to database but main page starts fresh
  useEffect(() => {
    setTodos([])
  }, [])

  const addTodo = async () => {
    if (newTodo.trim()) {
      setIsLoading(true)
      
      try {
        const { data, error } = await supabase
          .from('todos')
          .insert([
            { 
              text: newTodo.trim(),
              completed: false
            }
          ])
          .select()

        if (error) throw error

        if (data) {
          setTodos(prev => [...prev, data[0]])
          setNewTodo('')
          // Removed database success notification
        }
      } catch (error) {
        console.error('Error adding todo:', error)
        toast({
          title: "Error",
          description: "Failed to add todo. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const removeTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTodos(todos.filter(todo => todo.id !== id))
      toast({
        title: "Todo removed!",
        description: "Todo has been deleted from the database.",
      })
    } catch (error) {
      console.error('Error removing todo:', error)
      toast({
        title: "Error",
        description: "Failed to remove todo. Please try again.",
        variant: "destructive",
      })
    }
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
            disabled={isLoading}
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