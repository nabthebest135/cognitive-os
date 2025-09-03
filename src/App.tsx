import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Terminal, Zap } from 'lucide-react';
import { CognitiveEngine } from './ai/cognitiveEngine';
import { Intent, UserPreferences, IntentHistoryEntry } from './types';
import IntentDisplay from './components/IntentDisplay';
import InsightsPanel from './components/InsightsPanel';
import DemoMode from './components/DemoMode';
import TestingPanel from './components/TestingPanel';
import { ActionExecutor } from './actions/ActionExecutor';

function App() {
  const [userInput, setUserInput] = useState('');
  const [currentIntent, setCurrentIntent] = useState<Intent | null>(null);
  const [showConfirmation, setShowConfirmation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cognitiveEngine] = useState(() => new CognitiveEngine());
  const [actionExecutor] = useState(() => new ActionExecutor());
  const [preferences, setPreferences] = useState<UserPreferences>({ 
    intentHistory: [], 
    lastActivity: '',
    learningData: []
  });
  const [insights, setInsights] = useState<string[]>([]);
  const [proactiveSuggestions, setProactiveSuggestions] = useState<string[]>([]);
  const [processingTime, setProcessingTime] = useState<number>(0);

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cos-preferences');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }
  }, []);

  // Initialize cognitive engine
  useEffect(() => {
    cognitiveEngine.initialize();
  }, [cognitiveEngine]);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem('cos-preferences', JSON.stringify(newPrefs));
  }, []);

  // Process user input with AI
  const processInput = useCallback(async (text: string) => {
    if (!text.trim()) {
      setCurrentIntent(null);
      setProcessingTime(0);
      return;
    }

    console.log('🧠 Processing input:', text);
    const startTime = performance.now();
    setIsProcessing(true);
    
    try {
      const intent = await cognitiveEngine.processInput(text);
      const endTime = performance.now();
      const processingDuration = Math.round(endTime - startTime);
      
      console.log('✅ Intent processed:', intent);
      setCurrentIntent(intent);
      setProcessingTime(processingDuration);
      
      // Update insights and proactive suggestions
      const newInsights = cognitiveEngine.getInsights(preferences);
      const newProactiveSuggestions = cognitiveEngine.getProactiveSuggestions(preferences);
      setInsights(newInsights);
      setProactiveSuggestions(newProactiveSuggestions);
    } catch (error) {
      console.error('❌ Failed to process input:', error);
      setCurrentIntent(null);
      setProcessingTime(0);
    } finally {
      setIsProcessing(false);
    }
  }, [cognitiveEngine, preferences]);

  // Debounced input processing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      processInput(userInput);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [userInput, processInput]);

  // Handle suggestion click
  const handleSuggestionClick = async () => {
    if (currentIntent) {
      setIsProcessing(true);
      
      try {
        // Execute the actual action
        const result = await actionExecutor.executeAction(currentIntent, userInput);
        
        if (result.success) {
          setShowConfirmation(result.message);
        } else {
          setShowConfirmation('❌ Action failed: ' + result.message);
        }
        
        // Create history entry
        const historyEntry: IntentHistoryEntry = {
          text: userInput,
          intent: currentIntent.category,
          confidence: currentIntent.confidence,
          timestamp: new Date().toISOString(),
          entities: currentIntent.entities || []
        };

        // Update preferences with new intent history
        const newPrefs = {
          ...preferences,
          intentHistory: [...preferences.intentHistory.slice(-49), historyEntry],
          lastActivity: new Date().toISOString()
        };
        savePreferences(newPrefs);

        // Provide positive feedback to the learning system
        cognitiveEngine.updateLearningData(userInput, currentIntent.category, 'positive');

        // Clear confirmation after 6 seconds
        setTimeout(() => setShowConfirmation(''), 6000);
        
        // Clear input after action
        setUserInput('');
      } catch (error) {
        console.error('Action execution failed:', error);
        setShowConfirmation('❌ Action execution failed');
        setTimeout(() => setShowConfirmation(''), 4000);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Cognitive OS
            </h1>
            <Terminal className="w-10 h-10 text-green-400" />
          </div>
          <p className="text-green-300/70 text-xl">
            Your Personal Cognitive Operating System • Privacy-First • On-Device AI
          </p>
          <p className="text-green-400/50 text-sm mt-2">
            A proactive AI layer that learns your intentions and suggests actions before you ask
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-green-400/60">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              TensorFlow.js Active
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              Entity Extraction Online
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Demo Mode */}
            {/* Demo Mode - Make it more prominent */}
            <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-400/30 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-purple-300 mb-2">
                  🎮 Try the Demo - See the Magic!
                </h2>
                <p className="text-purple-200/70">
                  Watch Cognitive OS predict your needs and take real actions
                </p>
              </div>
              <DemoMode onDemoText={setUserInput} />
            </div>
            {/* Input Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-green-400/20 rounded-lg p-8">
              <label className="block text-green-300 text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                What are you thinking about?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userInput.trim()) {
                      processInput(userInput);
                    }
                  }}
                  className="w-full bg-black border-2 border-green-400/30 rounded-lg px-6 py-4 text-green-400 placeholder-green-400/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-lg"
                  placeholder="Type your thoughts, plans, or ideas... (Press Enter to analyze)"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {(userInput || isProcessing) && (
                    <Zap className={`w-5 h-5 text-yellow-400 ${isProcessing ? 'animate-spin' : 'animate-pulse'}`} />
                  )}
                  {userInput.trim() && !isProcessing && (
                    <button
                      onClick={() => processInput(userInput)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Analyze
                    </button>
                  )}
                </div>
              </div>
              
              {/* Real-time feedback */}
              {userInput && !isProcessing && (
                <div className="mt-3 text-sm text-green-400/60">
                  <span className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                    Analyzing with local AI models...
                  </span>
                </div>
              )}
            </div>

            {/* Intent Display */}
            <IntentDisplay 
              intent={currentIntent}
              onActionClick={handleSuggestionClick}
              isProcessing={isProcessing}
            />

            {/* Confirmation Message */}
            {showConfirmation && (
              <div className="bg-green-900/20 border border-green-400 rounded-lg p-4 animate-fade-in">
                <div className="flex items-center gap-2 text-green-300">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">{showConfirmation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Insights Panel */}
          <div className="lg:col-span-1 space-y-6">
            <InsightsPanel 
              preferences={preferences} 
              insights={insights} 
              proactiveSuggestions={proactiveSuggestions}
            />
            <TestingPanel 
              preferences={preferences}
              currentIntent={currentIntent}
              processingTime={processingTime}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-green-400/40">
          <p className="flex items-center justify-center gap-2">
            <Brain className="w-4 h-4" />
            Cognitive OS - The Future of Personal AI | Powered by TensorFlow.js & Compromise.js
          </p>
          <p className="text-xs mt-2">
            Proactive Intelligence • Zero Server Dependency • Complete Privacy
          </p>
        </div>
      </div>


    </div>
  );
}

export default App;