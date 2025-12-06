# Dispatch

<p align="center">
  <img src="static/icons/android-chrome-192x192.png" alt="Dispatch Logo" width="80" height="80">
</p>

<p align="center">
  <strong>A modern, real-time chat application with end-to-end privacy</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Features

- 🔐 **GitHub OAuth Authentication** - Secure sign-in with your GitHub account
- 💬 **Real-time Messaging** - Instant message delivery with Supabase Realtime
- 👥 **Group Chats** - Create and manage group conversations
- 🌙 **Dark Mode** - Automatic theme switching based on system preferences
- 📱 **Responsive Design** - Works beautifully on desktop and mobile
- 🎨 **Customizable Avatars** - Auto-generated DiceBear profile pictures
- 🚀 **Static Deployment** - Deploy to GitHub Pages or any static host

## Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) with TypeScript
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/) + SCSS
- **Fonts**: [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) (display) + [Outfit](https://fonts.google.com/specimen/Outfit) (body)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A [Supabase](https://supabase.com/) account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GoneRogueProductions/dispatchx.git
   cd dispatchx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up the database**
   
   Run the SQL in `supabase-setup.sql` in your Supabase SQL Editor.

5. **Configure GitHub OAuth** (optional but recommended)
   
   In your Supabase dashboard:
   - Go to Authentication → Providers → GitHub
   - Add your GitHub OAuth App credentials
   - Set the callback URL to `https://your-domain.com/authenticate/callback`

6. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173)

## Deployment

### GitHub Pages

1. **Enable GitHub Pages**
   - Go to your repository Settings → Pages
   - Source: "GitHub Actions"

2. **Create the workflow file** `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: ['main']
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: 'pages'
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build
           env:
             VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
             VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: 'build'

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

3. **Add secrets**
   - Go to Settings → Secrets and variables → Actions
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Push to deploy**
   ```bash
   git push origin main
   ```

### Custom Domain

1. Add a `CNAME` file to the `static` folder with your domain
2. Configure DNS with your domain provider
3. Update the `base` path in `svelte.config.js` if needed

### Other Platforms

The build output in `/build` is a static site that can be deployed to:
- Netlify
- Vercel
- Cloudflare Pages
- Any static file host

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `BASE_PATH` | Base path for deployment (e.g., `/repo-name`) | No |

### Supabase Setup

The `supabase-setup.sql` file creates the following tables:
- `rooms` - Chat rooms (direct messages and groups)
- `room_participants` - Group chat members
- `messages` - Chat messages
- `users` - User profiles

## Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run check      # Type-check the codebase
npm run lint       # Run linter
npm run format     # Format code with Prettier
```

### Project Structure

```
src/
├── lib/
│   ├── auth.ts        # Authentication helpers
│   ├── supabase.ts    # Supabase client & types
│   └── fetchIt.ts     # HTTP utility
├── routes/
│   ├── +page.svelte   # Homepage
│   ├── authenticate/  # Auth pages
│   ├── chat/          # Chat functionality
│   ├── policies/      # Legal pages
│   └── profile/       # User profile
└── app.html           # HTML template
```

### Code Style

- TypeScript for type safety
- SCSS with Bootstrap variables
- Mobile-first responsive design
- Always support dark mode

See `.github/copilot-instructions.md` for detailed guidelines.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the [MPL 2.0 License](LICENSE).

---

<p align="center">
  Made with ❤️ by the Dispatch team
</p>
