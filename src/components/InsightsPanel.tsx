import React from 'react';
import { UserPreferences } from '../types';
import { BarChart3, Clock, TrendingUp, Brain } from 'lucide-react';

interface InsightsPanelProps {
  preferences: UserPreferences;
  insights: string[];
  proactiveSuggestions?: string[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ preferences, insights, proactiveSuggestions = [] }) => {
  const getRecentActivity = () => {
    if (preferences.intentHistory.length === 0) return 'No recent activity';
    
    const recent = preferences.intentHistory.slice(-5);
    const intentCounts = recent.reduce((acc, entry) => {
      acc[entry.intent] = (acc[entry.intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="bg-gray-900/20 border border-cyan-400/20 rounded-lg p-6">
      <h3 className="text-cyan-300 font-semibold mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        AI Insights
      </h3>
      
      <div className="space-y-4">
        {/* Processing Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">Total Processed</span>
            </div>
            <p className="text-green-400 text-lg font-mono">{preferences.intentHistory.length}</p>
          </div>
          
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Last Active</span>
            </div>
            <p className="text-cyan-400 text-sm font-mono">
              {preferences.lastActivity ? 
                new Date(preferences.lastActivity).toLocaleTimeString() : 
                'Never'
              }
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        {Array.isArray(recentActivity) && recentActivity.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">Recent Patterns</span>
            </div>
            <div className="space-y-1">
              {recentActivity.map(([intent, count], index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-green-400/70 capitalize">{intent}</span>
                  <span className="text-green-400 font-mono">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        {insights.length > 0 && (
          <div>
            <p className="text-green-400/70 text-sm mb-2">AI Analysis:</p>
            <div className="space-y-1">
              {insights.map((insight, index) => (
                <p key={index} className="text-green-300/80 text-xs">
                  • {insight}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Proactive Suggestions */}
        {(proactiveSuggestions.length > 0 || preferences.intentHistory.length > 5) && (
          <div className="border-t border-cyan-400/10 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">COS Proactive Insights</span>
            </div>
            <div className="space-y-2">
              {proactiveSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-cyan-900/10 rounded-lg p-2">
                  <p className="text-cyan-300/80 text-xs">
                    🚀 {suggestion}
                  </p>
                </div>
              ))}
              {proactiveSuggestions.length === 0 && preferences.intentHistory.length > 5 && (
                <div className="bg-cyan-900/10 rounded-lg p-2">
                  <p className="text-cyan-300/80 text-xs">
                    🧠 COS is analyzing your patterns to suggest intelligent automations...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Privacy Notice */}
        <div className="border-t border-green-400/10 pt-4 mt-4">
          <p className="text-green-400/50 text-xs">
            🔒 Zero-server architecture. All AI processing happens locally on your device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;