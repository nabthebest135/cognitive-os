import React, { useState, useEffect } from 'react';
import { Brain, Terminal } from 'lucide-react';
import PWAInstaller from './components/PWAInstaller';
import { CognitiveMirror } from './ai/cognitiveMirror';

function App() {
  const [cognitiveMirror] = useState(() => new CognitiveMirror());

  // Initialize Cognitive Mirror
  useEffect(() => {
    cognitiveMirror.initialize();
    
    // Make mirror globally accessible for predictions
    (window as any).cognitiveMirror = cognitiveMirror;
  }, [cognitiveMirror]);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <PWAInstaller />
            <div className="flex items-center gap-4">
              <div className="bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 text-green-200 px-3 py-2 rounded-lg text-sm">
                📊 {Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 8)}MB RAM • Lightweight
              </div>
              <button
                onClick={() => {
                  const isActive = cognitiveMirror.getCurrentPredictions().length > 0;
                  if (isActive) {
                    alert('🪞 Cognitive Mirror detected context and made predictions! Check top-right for suggestions.');
                  } else {
                    alert('🪞 Cognitive Mirror is watching. Open Gmail, GitHub, or any site to see predictions!');
                  }
                }}
                className="bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/30 text-cyan-200 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🪞 Mirror Status
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Cognitive Mirror
            </h1>
            <Terminal className="w-10 h-10 text-green-400" />
          </div>
          <p className="text-green-300/70 text-xl">
            AI That Predicts Your Needs Before You Ask
          </p>
          <p className="text-cyan-400/60 text-sm mt-2">
            🪞 <strong>Revolutionary:</strong> Watches your activity and suggests what you need next
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-green-400/60">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Context Detection Active
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              AI Predictions Online
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* How It Works */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-green-400/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-green-300 mb-6 text-center">
              🧠 How Cognitive Mirror Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">👁️</div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">Watches</h3>
                <p className="text-green-400/70 text-sm">
                  Monitors your page titles, URLs, and activity to understand context
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">Predicts</h3>
                <p className="text-green-400/70 text-sm">
                  Uses AI to predict what you'll need next based on your current activity
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">Delivers</h3>
                <p className="text-green-400/70 text-sm">
                  Suggests actions and downloads relevant files before you ask
                </p>
              </div>
            </div>
          </div>

          {/* Test Instructions */}
          <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-400/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 text-center">
              🎮 Test Cognitive Mirror
            </h2>
            
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">📧 Email Context</h3>
                <p className="text-green-400/70 mb-2">Open Gmail in another tab, then check top-right for suggestions</p>
                <div className="text-sm text-purple-300">Expected: Email templates, meeting agenda, calendar invite</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">💻 Coding Context</h3>
                <p className="text-green-400/70 mb-2">Visit GitHub or open VS Code, watch for predictions</p>
                <div className="text-sm text-purple-300">Expected: Code templates, debugging checklist, deployment guide</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">📚 Research Context</h3>
                <p className="text-green-400/70 mb-2">Search Wikipedia or read articles about any topic</p>
                <div className="text-sm text-purple-300">Expected: Study plan, summary notes, related resources</div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-cyan-400/80 text-sm">
                💡 Suggestions appear as floating panels in the top-right corner
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-green-400/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-300 mb-4 text-center">
              🔍 Current Detection Status
            </h3>
            
            <div className="text-center space-y-2">
              <p className="text-green-400">
                <strong>Page:</strong> {document.title}
              </p>
              <p className="text-green-400">
                <strong>URL:</strong> {window.location.href}
              </p>
              <p className="text-cyan-400 text-sm mt-4">
                Cognitive Mirror is analyzing this context for predictions...
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-green-400/40">
          <p className="flex items-center justify-center gap-2">
            <Brain className="w-4 h-4" />
            Cognitive Mirror - Revolutionary Predictive AI | Built by <a href="https://github.com/nabthebest135" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Nabhan</a>
          </p>
          <p className="text-xs mt-2">
            Context Awareness • Predictive Intelligence • Privacy-First • Local Processing
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;