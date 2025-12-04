<script>
	import { page } from '$app/stores';
	import Skeleton from '../Skeleton.svelte';
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { supabase } from '$lib/supabase';

	var chatId = $page.url.searchParams.get('id');
	
	let messages = [];
	let newMessage = '';
	let roomName = 'Chat';
	let loading = true;
	let subscription;
	let messagesContainer;
	let currentUser = {
		id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
		username: 'You'
	};

	// Scroll to bottom when new messages arrive
	afterUpdate(() => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});

	async function fetchMessages() {
		try {
			// First try to get room info
			const { data: roomData, error: roomError } = await supabase
				.from('rooms')
				.select('name')
				.eq('id', chatId)
				.single();
			
			if (roomData) {
				roomName = roomData.name;
			}

			// Then get messages
			const { data, error } = await supabase
				.from('messages')
				.select('*')
				.eq('room_id', chatId)
				.order('created_at', { ascending: true });

			if (error) {
				console.log('Using demo mode - Supabase not configured:', error.message);
				// Demo messages
				messages = [
					{
						id: '1',
						room_id: chatId,
						user_id: 'other-user',
						username: roomName,
						content: 'Hey there! 👋',
						created_at: new Date(Date.now() - 60000).toISOString()
					},
					{
						id: '2',
						room_id: chatId,
						user_id: 'other-user',
						username: roomName,
						content: 'Welcome to the chat!',
						created_at: new Date(Date.now() - 30000).toISOString()
					}
				];
				loading = false;
				return;
			}

			messages = data || [];
			loading = false;
		} catch (err) {
			console.log('Using demo mode - connection error');
			loading = false;
		}
	}

	function subscribeToMessages() {
		subscription = supabase
			.channel(`room-${chatId}`)
			.on(
				'postgres_changes',
				{ 
					event: 'INSERT', 
					schema: 'public', 
					table: 'messages',
					filter: `room_id=eq.${chatId}`
				},
				(payload) => {
					messages = [...messages, payload.new];
				}
			)
			.subscribe();
	}

	async function sendMessage(e) {
		e.preventDefault();
		
		if (!newMessage.trim()) return;

		const messageContent = newMessage.trim();
		newMessage = '';

		try {
			const { error } = await supabase
				.from('messages')
				.insert({
					room_id: chatId,
					user_id: currentUser.id,
					username: currentUser.username,
					content: messageContent
				});

			if (error) {
				// Demo mode - just add message locally
				messages = [...messages, {
					id: Date.now().toString(),
					room_id: chatId,
					user_id: currentUser.id,
					username: currentUser.username,
					content: messageContent,
					created_at: new Date().toISOString()
				}];
			}
		} catch (err) {
			// Demo mode - add message locally
			messages = [...messages, {
				id: Date.now().toString(),
				room_id: chatId,
				user_id: currentUser.id,
				username: currentUser.username,
				content: messageContent,
				created_at: new Date().toISOString()
			}];
		}
	}

	function formatTime(isoString) {
		const date = new Date(isoString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	onMount(() => {
		fetchMessages();
		subscribeToMessages();
	});

	onDestroy(() => {
		if (subscription) {
			supabase.removeChannel(subscription);
		}
	});
</script>

<Skeleton>
	<span slot="title">{roomName}</span>

	<a href="/chat" class="left-button" slot="left"><i class="fa-solid fa-angle-left" /></a>

	<div class="main" slot="content">
		<div class="messages-container" bind:this={messagesContainer}>
			{#if loading}
				<div class="loading">Loading messages...</div>
			{:else if messages.length === 0}
				<div class="no-messages">No messages yet. Start the conversation!</div>
			{:else}
				{#each messages as message (message.id)}
					<div class="message {message.user_id === currentUser.id ? 'sent' : 'received'}">
						<div class="message-bubble">
							{#if message.user_id !== currentUser.id}
								<span class="message-username">{message.username}</span>
							{/if}
							<p class="message-content">{message.content}</p>
							<span class="message-time">{formatTime(message.created_at)}</span>
						</div>
					</div>
				{/each}
			{/if}
		</div>
		<form class="message-send bg-body-tertiary" on:submit={sendMessage}>
			<input
				type="text"
				autocomplete="off"
				class="message-input"
				placeholder="Type your message..."
				bind:value={newMessage}
			/>
			<button type="submit" class="send-button"><i class="fa-solid fa-paper-plane" /></button>
		</form>
	</div>
</Skeleton>

<style lang="scss">
	@import '../../main';
	.left-button {
		position: absolute;
		left: 0;
		border: none;
		background: transparent;
		color: $link-color;
		padding: 0 1rem;
		height: 100%;
		font-size: 16pt;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.main {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 60px);
		position: relative;
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		padding-bottom: 80px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.loading,
	.no-messages {
		text-align: center;
		color: $gray-600;
		padding: 2rem;
	}

	.message {
		display: flex;
		margin-bottom: 0.25rem;
		
		&.sent {
			justify-content: flex-end;
			
			.message-bubble {
				background: $primary;
				color: white;
				border-radius: 1rem 1rem 0.25rem 1rem;
			}
			
			.message-time {
				color: rgba(255, 255, 255, 0.7);
			}
		}
		
		&.received {
			justify-content: flex-start;
			
			.message-bubble {
				background: $gray-200;
				color: black;
				border-radius: 1rem 1rem 1rem 0.25rem;
				
				@media (prefers-color-scheme: dark) {
					background: #444;
					color: white;
				}
			}
		}
	}

	.message-bubble {
		max-width: 70%;
		padding: 0.75rem 1rem;
		word-wrap: break-word;
	}

	.message-username {
		font-size: 0.75rem;
		font-weight: 600;
		color: $primary;
		display: block;
		margin-bottom: 0.25rem;
	}

	.message-content {
		margin: 0;
		line-height: 1.4;
	}

	.message-time {
		font-size: 0.65rem;
		color: $gray-600;
		display: block;
		text-align: right;
		margin-top: 0.25rem;
	}

	.message-send {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		@media (prefers-color-scheme: dark) {
			& {
				background: #333 !important;
				color: white;
			}
		}
	}
	.message-input {
		padding: 0.75rem;
		border-radius: 1.5rem;
		border: 1px solid lightgray;
		flex: 1;
		font-size: 1rem;
		outline: none;
		
		&:focus {
			border-color: $primary;
			box-shadow: 0 0 0 2px rgba($primary, 0.2);
		}
		
		@media (prefers-color-scheme: dark) {
			background: #444;
			color: white;
			border-color: #555;
		}
	}
	.send-button {
		position: relative;
		border: 0;
		border-radius: 50%;
		background: $primary;
		height: 44px;
		width: 44px;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.2s;
		
		&:hover {
			background: darken($primary, 10%);
		}
		
		&:active {
			transform: scale(0.95);
		}
	}
</style>
