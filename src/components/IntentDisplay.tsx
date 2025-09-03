import React from 'react';
import { Intent } from '../types';
import { Sparkles, Target, Users, Calendar, Code, FileText, MessageCircle, Palette } from 'lucide-react';

interface IntentDisplayProps {
  intent: Intent | null;
  onActionClick: () => void;
  isProcessing: boolean;
}

const IntentDisplay: React.FC<IntentDisplayProps> = ({ intent, onActionClick, isProcessing }) => {
  const getIntentIcon = (category: string) => {
    switch (category) {
      case 'planning': return <Calendar className="w-5 h-5" />;
      case 'coding': return <Code className="w-5 h-5" />;
      case 'research': return <FileText className="w-5 h-5" />;
      case 'communication': return <MessageCircle className="w-5 h-5" />;
      case 'creative': return <Palette className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-400';
    if (confidence > 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  if (isProcessing) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-sm border border-green-400/10 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="ml-3 text-green-300">Processing with AI...</span>
        </div>
      </div>
    );
  }

  if (!intent) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-sm border border-green-400/10 rounded-lg p-6">
        <h2 className="text-green-300 text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          COS Suggestions
        </h2>
        <div className="min-h-[100px] flex items-center justify-center">
          <div className="text-green-400/50 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>I'm listening...</p>
            <p className="text-sm mt-1">Start typing to see AI suggestions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm border border-green-400/10 rounded-lg p-6">
      <h2 className="text-green-300 text-xl font-semibold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5" />
        COS Suggestions
      </h2>
      
      <div className="space-y-4">
        {/* Intent Analysis */}
        <div className="bg-black/30 rounded-lg p-4 border border-green-400/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getIntentIcon(intent.category)}
              <span className="text-green-300 font-medium capitalize">{intent.category}</span>
            </div>
            <div className={`text-sm font-mono ${getConfidenceColor(intent.confidence)}`}>
              {(intent.confidence * 100).toFixed(1)}%
            </div>
          </div>
          
          {/* Entities */}
          {intent.entities && intent.entities.length > 0 && (
            <div className="mt-3">
              <p className="text-green-400/70 text-sm mb-2">Detected entities:</p>
              <div className="flex flex-wrap gap-2">
                {intent.entities.map((entity, index) => (
                  <span
                    key={index}
                    className="bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded text-xs border border-cyan-400/20"
                  >
                    {entity.type}: {entity.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onActionClick}
          className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-black font-semibold py-4 px-6 rounded-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-green-400/25"
        >
          <span className="text-lg">{intent.icon}</span>
          <span>{intent.suggestion}</span>
          <Sparkles className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default IntentDisplay;