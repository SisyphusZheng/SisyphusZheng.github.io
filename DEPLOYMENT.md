# FreshPress Deployment Guide

This guide explains how to deploy your FreshPress website to various hosting platforms.

## Table of Contents

- [Static Site Deployment](#static-site-deployment)
  - [Building Your Site](#building-your-site)
  - [GitHub Pages](#github-pages)
  - [Netlify](#netlify)
  - [Vercel](#vercel)
- [Server-Side Deployment](#server-side-deployment)
  - [Deno Deploy](#deno-deploy)
  - [Self-Hosted Server](#self-hosted-server)
- [Advanced Configuration](#advanced-configuration)
  - [Custom Domains](#custom-domains)
  - [HTTPS Setup](#https-setup)
  - [Continuous Integration](#continuous-integration)

## Static Site Deployment

FreshPress can generate a fully static site, allowing deployment to any static hosting provider.

### Building Your Site

First, generate the static site files:

```bash
# Navigate to your project
cd my-freshpress-site

# Generate static files
deno task build

# The output will be in the dist/ directory
```

This will create a `dist` directory containing all the static files needed for your site.

### GitHub Pages

To deploy to GitHub Pages:

1. Create a GitHub repository for your site
2. Build your site with `deno task build`
3. Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # or your default branch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.40.x
          
      - name: Build site
        run: deno task build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. Push to GitHub and enable GitHub Pages in your repository settings

### Netlify

To deploy to Netlify:

1. Build your site with `deno task build`
2. Create a `netlify.toml` file in your project root:

```toml
[build]
  publish = "dist"
  command = "deno task build"

[build.environment]
  DENO_VERSION = "1.40.0"

[[plugins]]
  package = "netlify-plugin-cache-deno"
```

3. Connect your GitHub repository to Netlify
4. Configure the build settings to use the `netlify.toml` file

### Vercel

To deploy to Vercel:

1. Create a `vercel.json` file in your project root:

```json
{
  "buildCommand": "deno task build",
  "outputDirectory": "dist",
  "installCommand": "curl -fsSL https://deno.land/x/install/install.sh | sh"
}
```

2. Connect your GitHub repository to Vercel
3. Configure the project settings to use the `vercel.json` file

## Server-Side Deployment

FreshPress can also be deployed as a server-rendered application.

### Deno Deploy

To deploy to Deno Deploy:

1. Sign up for [Deno Deploy](https://deno.com/deploy)
2. Connect your GitHub repository
3. Create a new project
4. Set the entry point to `main.ts`
5. Deploy!

### Self-Hosted Server

To deploy to your own server:

1. Install Deno on your server
2. Clone your repository
3. Run the production server:

```bash
deno task start
```

4. Use a process manager like PM2 to keep the server running:

```bash
# Install PM2
npm install -g pm2

# Start the server with PM2
pm2 start --interpreter="deno" --interpreter-args="run --allow-all" main.ts

# Save the PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

## Advanced Configuration

### Custom Domains

For most hosting platforms, you can configure a custom domain in the provider's dashboard. Make sure to update your DNS records to point to your hosting provider.

In your FreshPress site, update the `siteConfig.site.url` property in `data/config.ts` to match your custom domain:

```typescript
export const siteConfig = {
  site: {
    title: "My Site",
    description: "My personal website",
    url: "https://mydomain.com", // Update this with your domain
    // ...
  },
  // ...
};
```

### HTTPS Setup

Most hosting providers handle HTTPS automatically. For self-hosted servers, you can use Let's Encrypt to set up free SSL certificates.

### Continuous Integration

Set up a CI/CD pipeline to automatically deploy your site when you push changes to your repository. GitHub Actions, GitLab CI, and other platforms provide easy ways to automate this process.

Example GitHub Actions workflow for Deno Deploy:

```yaml
name: Deploy to Deno Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: your-project-name
          entrypoint: main.ts
          token: ${{ secrets.DENO_DEPLOY_TOKEN }}
```

Remember to add a `DENO_DEPLOY_TOKEN` secret in your GitHub repository settings. 