'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowLeft, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase, Todo } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AnalyticsPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setTodos(data)
      }
    } catch (error) {
      console.error('Error loading todos:', error)
      toast({
        title: "Error",
        description: "Failed to load todos from database.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetDatabase = async () => {
    if (confirm('Are you sure you want to reset the entire database? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('todos')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all todos
        
        if (error) throw error
        
        setTodos([])
        toast({
          title: "Database reset!",
          description: "All todos have been cleared from the database.",
        })
      } catch (error) {
        console.error('Error resetting database:', error)
        toast({
          title: "Error",
          description: "Failed to reset database. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Group todos by date
  const groupTodosByDate = (todos: Todo[]) => {
    const groups: { [key: string]: Todo[] } = {}
    
    todos.forEach(todo => {
      const date = new Date(todo.created_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(todo)
    })
    
    return groups
  }

  const todoGroups = groupTodosByDate(todos)

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={resetDatabase}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset Database</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{todos.length}</div>
                <div className="text-sm text-gray-600">Total Todos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Object.keys(todoGroups).length}</div>
                <div className="text-sm text-gray-600">Active Days</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {todos.length > 0 ? Math.round(todos.length / Math.max(Object.keys(todoGroups).length, 1)) : 0}
                </div>
                <div className="text-sm text-gray-600">Avg per Day</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Todos by Date */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Loading todos...</p>
            </CardContent>
          </Card>
        ) : Object.keys(todoGroups).length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Todos by Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(todoGroups).map(([date, dateTodos]) => (
                <div key={date} className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-700 border-b border-gray-100 pb-2">
                    {date} ({dateTodos.length} todos)
                  </h4>
                  <div className="space-y-2 pl-4">
                    {dateTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <span className="text-sm text-gray-700">{todo.text}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(todo.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No todos found in the database.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 