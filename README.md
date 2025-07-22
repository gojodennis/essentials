# Essentials - Mini Community Feed

A simple community feed where anonymous posts stay for a week, built with HTML, CSS, JavaScript, and Supabase.

## Setup Instructions

### Supabase Configuration

This project uses Supabase for the backend. To set up your own instance:

1. Copy `config.template.js` to `config.js`
2. Replace the placeholder values in `config.js` with your actual Supabase URL and anonymous key

```javascript
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

**Important:** The `config.js` file is included in `.gitignore` to prevent committing sensitive credentials to your repository. Never commit your actual Supabase credentials to GitHub.

### Database Schema

Create a `notes` table in your Supabase project with the following schema:

- `id`: uuid (primary key)
- `text`: text (required)
- `name`: text
- `timestamp`: timestamptz, default: now()

### Running the Project

Simply open `index.html` in your browser to run the project locally.

## Deployment

When deploying to GitHub Pages or any other hosting service:

1. Make sure `config.js` is not included in your repository
2. For GitHub Pages or similar static hosting:
   - Consider using environment variables with a build process
   - Or create a secure way to inject your Supabase credentials at runtime

## Features

- Post anonymous or named notes
- Notes display with relative timestamps
- Indian Standard Time (IST) formatting for older posts
- Simple, clean interface