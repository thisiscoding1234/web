<script>
	import Skeleton from './Skeleton.svelte';
	import CreateChatModal from './CreateChatModal.svelte';
	import { supabase } from '$lib/supabase';
	import { getAvatarUrl } from '$lib/auth';
	import { onMount, onDestroy } from 'svelte';

	let showCreateModal = false;

	function formatTime(timestamp) {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		
		return date.toLocaleDateString();
	}

	// Demo chats for initial display when Supabase is not configured
	let chats = [
		{
			id: 1034,
			roomName: 'Tech Team',
			type: 'group',
			recentMessage: 'George: The new feature is ready! 🎉',
			image: getAvatarUrl('TechTeam'),
			recentTime: Date.now() - 300000,
			notBadge: 2,
			participants: ['George', 'Sarah', 'Mike']
		},
		{
			id: 1957,
			roomName: 'Sarah',
			type: 'direct',
			recentMessage: 'Sarah: Can you review my PR?',
			image: getAvatarUrl('Sarah'),
			recentTime: Date.now() - 900000,
			notBadge: 1,
			participants: ['Sarah']
		},
		{
			id: 2001,
			roomName: 'Project Alpha',
			type: 'group',
			recentMessage: 'Mike: Meeting at 3pm',
			image: getAvatarUrl('ProjectAlpha'),
			recentTime: Date.now() - 3600000,
			notBadge: 0,
			participants: ['Mike', 'Lisa', 'John', 'You']
		}
	];

	let loading = true;
	let error = null;
	let subscription;

	async function fetchRooms() {
		try {
			const { data, error: fetchError } = await supabase
				.from('rooms')
				.select(`
					id,
					name,
					type,
					image,
					created_at,
					messages (
						content,
						username,
						created_at
					)
				`)
				.order('created_at', { ascending: false });

			if (fetchError) {
				console.log('Using demo data - Supabase not configured:', fetchError.message);
				error = null;
				loading = false;
				return;
			}

			if (data && data.length > 0) {
				chats = data.map((room) => {
					const lastMessage = room.messages && room.messages.length > 0
						? room.messages[room.messages.length - 1]
						: null;
					return {
						id: room.id,
						roomName: room.name,
						type: room.type || 'direct',
						recentMessage: lastMessage
							? `${lastMessage.username}: ${lastMessage.content}`
							: 'No messages yet',
						image: room.image || getAvatarUrl(room.name),
						recentTime: lastMessage ? new Date(lastMessage.created_at).getTime() : new Date(room.created_at).getTime(),
						notBadge: 0
					};
				});
			}
			loading = false;
		} catch (err) {
			console.log('Using demo data - Supabase connection error');
			error = null;
			loading = false;
		}
	}

	function subscribeToRooms() {
		subscription = supabase
			.channel('rooms-channel')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'rooms' },
				() => {
					fetchRooms();
				}
			)
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'messages' },
				() => {
					fetchRooms();
				}
			)
			.subscribe();
	}

	function handleChatCreated(event) {
		const newRoom = event.detail;
		chats = [{
			id: newRoom.id,
			roomName: newRoom.name,
			type: newRoom.type || 'direct',
			recentMessage: 'Chat created',
			image: newRoom.image || getAvatarUrl(newRoom.name),
			recentTime: Date.now(),
			notBadge: 0,
			participants: newRoom.participants || []
		}, ...chats];
	}

	onMount(() => {
		fetchRooms();
		subscribeToRooms();
	});

	onDestroy(() => {
		if (subscription) {
			supabase.removeChannel(subscription);
		}
	});
</script>

