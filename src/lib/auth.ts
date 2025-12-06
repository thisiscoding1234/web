import { supabase, isSupabaseConfigured } from './supabase';
import { writable } from 'svelte/store';

// User store for reactive user state
export const user = writable(null);
export const loading = writable(true);

/**
 * Generate DiceBear avatar URL for a username
 * @param username - The username to generate avatar for
 * @returns The DiceBear avatar URL
 */
export function getAvatarUrl(username: string): string {
	return `https://api.dicebear.com/9.0/rings/svg?seed=${encodeURIComponent(username)}&radius=50&backgroundType=gradientLinear&ringFive=full,eighth,half,quarter&ringFour=half,quarter,full,eighth&ringOne=half,quarter,full,eighth&ringThree=half,quarter,full,eighth&ringTwo=half,quarter,full,eighth&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/**
 * Sign in with GitHub OAuth
 * Redirects to GitHub for authentication
 */
export async function signInWithGitHub() {
	if (!isSupabaseConfigured) {
		console.log('Supabase not configured - using demo mode');
		// Demo mode: simulate a logged-in user
		const demoUser = {
			id: 'demo-user',
			email: 'demo@example.com',
			user_metadata: {
				user_name: 'DemoUser',
				avatar_url: getAvatarUrl('DemoUser')
			}
		};
		user.set(demoUser);
		return { data: { user: demoUser }, error: null };
	}

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'github',
		options: {
			redirectTo: typeof window !== 'undefined' 
				? `${window.location.origin}/authenticate/callback`
				: undefined
		}
	});

	return { data, error };
}

/**
 * Sign out the current user
 */
export async function signOut() {
	if (!isSupabaseConfigured) {
		user.set(null);
		return { error: null };
	}

	const { error } = await supabase.auth.signOut();
	if (!error) {
		user.set(null);
	}
	return { error };
}

/**
 * Get the current user session
 */
export async function getSession() {
	if (!isSupabaseConfigured) {
		loading.set(false);
		return null;
	}

	const { data: { session } } = await supabase.auth.getSession();
	if (session?.user) {
		// Add avatar URL if not present
		if (!session.user.user_metadata?.avatar_url && session.user.user_metadata?.user_name) {
			session.user.user_metadata.avatar_url = getAvatarUrl(session.user.user_metadata.user_name);
		}
		user.set(session.user);
	}
	loading.set(false);
	return session;
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthChanges() {
	if (!isSupabaseConfigured) {
		return { unsubscribe: () => {} };
	}

	const { data: { subscription } } = supabase.auth.onAuthStateChange(
		async (event, session) => {
			if (session?.user) {
				// Add avatar URL if not present
				if (!session.user.user_metadata?.avatar_url && session.user.user_metadata?.user_name) {
					session.user.user_metadata.avatar_url = getAvatarUrl(session.user.user_metadata.user_name);
				}
				user.set(session.user);
			} else {
				user.set(null);
			}
			loading.set(false);
		}
	);

	return { unsubscribe: () => subscription.unsubscribe() };
}
