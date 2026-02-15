import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, LogOut, Upload, Loader, Sparkles, Check } from 'lucide-react';

// Firebase configuration - REPLACE WITH YOUR OWN VALUES
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const BackgroundRemover = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize Firebase
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
    script.async = true;
    document.head.appendChild(script);

    const authScript = document.createElement('script');
    authScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js';
    authScript.async = true;
    document.head.appendChild(authScript);

    script.onload = () => {
      authScript.onload = () => {
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        
        window.firebase.auth().onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
        });
      };
    };

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(authScript);
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      await window.firebase.auth().signInWithPopup(provider);
    } catch (error) {
      setError('Failed to sign in. Please try again.');
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await window.firebase.auth().signOut();
      setOriginalImage(null);
      setProcessedImage(null);
    } catch (error) {
      setError('Failed to sign out.');
      console.error(error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
      setProcessedImage(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = async () => {
    if (!originalImage) return;

    setProcessing(true);
    setError('');

    try {
      // Convert base64 to blob
      const response = await fetch(originalImage);
      const blob = await response.blob();

      // Use Hugging Face Inference API (free)
      const HF_API_URL = "https://api-inference.huggingface.co/models/briaai/RMBG-1.4";
      
      const hfResponse = await fetch(HF_API_URL, {
        method: 'POST',
        body: blob,
        headers: {
          'Content-Type': blob.type,
        }
      });

      if (!hfResponse.ok) {
        throw new Error('Background removal failed');
      }

      const resultBlob = await hfResponse.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
    } catch (err) {
      setError('Failed to remove background. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin">
          <Loader className="w-12 h-12 text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                BackgroundAway
              </h1>
              <p className="text-gray-600 text-lg">
                Remove backgrounds instantly with AI
              </p>
            </div>

            <button
              onClick={signInWithGoogle}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="group-hover:translate-x-1 transition-transform">
                Continue with Google
              </span>
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              100% free • No credit card required
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center rotate-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BackgroundAway
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-gray-200/50">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full ring-2 ring-indigo-500/20"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {user.displayName}
                </span>
              </div>
              <button
                onClick={signOut}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-600 border border-transparent hover:border-red-200"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Upload className="w-6 h-6 text-indigo-600" />
              Upload Image
            </h2>

            {!originalImage ? (
              <div
                className={`relative border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/50 scale-105'
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl">
                    <Camera className="w-10 h-10 text-indigo-600" />
                  </div>
                  
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      Drop your image here
                    </p>
                    <p className="text-gray-500 mb-4">or</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Upload className="w-5 h-5" />
                      Browse Files
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-4">
                    Supports: JPG, PNG, WebP
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-xl">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-auto"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                      Original
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={removeBackground}
                    disabled={processing}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Remove Background
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setOriginalImage(null);
                      setProcessedImage(null);
                    }}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Check className="w-6 h-6 text-green-600" />
              Result
            </h2>

            <div className="relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-xl min-h-[400px] flex items-center justify-center">
              {processedImage ? (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="relative w-full h-auto"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Processed
                    </span>
                  </div>
                  <button
                    onClick={downloadImage}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    Download
                  </button>
                </>
              ) : (
                <div className="text-center p-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-4">
                    <Sparkles className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg font-medium">
                    {processing
                      ? 'AI is working its magic...'
                      : originalImage
                      ? 'Click "Remove Background" to start'
                      : 'Upload an image to get started'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Advanced machine learning models remove backgrounds with incredible accuracy
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">100% Free</h3>
            <p className="text-gray-600 text-sm">
              No subscriptions, no hidden fees. Process unlimited images for free
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 hover:border-green-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-gray-600 text-sm">
              Your images are processed securely and never stored on our servers
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 bg-white/50 backdrop-blur-lg mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Made with ❤️ using AI • Powered by Hugging Face • Hosted on Vercel
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BackgroundRemover;
