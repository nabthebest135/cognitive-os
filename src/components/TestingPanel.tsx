import React from 'react';
import { UserPreferences, Intent } from '../types';
import { Activity, Target, Clock, Zap } from 'lucide-react';

interface TestingPanelProps {
  preferences: UserPreferences;
  currentIntent: Intent | null;
  processingTime: number;
}

const TestingPanel: React.FC<TestingPanelProps> = ({ 
  preferences, 
  currentIntent, 
  processingTime 
}) => {
  const getAccuracyMetrics = () => {
    if (preferences.intentHistory.length === 0) return null;
    
    const recentHistory = preferences.intentHistory.slice(-10);
    const avgConfidence = recentHistory.reduce((sum, entry) => sum + entry.confidence, 0) / recentHistory.length;
    const highConfidenceCount = recentHistory.filter(entry => entry.confidence > 0.7).length;
    
    return {
      avgConfidence: (avgConfidence * 100).toFixed(1),
      accuracy: ((highConfidenceCount / recentHistory.length) * 100).toFixed(1),
      totalProcessed: preferences.intentHistory.length
    };
  };

  const getIntentDistribution = () => {
    if (preferences.intentHistory.length === 0) return {};
    
    return preferences.intentHistory.reduce((acc, entry) => {
      acc[entry.intent] = (acc[entry.intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const metrics = getAccuracyMetrics();
  const distribution = getIntentDistribution();

  return (
    <div className="bg-gray-900/20 border border-yellow-400/20 rounded-lg p-4">
      <h3 className="text-yellow-300 font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Testing Metrics
      </h3>
      
      <div className="space-y-4">
        {/* Real-time Processing */}
        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium">Real-time Performance</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-yellow-400/70">Processing Time:</span>
              <div className="text-yellow-300 font-mono">{processingTime}ms</div>
            </div>
            <div>
              <span className="text-yellow-400/70">Current Confidence:</span>
              <div className="text-yellow-300 font-mono">
                {currentIntent ? `${(currentIntent.confidence * 100).toFixed(1)}%` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy Metrics */}
        {metrics && (
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">AI Accuracy</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-green-400/70">Avg Confidence:</span>
                <div className="text-green-300 font-mono">{metrics.avgConfidence}%</div>
              </div>
              <div>
                <span className="text-green-400/70">High Accuracy:</span>
                <div className="text-green-300 font-mono">{metrics.accuracy}%</div>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-400/70 text-xs">Total Processed:</span>
              <div className="text-green-300 font-mono text-sm">{metrics.totalProcessed}</div>
            </div>
          </div>
        )}

        {/* Intent Distribution */}
        {Object.keys(distribution).length > 0 && (
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Intent Distribution</span>
            </div>
            <div className="space-y-1">
              {Object.entries(distribution)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([intent, count]) => (
                  <div key={intent} className="flex justify-between items-center text-xs">
                    <span className="text-cyan-400/70 capitalize">{intent}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-cyan-400 h-1 rounded-full"
                          style={{ 
                            width: `${(count / Math.max(...Object.values(distribution))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-cyan-300 font-mono w-6">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Current Status */}
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-xs text-yellow-400/70 mb-1">Current Status:</div>
          <div className="text-yellow-300 text-sm">
            {currentIntent ? (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Processing {currentIntent.category} intent
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                Waiting for input
              </span>
            )}
          </div>
        </div>

        {/* Testing Tips */}
        <div className="border-t border-yellow-400/10 pt-3">
          <div className="text-xs text-yellow-400/60">
            💡 <strong>Testing Tips:</strong><br/>
            • Try different phrasings for same intent<br/>
            • Include names, dates, and file types<br/>
            • Watch confidence improve with use<br/>
            • Check browser console for AI logs
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingPanel;