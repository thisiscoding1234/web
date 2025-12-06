<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase, isSupabaseConfigured } from '$lib/supabase';

	let error = '';
	let loading = true;

	onMount(async () => {
		if (!isSupabaseConfigured) {
			// Demo mode - redirect to chat
			goto('/chat');
			return;
		}

		try {
			// Handle the OAuth callback - Supabase will automatically
			// parse the URL hash/query params and establish the session
			const { data: { subscription } } = supabase.auth.onAuthStateChange(
				async (event, session) => {
					if (event === 'SIGNED_IN' && session) {
						// Successfully authenticated, redirect to chat
						goto('/chat');
					} else if (event === 'SIGNED_OUT' || !session) {
						// Check for any errors in URL
						const hashParams = new URLSearchParams(window.location.hash.substring(1));
						const errorDescription = hashParams.get('error_description');
						if (errorDescription) {
							error = errorDescription;
							loading = false;
						}
					}
				}
			);

			// Also check for existing session
			const { data: { session }, error: authError } = await supabase.auth.getSession();
			
			if (authError) {
				error = authError.message;
				loading = false;
				subscription.unsubscribe();
				return;
			}

			if (session) {
				// Already have a session, redirect
				goto('/chat');
				subscription.unsubscribe();
			} else {
				// Wait a bit for onAuthStateChange to process
				setTimeout(() => {
					if (loading) {
						error = 'Authentication timed out. Please try again.';
						loading = false;
					}
					subscription.unsubscribe();
				}, 5000);
			}
		} catch (err) {
			error = 'An unexpected error occurred.';
			loading = false;
		}
	});
</script>

<div class="callback-container">
	{#if loading}
		<div class="loading">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
			<p>Completing authentication...</p>
		</div>
	{:else if error}
		<div class="error">
			<i class="bi bi-exclamation-triangle-fill"></i>
			<h2>Authentication Error</h2>
			<p>{error}</p>
			<a href="/authenticate" class="btn btn-primary">
				<i class="bi bi-arrow-left"></i> Try Again
			</a>
		</div>
	{/if}
</div>

<style lang="scss">
	@import '../../main';

	.callback-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		font-family: 'Outfit', $font-sans-serif;
	}

	.loading, .error {
		text-align: center;
		padding: 2rem;
	}

	.loading p {
		margin-top: 1rem;
		color: $gray-600;
	}

	.error {
		i {
			font-size: 3rem;
			color: $danger;
		}
		h2 {
			margin-top: 1rem;
		}
		p {
			color: $gray-600;
			margin-bottom: 1.5rem;
		}
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
