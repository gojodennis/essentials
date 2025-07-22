# Deployment Guide for GitHub

## Keeping Supabase Credentials Secure

When deploying to GitHub, it's crucial to keep your Supabase credentials secure. This guide explains how to do that.

### Local Development

For local development, you'll use the `config.js` file which contains your actual Supabase credentials. This file is listed in `.gitignore` so it won't be committed to your repository.

### GitHub Deployment Options

#### Option 1: GitHub Pages with Environment Configuration

If you're deploying to GitHub Pages, you have a few options for handling credentials:

1. **Use GitHub Secrets and Actions**:
   - Store your Supabase credentials as GitHub Secrets
   - Set up a GitHub Action workflow that generates the `config.js` file during the build process
   - Example workflow file (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Create config file
        run: |
          echo "const SUPABASE_CONFIG = {" > config.js
          echo "  url: '${{ secrets.SUPABASE_URL }}'," >> config.js
          echo "  anonKey: '${{ secrets.SUPABASE_ANON_KEY }}'" >> config.js
          echo "};" >> config.js
      
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: .
```

#### Option 2: Runtime Configuration

Alternatively, you can modify your application to load the configuration at runtime:

1. Create a separate deployment-specific JavaScript file that sets the configuration variables
2. Host this file on a secure server or use a service like Netlify with environment variables

#### Option 3: Environment Variables with Build Tools

If you decide to use a build tool like Webpack or Parcel:

1. Set up environment variables in your build process
2. Use a tool like `dotenv` to load these variables
3. Configure your build tool to inject these variables into your code

## Recommended Approach for Beginners

If you're new to web development, the simplest approach is Option 1 with GitHub Secrets and Actions. This allows you to:

1. Keep your credentials secure
2. Automate the deployment process
3. Avoid exposing sensitive information in your repository

## Testing Your Deployment

Before pushing to GitHub:

1. Make sure `config.js` is in your `.gitignore`
2. Verify that `config.template.js` is included and has placeholder values
3. Test your application with the template configuration to ensure proper error handling

By following these guidelines, you can safely deploy your application to GitHub while keeping your Supabase credentials secure.