<script defer lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { signInWithGitHub, getAvatarUrl } from '$lib/auth';

	let isRegistering = false;
	let loading = false;
	let error = '';

	onMount(() => {
		if ($page.url.searchParams.get('state') == 'reg') {
			isRegistering = true;
		}
	});

	async function handleGitHubAuth() {
		loading = true;
		error = '';
		
		const { data, error: authError } = await signInWithGitHub();
		
		if (authError) {
			error = authError.message;
			loading = false;
		}
		// If successful, user will be redirected by OAuth flow
	}
</script>

<img class="background" alt="Background of nature" src="/backgrounds/bg-1.jpg" />
<div class="login-wrapper-wrapper">
	<div class="login-wrapper">
		<img class="logo" alt="Dispatch logo" src="/icons/android-chrome-192x192.png" />

		<div class="auth-content">
			<h1 class="login-heading">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
			<p class="auth-subtitle">
				{isRegistering 
					? 'Sign up to start chatting with friends' 
					: 'Sign in to continue to Dispatch'}
			</p>

			{#if error}
				<div class="alert alert-danger" role="alert">
					<i class="bi bi-exclamation-triangle-fill me-2"></i>
					{error}
				</div>
			{/if}

			<button 
				class="btn btn-github"
				on:click={handleGitHubAuth}
				disabled={loading}
			>
				{#if loading}
					<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
					Connecting...
				{:else}
					<i class="bi bi-github me-2"></i>
					Continue with GitHub
				{/if}
			</button>

			<div class="divider">
				<span>or</span>
			</div>

			<p class="terms-text">
				By continuing, you agree to our 
				<a href="/policies/terms">Terms of Service</a> and 
				<a href="/policies/privacy">Privacy Policy</a>
			</p>

			<hr />

			<div class="switch-auth">
				{#if isRegistering}
					<span>Already have an account?</span>
					<a href="/authenticate" class="switch-link">Sign In</a>
				{:else}
					<span>Don't have an account?</span>
					<a href="/authenticate?state=reg" class="switch-link">Sign Up</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@import '../main';

	@import '../../../node_modules/bootstrap/scss/mixins';
	@import '../../../node_modules/bootstrap/scss/functions';
	@import '../../../node_modules/bootstrap/scss/variables';
	@import '../../../node_modules/bootstrap/scss/variables-dark';
	@import '../../../node_modules/bootstrap/scss/maps';
	@import '../../../node_modules/bootstrap/scss/utilities';
	@import '../../../node_modules/bootstrap/scss/root';

	* {
		font-family: 'Outfit', $font-sans-serif !important;
	}

	.login-heading {
		margin-top: 0;
		text-align: center;
		font-family: 'Instrument Serif', Georgia, serif !important;
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.auth-subtitle {
		text-align: center;
		color: $gray-600;
		margin-bottom: 1.5rem;
	}

	.logo {
		height: 75px;
		width: auto !important;
		margin-bottom: 1rem;
	}

	.auth-content {
		width: 100%;
		max-width: 320px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.btn-github {
		width: 100%;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 500;
		color: white;
		background-color: #24292e;
		border: none;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.2s;

		&:hover:not(:disabled) {
			background-color: #2f363d;
		}

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}

		i {
			font-size: 1.25rem;
		}
	}

	.divider {
		width: 100%;
		display: flex;
		align-items: center;
		margin: 1.5rem 0;

		&::before,
		&::after {
			content: '';
			flex: 1;
			border-bottom: 1px solid $gray-300;
		}

		span {
			padding: 0 1rem;
			color: $gray-500;
			font-size: 0.875rem;
		}
	}

	.terms-text {
		text-align: center;
		font-size: 0.75rem;
		color: $gray-600;
		
		a {
			color: $primary;
			text-decoration: none;
			
			&:hover {
				text-decoration: underline;
			}
		}
	}

	.switch-auth {
		display: flex;
		gap: 0.5rem;
		font-size: 0.875rem;

		span {
			color: $gray-600;
		}

		.switch-link {
			color: $primary;
			text-decoration: none;
			font-weight: 500;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.alert {
		width: 100%;
		margin-bottom: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.875rem;
	}

	.alert-danger {
		background-color: #f8d7da;
		border: 1px solid #f5c2c7;
		color: #842029;
	}

	.login-wrapper {
		height: auto;
		width: 100%;
		max-width: 400px;
		overflow: auto;
		background: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		@media (prefers-color-scheme: dark) {
			& {
				color-scheme: dark;
				background: #1a1a1a !important;
				color: white;
			}
			.auth-subtitle, .terms-text, .switch-auth span {
				color: $gray-400 !important;
			}
			.divider span {
				color: $gray-500;
			}
			.divider::before, .divider::after {
				border-color: $gray-600;
			}
		}
	}

	.login-wrapper-wrapper {
		display: flex;
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.background {
		display: none;
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -2;
		object-fit: cover;
	}

	// Desktop
	@include media-breakpoint-up(sm) {
		.login-wrapper {
			border: 1px solid $gray-200;
			border-radius: 16px;
			box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
			@media (prefers-color-scheme: dark) {
				border-color: $gray-700;
			}
		}
		.background {
			display: block;
		}
	}

	@include media-breakpoint-up(lg) {
		.login-wrapper-wrapper {
			align-items: flex-start;
			padding-left: 10%;
		}
	}

	hr {
		width: 100%;
		margin: 1rem 0;
	}
</style>
