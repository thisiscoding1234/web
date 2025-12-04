# Copilot Instructions for Dispatch

This document provides guidelines for GitHub Copilot and other AI assistants working on the Dispatch codebase.

## Project Overview

Dispatch is a real-time chat application built with:
- **Frontend**: SvelteKit with TypeScript
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Authentication**: GitHub OAuth via Supabase Auth
- **Styling**: Bootstrap 5, Bootstrap Icons, SCSS
- **Deployment**: GitHub Pages (static site)

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for all new files when possible
- Use `const` by default, `let` when reassignment is needed
- Prefer async/await over callbacks
- Use descriptive variable and function names

### Svelte Components
- Use `<script lang="ts">` for TypeScript support
- Keep components focused and single-purpose
- Use Svelte stores for shared state
- Import styles with `<style lang="scss">`

### SCSS/CSS
- Use Bootstrap variables where available (e.g., `$primary`, `$gray-600`)
- Follow BEM-like naming for custom classes
- Always consider dark mode with `@media (prefers-color-scheme: dark)`
- Use the defined font variables:
  - Display font: `'Instrument Serif', Georgia, serif`
  - Body font: `'Outfit', sans-serif`

### File Organization
```
src/
├── lib/           # Shared utilities and stores
│   ├── auth.ts    # Authentication helpers
│   ├── supabase.ts # Supabase client
│   └── ...
├── routes/        # SvelteKit routes
│   ├── +page.svelte       # Homepage
│   ├── authenticate/      # Auth pages
│   ├── chat/              # Chat functionality
│   └── ...
└── app.html       # HTML template
```

## Key Patterns

### Avatar URLs
Use the DiceBear API for generating user avatars:
```typescript
import { getAvatarUrl } from '$lib/auth';
const avatarUrl = getAvatarUrl(username);
```

### Supabase Queries
```typescript
import { supabase, isSupabaseConfigured } from '$lib/supabase';

// Always check if Supabase is configured
if (!isSupabaseConfigured) {
  // Use demo data
  return;
}

// Use Supabase
const { data, error } = await supabase.from('table').select('*');
```

### Real-time Subscriptions
```typescript
const subscription = supabase
  .channel('channel-name')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, 
    (payload) => { /* handle change */ }
  )
  .subscribe();

// Clean up on destroy
onDestroy(() => {
  supabase.removeChannel(subscription);
});
```

### Responsive Design
- Mobile-first approach
- Use Bootstrap breakpoints: `sm` (576px), `md` (768px), `lg` (992px), `xl` (1200px)
- Navbar moves to top on desktop (≥992px)

## Common Tasks

### Adding a New Page
1. Create `src/routes/pagename/+page.svelte`
2. Add `+page.js` if client-side only (disable prerendering)
3. Import common styles with `@import '../main';`

### Adding Supabase Functionality
1. Update `supabase-setup.sql` with new tables/columns
2. Add TypeScript interfaces in `src/lib/supabase.ts`
3. Implement real-time subscriptions where needed

### Styling Components
1. Use Bootstrap utility classes when possible
2. Use Bootstrap Icons (`<i class="bi bi-icon-name">`)
3. Add custom SCSS in component's `<style>` block
4. Consider both light and dark modes

## Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Build & Deploy
```bash
npm run dev     # Development server
npm run build   # Production build for GitHub Pages
npm run preview # Preview production build
```

## Testing Checklist
- [ ] Component renders correctly
- [ ] Dark mode looks good
- [ ] Mobile responsive
- [ ] No text overflow
- [ ] Accessibility (keyboard navigation, ARIA labels)
- [ ] Demo mode works (when Supabase not configured)