<Skeleton>
	<span slot="title">Chats</span>

	<a href="/" class="left-button" slot="left">
		<i class="bi bi-arrow-left"></i>
	</a>
	<button class="right-button" slot="right" on:click={() => showCreateModal = true}>
		<i class="bi bi-plus-lg"></i>
	</button>

	<div slot="content" class="main">
		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading chats...</p>
			</div>
		{:else if chats.length === 0}
			<div class="empty-state">
				<i class="bi bi-chat-dots"></i>
				<h3>No chats yet</h3>
				<p>Start a conversation by tapping the + button</p>
				<button class="start-chat-btn" on:click={() => showCreateModal = true}>
					<i class="bi bi-plus-lg"></i>
					New Chat
				</button>
			</div>
		{:else}
			{#each chats as chat}
				<a class="chat" href="/chat/view?id={chat.id}">
					<div class="chat-left">
						<div class="chat-img">
							<img src={chat.image} alt={chat.roomName} />
							{#if chat.type === 'group'}
								<span class="group-badge">
									<i class="bi bi-people-fill"></i>
								</span>
							{/if}
						</div>
						<div class="chat-content">
							<div class="chat-header">
								<strong class="chat-name">{chat.roomName}</strong>
								<span class="chat-time">{formatTime(chat.recentTime)}</span>
							</div>
							<p class="chat-preview">{chat.recentMessage}</p>
						</div>
					</div>
					{#if chat.notBadge > 0}
						<div class="badge">{chat.notBadge}</div>
					{/if}
				</a>
			{/each}
		{/if}
	</div>
</Skeleton>

<CreateChatModal 
	bind:show={showCreateModal} 
	on:created={handleChatCreated}
	on:close={() => showCreateModal = false}
/>

<style lang="scss">
	@import '../main';
	
	.main {
		padding: 0.5rem;
		
		@media (min-width: 992px) {
			max-width: 800px;
			margin: 0 auto;
			padding: 1rem;
		}
	}

	.loading-state, .empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		color: $gray-600;

		i {
			font-size: 3rem;
			margin-bottom: 1rem;
			color: $gray-400;
		}

		h3 {
			margin: 0 0 0.5rem;
			color: $gray-800;
			font-family: 'Instrument Serif', Georgia, serif;

			@media (prefers-color-scheme: dark) {
				color: white;
			}
		}

		p {
			margin: 0;
			font-size: 0.875rem;
		}
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid $gray-200;
		border-top-color: $primary;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.start-chat-btn {
		margin-top: 1.5rem;
		padding: 0.75rem 1.5rem;
		background: $primary;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-family: 'Outfit', sans-serif;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: background 0.2s;

		&:hover {
			background: darken($primary, 10%);
		}
	}

	.chat {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem 1rem;
		text-decoration: none;
		color: inherit;
		border-radius: 12px;
		transition: background 0.2s;
		margin-bottom: 0.25rem;

		&:hover {
			background: $gray-100;
			
			@media (prefers-color-scheme: dark) {
				background: rgba(255, 255, 255, 0.05);
			}
		}

		@media (prefers-color-scheme: dark) {
			color: white;
		}
	}

	.chat-left {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		flex: 1;
		min-width: 0; // Important for text overflow
	}

	.chat-img {
		position: relative;
		flex-shrink: 0;

		img {
			width: 52px;
			height: 52px;
			border-radius: 50%;
			object-fit: cover;
		}

		.group-badge {
			position: absolute;
			bottom: -2px;
			right: -2px;
			background: $primary;
			color: white;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.625rem;
			border: 2px solid white;

			@media (prefers-color-scheme: dark) {
				border-color: #1a1a1a;
			}
		}
	}

	.chat-content {
		flex: 1;
		min-width: 0; // Important for text overflow
	}

	.chat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.chat-name {
		font-weight: 600;
		font-size: 1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chat-time {
		font-size: 0.75rem;
		color: $gray-500;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.chat-preview {
		margin: 0;
		font-size: 0.875rem;
		color: $gray-600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;

		@media (prefers-color-scheme: dark) {
			color: $gray-400;
		}
	}

	.badge {
		background: $primary;
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		min-width: 20px;
		height: 20px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 6px;
		flex-shrink: 0;
	}

	.right-button {
		position: absolute;
		right: 0;
		border: none;
		background: transparent;
		color: $primary;
		padding: 0 1rem;
		height: 100%;
		font-size: 1.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s;

		&:hover {
			color: darken($primary, 10%);
		}
	}

	.left-button {
		position: absolute;
		left: 0;
		border: none;
		background: transparent;
		color: $primary;
		padding: 0 1rem;
		height: 100%;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		transition: color 0.2s;

		&:hover {
			color: darken($primary, 10%);
		}
	}
</style>
