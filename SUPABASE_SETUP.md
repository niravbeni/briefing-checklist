# Supabase Setup Guide

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready

## 2. Get Your Credentials
1. Go to Project Settings > API
2. Copy your Project URL and anon/public key

## 3. Create Environment File
Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Create Database Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create todos table
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID
);

-- Enable Row Level Security (optional)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now)
CREATE POLICY "Allow all operations" ON todos FOR ALL USING (true);
```

## 5. Features
- **4-digit code access**: Enter "4336" in settings to view stored data
- **Real-time sync**: Todos update instantly across all users
- **Date grouping**: Todos are organized by creation date
- **Persistent storage**: Data survives browser refreshes and different users

## 6. Security
- The 4-digit code "4336" controls access to stored data
- Only authenticated users can see historical todos
- Regular users can still add/remove todos normally 