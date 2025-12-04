-- Supabase SQL Setup for Dispatch Chat
-- Run this in your Supabase SQL Editor to set up the required tables

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (optional - for user profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON rooms(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: These policies allow public access for demo purposes.
-- For production, you should:
-- 1. Implement Supabase Auth
-- 2. Restrict policies to authenticated users
-- 3. Add user-specific policies (e.g., users can only edit their own messages)

-- Create policies for public access (DEMO ONLY - tighten for production)
-- Allow anyone to read rooms
CREATE POLICY "Allow public read access to rooms" ON rooms
    FOR SELECT USING (true);

-- Allow anyone to create rooms
CREATE POLICY "Allow public insert access to rooms" ON rooms
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read messages
CREATE POLICY "Allow public read access to messages" ON messages
    FOR SELECT USING (true);

-- Allow anyone to create messages
CREATE POLICY "Allow public insert access to messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read users
CREATE POLICY "Allow public read access to users" ON users
    FOR SELECT USING (true);

-- Allow anyone to create users
CREATE POLICY "Allow public insert access to users" ON users
    FOR INSERT WITH CHECK (true);

-- Enable realtime for messages and rooms
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;

-- Insert some sample data (optional)
INSERT INTO rooms (name, image) VALUES 
    ('General', NULL),
    ('Random', NULL),
    ('Tech Talk', NULL)
ON CONFLICT DO NOTHING;
