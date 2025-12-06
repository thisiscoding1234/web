// This is the root layout for the app
// Individual pages can override these settings
export const prerender = true;
export const ssr = true;

// Note: Pages that require client-side only rendering (like /chat)
// have their own +page.js that sets prerender = false and ssr = false
