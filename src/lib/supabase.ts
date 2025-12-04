import { createClient } from '@supabase/supabase-js';

// These are public keys - they're safe to expose in the client
// In production, you should use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our chat application
export interface Message {
	id: string;
	room_id: string;
	user_id: string;
	username: string;
	content: string;
	created_at: string;
}

export interface Room {
	id: string;
	name: string;
	image?: string;
	created_at: string;
	last_message?: string;
	last_message_time?: string;
	unread_count?: number;
}

export interface User {
	id: string;
	username: string;
	avatar_url?: string;
	created_at: string;
}
