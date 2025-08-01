'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Copy, Send, X } from 'lucide-react'
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

  const sendTodos = async () => {
    if (todos.length === 0) {
      toast({
        title: "No todos to send",
        description: "Add some todos first before sending.",
        variant: "destructive",
      })
      return
    }

    // Simulate sending - in real implementation, this would call your Zapier webhook
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Your todo list has been sent successfully.",
      })
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <Card className="w-full h-full flex flex-col shadow-lg border-gray-200 max-h-full overflow-hidden">
      <CardHeader className="pb-4 flex-shrink-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-800">
          <span>To-Do's</span>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="text-primary hover:text-primary hover:bg-primary/10 text-sm font-medium transition-all duration-200"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              size="sm"
              onClick={sendTodos}
              className="bg-primary hover:bg-primary/90 text-sm font-medium shadow-md transition-all duration-200"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col space-y-4 p-4 pb-6 min-h-0 overflow-hidden">
        {/* Add new todo */}
        <div className="flex space-x-3 flex-shrink-0">
          <Input
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-sm shadow-sm border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg"
          />
          <Button 
            onClick={addTodo} 
            size="icon" 
            className="bg-primary hover:bg-primary/90 h-10 w-10 shadow-md transition-all duration-200 rounded-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Todo list - Scrollable container */}
        <div className="flex-grow min-h-0 overflow-hidden">
          {todos.length > 0 ? (
            <div 
              className="h-full pr-1 scrollbar-visible" 
              style={{
                overflowY: 'scroll',
                scrollbarWidth: 'thin', 
                scrollbarColor: '#F472B6 #f1f5f9',
                scrollbarGutter: 'stable'
              }}
            >
              <div className="space-y-3 pr-1">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-sm flex-1 pr-3 text-gray-700">{todo.text}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTodo(todo.id)}
                      className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0 transition-colors rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-base font-medium">No todos yet</p>
                <p className="text-sm mt-1 opacity-75">Add one above to get started!</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 