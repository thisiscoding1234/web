<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { supabase, isSupabaseConfigured } from '$lib/supabase';
	import { getAvatarUrl } from '$lib/auth';

	export let show = false;

	const dispatch = createEventDispatcher();

	let roomName = '';
	let roomType: 'direct' | 'group' = 'direct';
	let selectedUsers: string[] = [];
	let newUserInput = '';
	let loading = false;
	let error = '';

	function close() {
		show = false;
		roomName = '';
		roomType = 'direct';
		selectedUsers = [];
		newUserInput = '';
		error = '';
		dispatch('close');
	}

	function addUser() {
		if (newUserInput.trim() && !selectedUsers.includes(newUserInput.trim())) {
			selectedUsers = [...selectedUsers, newUserInput.trim()];
			newUserInput = '';
		}
	}

	function removeUser(user: string) {
		selectedUsers = selectedUsers.filter(u => u !== user);
	}

	async function createRoom() {
		if (roomType === 'group' && !roomName.trim()) {
			error = 'Please enter a group name';
			return;
		}

		if (selectedUsers.length === 0) {
			error = 'Please add at least one participant';
			return;
		}

		loading = true;
		error = '';

		try {
			if (!isSupabaseConfigured) {
				// Demo mode - create a local room
				const newRoom = {
					id: Date.now(),
					name: roomType === 'group' ? roomName : selectedUsers[0],
					type: roomType,
					participants: selectedUsers,
					image: getAvatarUrl(roomType === 'group' ? roomName : selectedUsers[0]),
					created_at: new Date().toISOString()
				};
				dispatch('created', newRoom);
				close();
				return;
			}

			// Create room in Supabase
			const { data, error: createError } = await supabase
				.from('rooms')
				.insert({
					name: roomType === 'group' ? roomName : selectedUsers[0],
					type: roomType,
					image: getAvatarUrl(roomType === 'group' ? roomName : selectedUsers[0])
				})
				.select()
				.single();

			if (createError) {
				throw createError;
			}

			dispatch('created', data);
			close();
		} catch (err) {
			error = err.message || 'Failed to create chat';
		} finally {
			loading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div class="modal-backdrop" on:click={close} role="presentation">
		<div class="modal-content" on:click|stopPropagation role="dialog" aria-modal="true">
			<div class="modal-header">
				<h2>New Chat</h2>
				<button class="close-btn" on:click={close} aria-label="Close">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>

			<div class="modal-body">
				<!-- Chat Type Selection -->
				<div class="chat-type-selector">
					<button 
						class="type-btn" 
						class:active={roomType === 'direct'}
						on:click={() => roomType = 'direct'}
					>
						<i class="bi bi-person"></i>
						Direct Message
					</button>
					<button 
						class="type-btn" 
						class:active={roomType === 'group'}
						on:click={() => roomType = 'group'}
					>
						<i class="bi bi-people"></i>
						Group Chat
					</button>
				</div>

				<!-- Group Name (only for group chats) -->
				{#if roomType === 'group'}
					<div class="form-group">
						<label for="roomName">Group Name</label>
						<input 
							type="text" 
							id="roomName"
							bind:value={roomName}
							placeholder="Enter group name..."
							class="form-input"
						/>
					</div>
				{/if}

				<!-- Add Participants -->
				<div class="form-group">
					<label for="participants">
						{roomType === 'group' ? 'Add Participants' : 'Username'}
					</label>
					<div class="add-user-row">
						<input 
							type="text" 
							id="participants"
							bind:value={newUserInput}
							placeholder="Enter username..."
							class="form-input"
							on:keydown={(e) => e.key === 'Enter' && addUser()}
						/>
						<button class="add-btn" on:click={addUser} disabled={!newUserInput.trim()}>
							<i class="bi bi-plus-lg"></i>
						</button>
					</div>
				</div>

				<!-- Selected Users -->
				{#if selectedUsers.length > 0}
					<div class="selected-users">
						{#each selectedUsers as user}
							<div class="user-chip">
								<img src={getAvatarUrl(user)} alt={user} class="chip-avatar" />
								<span>{user}</span>
								<button class="remove-btn" on:click={() => removeUser(user)}>
									<i class="bi bi-x"></i>
								</button>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Error Message -->
				{#if error}
					<div class="error-message">
						<i class="bi bi-exclamation-circle"></i>
						{error}
					</div>
				{/if}
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={close}>Cancel</button>
				<button 
					class="btn-primary" 
					on:click={createRoom}
					disabled={loading || selectedUsers.length === 0}
				>
					{#if loading}
						<span class="spinner"></span>
						Creating...
					{:else}
						<i class="bi bi-chat-dots"></i>
						Create Chat
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '../main';

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 16px;
		width: 100%;
		max-width: 480px;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

		@media (prefers-color-scheme: dark) {
			background: #1a1a1a;
			color: white;
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid $gray-200;

		@media (prefers-color-scheme: dark) {
			border-color: $gray-700;
		}

		h2 {
			margin: 0;
			font-size: 1.25rem;
			font-family: 'Instrument Serif', Georgia, serif;
		}

		.close-btn {
			background: none;
			border: none;
			font-size: 1.25rem;
			color: $gray-500;
			cursor: pointer;
			padding: 0.25rem;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 8px;
			transition: all 0.2s;

			&:hover {
				background: $gray-100;
				color: $gray-700;
			}

			@media (prefers-color-scheme: dark) {
				&:hover {
					background: $gray-800;
					color: white;
				}
			}
		}
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.chat-type-selector {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.type-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		border: 2px solid $gray-200;
		border-radius: 12px;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Outfit', sans-serif;

		i {
			font-size: 1.5rem;
			color: $gray-500;
		}

		&:hover {
			border-color: $primary;
		}

		&.active {
			border-color: $primary;
			background: rgba($primary, 0.05);

			i {
				color: $primary;
			}
		}

		@media (prefers-color-scheme: dark) {
			background: #2a2a2a;
			border-color: $gray-700;
			color: white;

			&:hover {
				border-color: $primary;
			}

			&.active {
				background: rgba($primary, 0.15);
			}
		}
	}

	.form-group {
		margin-bottom: 1rem;

		label {
			display: block;
			font-size: 0.875rem;
			font-weight: 500;
			color: $gray-700;
			margin-bottom: 0.5rem;

			@media (prefers-color-scheme: dark) {
				color: $gray-300;
			}
		}
	}

	.form-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid $gray-300;
		border-radius: 8px;
		font-size: 1rem;
		font-family: 'Outfit', sans-serif;
		transition: border-color 0.2s;

		&:focus {
			outline: none;
			border-color: $primary;
			box-shadow: 0 0 0 3px rgba($primary, 0.1);
		}

		@media (prefers-color-scheme: dark) {
			background: #2a2a2a;
			border-color: $gray-600;
			color: white;
		}
	}

	.add-user-row {
		display: flex;
		gap: 0.5rem;

		.form-input {
			flex: 1;
		}
	}

	.add-btn {
		padding: 0.75rem 1rem;
		background: $primary;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;

		&:hover:not(:disabled) {
			background: darken($primary, 10%);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.selected-users {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.user-chip {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		background: $gray-100;
		border-radius: 20px;
		font-size: 0.875rem;

		@media (prefers-color-scheme: dark) {
			background: $gray-800;
		}

		.chip-avatar {
			width: 24px;
			height: 24px;
			border-radius: 50%;
		}

		.remove-btn {
			background: none;
			border: none;
			padding: 0;
			cursor: pointer;
			color: $gray-500;
			display: flex;
			align-items: center;

			&:hover {
				color: $danger;
			}
		}
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: rgba($danger, 0.1);
		color: $danger;
		border-radius: 8px;
		margin-top: 1rem;
		font-size: 0.875rem;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid $gray-200;

		@media (prefers-color-scheme: dark) {
			border-color: $gray-700;
		}
	}

	.btn-secondary, .btn-primary {
		padding: 0.625rem 1.25rem;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'Outfit', sans-serif;
		transition: all 0.2s;
	}

	.btn-secondary {
		background: transparent;
		border: 1px solid $gray-300;
		color: $gray-700;

		&:hover {
			background: $gray-100;
		}

		@media (prefers-color-scheme: dark) {
			border-color: $gray-600;
			color: $gray-300;

			&:hover {
				background: $gray-800;
			}
		}
	}

	.btn-primary {
		background: $primary;
		border: none;
		color: white;

		&:hover:not(:disabled) {
			background: darken($primary, 10%);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
