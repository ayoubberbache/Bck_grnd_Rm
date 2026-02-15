# Background Remover Web App

A free, AI-powered background removal tool with Gmail authentication. Built with React and deployed on Vercel.

## ✨ Features

- **Gmail Authentication**: Secure sign-in using Firebase Auth
- **AI Background Removal**: Powered by Hugging Face's RMBG-1.4 model
- **100% Free**: No credit card required, no hidden costs
- **Privacy First**: Images processed client-side, nothing stored
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Instant Download**: Get your processed images immediately

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Google account
- A Firebase project (free tier)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name your project (e.g., "background-remover")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Google Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **Enable**
4. Select a support email
5. Click **Save**

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname
5. Copy the `firebaseConfig` object

### 4. Set Up the Project

```bash
# Create a new React app with Vite
npm create vite@latest background-remover -- --template react
cd background-remover

# Install dependencies
npm install
npm install lucide-react

# Copy the React component
# Replace src/App.jsx with the background-remover.jsx file
```

### 5. Configure Firebase

Open `src/App.jsx` and replace the Firebase configuration at the top:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. Update App Structure

Replace the contents of `src/App.jsx` with the code from `background-remover.jsx`.

Update `src/main.jsx`:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Make sure your `src/index.css` has Tailwind CSS:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 7. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 8. Test Locally

```bash
npm run dev
```

Open `http://localhost:5173` and test the app!

### 9. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? background-remover
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository (push your code to GitHub first)
4. Vercel will auto-detect Vite
5. Click "Deploy"

### 10. Update Firebase Authorized Domains

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Click "Add domain"
3. Add your Vercel domain (e.g., `your-app.vercel.app`)
4. Click "Add"

## 🎨 Customization

### Change Colors

Edit the gradient colors in the JSX:
```javascript
// Current: Indigo to Purple
from-indigo-500 to-purple-600

// Change to any Tailwind colors:
from-blue-500 to-cyan-600    // Blue theme
from-pink-500 to-rose-600    // Pink theme
from-green-500 to-emerald-600 // Green theme
```

### Change App Name

Search for "BackgroundAway" in the code and replace with your preferred name.

### Add Custom Domain

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Update Firebase authorized domains

## 🔧 Troubleshooting

### Firebase Authentication Issues

- Make sure your domain is added to Firebase Authorized domains
- Check that Google sign-in is enabled
- Verify your Firebase config is correct

### Background Removal Not Working

- The Hugging Face API may have rate limits
- Check browser console for errors
- Make sure the image is in a supported format (JPG, PNG, WebP)

### Vercel Deployment Issues

- Make sure `package.json` has the correct build command
- Check that all dependencies are listed
- Verify Node.js version compatibility

## 📝 API Limits

### Hugging Face Inference API (Free)
- **Rate Limit**: Varies, typically generous for personal use
- **Model**: RMBG-1.4 (Background Removal)
- **No API Key Required**: Public inference API

### Firebase Authentication (Free Tier)
- **Monthly Active Users**: Unlimited
- **Google Sign-in**: Free
- **Storage**: Not used in this app

### Vercel Hosting (Free Tier)
- **Bandwidth**: 100 GB/month
- **Build Time**: 100 hours/month
- **Deployments**: Unlimited

## 🎯 Next Steps

Want to enhance your app? Consider:

- Add image history (requires database)
- Support batch processing
- Add filters and effects
- Implement image compression
- Add more AI models (object detection, enhancement, etc.)

## 🤝 Contributing

Feel free to fork and customize this project for your needs!

## 📄 License

MIT License - feel free to use this project however you like!

## 🙏 Credits

- **Background Removal**: Hugging Face RMBG-1.4 model
- **Authentication**: Firebase
- **Hosting**: Vercel
- **Icons**: Lucide React

---

Made with ❤️ and AI
