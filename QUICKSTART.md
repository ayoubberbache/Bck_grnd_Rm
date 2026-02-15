# ⚡ Quick Start Guide - Background Remover

Get your free background removal app running in 10 minutes!

## 🎯 Step-by-Step Setup

### 1️⃣ Create Firebase Project (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click "**Add project**" → Name it → Click "**Create project**"
3. Go to "**Authentication**" → "**Sign-in method**"
4. Enable "**Google**" → Select support email → Save
5. Go to "**Project Settings**" (⚙️ icon) → Scroll to "**Your apps**"
6. Click **Web icon** `</>` → Register app
7. **Copy the firebaseConfig object** (you'll need this!)

### 2️⃣ Create Your Project (3 minutes)

```bash
# Create project with Vite
npm create vite@latest background-remover -- --template react
cd background-remover

# Install dependencies
npm install
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### 3️⃣ Set Up Project Files (2 minutes)

**Replace these files with the provided ones:**

1. Copy `background-remover.jsx` content to `src/App.jsx`
2. Copy `tailwind.config.js` to root
3. Copy `postcss.config.js` to root

**Update `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Update `src/main.jsx`:**
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

### 4️⃣ Add Your Firebase Config (1 minute)

Open `src/App.jsx` and find this section at the top:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← Replace these
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Paste your Firebase config from Step 1!

### 5️⃣ Test Locally (1 minute)

```bash
npm run dev
```

Open http://localhost:5173 → Sign in with Google → Upload an image!

### 6️⃣ Deploy to Vercel (1 minute)

**Option A: Via CLI**
```bash
npm install -g vercel
vercel login
vercel
```

**Option B: Via GitHub**
1. Push code to GitHub
2. Go to vercel.com → Import repository
3. Deploy!

### 7️⃣ Final Step: Authorize Domain

1. Copy your Vercel URL (e.g., `your-app.vercel.app`)
2. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
3. Click "**Add domain**" → Paste your Vercel URL → Add

## ✅ Done! Your App is Live!

---

## 🆘 Quick Fixes

**"Sign in failed"**
→ Add your domain to Firebase Authorized domains

**"Background removal failed"**
→ Try with a different image (JPG/PNG under 5MB)

**Build errors**
→ Make sure all dependencies are installed: `npm install`

**Tailwind not working**
→ Check that `index.css` has the @tailwind directives

---

## 📚 Full Documentation

See `README.md` for detailed setup, customization, and troubleshooting.

## 🎨 Customize Your App

**Change colors:** Search for `from-indigo-500 to-purple-600` in `App.jsx`
**Change name:** Search for `BackgroundAway` and replace
**Add features:** Check README for enhancement ideas

---

## 💡 Pro Tips

- **Free Limits:** Hugging Face API is generous for personal use
- **No API Keys:** No need to sign up for any additional services
- **Privacy:** Images are processed via API, not stored anywhere
- **Speed:** First load may be slower (model initialization)

---

**Need help?** Check the full README.md or search for specific error messages online.

Happy building! 🚀
