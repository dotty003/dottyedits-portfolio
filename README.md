# Dotty Edits - Professional Video Portfolio

A modern portfolio website for video editing professionals, built with React, TypeScript, and Vite.

## Features

- 🎬 **Dynamic Portfolio**: Long-form and short-form video projects
- 📹 **Google Drive Integration**: Embed videos directly from Google Drive
- 🔐 **Admin Dashboard**: Password-protected admin panel to manage projects
- ⚡ **Vercel Ready**: Serverless API routes for easy deployment

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Vercel account (for deployment)
- A GitHub account (for version control)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your settings:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ADMIN_PASSWORD=your_admin_password
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

### Admin Dashboard

Access the admin panel at `/admin.html` and login with your `ADMIN_PASSWORD`.

From the admin dashboard you can:
- Add new projects with Google Drive video links
- Edit existing project details
- Delete projects

### Google Drive Videos

To embed a video from Google Drive:

1. Upload your video to Google Drive
2. Right-click → Share → Change to "Anyone with the link"
3. Copy the sharing link
4. Paste it in the admin dashboard when adding/editing a project

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dottyedits-portfolio.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `ADMIN_PASSWORD`: Your admin password (choose a strong one!)
5. Click "Deploy"

### Step 3: Configure Domain (Optional)

In Vercel project settings, you can add a custom domain.

## Project Structure

```
├── api/                  # Vercel serverless functions
│   ├── projects.ts       # GET /api/projects (public)
│   └── admin/
│       ├── auth.ts       # POST /api/admin/auth
│       └── projects.ts   # CRUD /api/admin/projects
├── components/           # React components
├── data/
│   └── projects.json     # Project data storage
├── admin.html            # Admin dashboard
├── vercel.json           # Vercel configuration
└── ...
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (via CDN for admin), Custom CSS
- **Backend**: Vercel Serverless Functions
- **Storage**: JSON file (committed to repo)

## License

MIT
