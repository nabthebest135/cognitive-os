import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Brain, Zap } from 'lucide-react';

interface AnalyticsData {
  totalInteractions: number;
  categoriesUsed: Record<string, number>;
  averageConfidence: number;
  topTopics: string[];
  productivityScore: number;
  streakDays: number;
  timeSpentToday: number;
  weeklyTrend: number[];
}

interface AnalyticsDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AnalyticsDashboard({ isVisible, onClose }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (isVisible) {
      loadAnalytics();
    }
  }, [isVisible]);

  const loadAnalytics = () => {
    // Load from localStorage and calculate analytics
    const preferences = JSON.parse(localStorage.getItem('cos-preferences') || '{}');
    const context = JSON.parse(localStorage.getItem('cos-context') || '{}');
    
    const intentHistory = preferences.intentHistory || [];
    const totalInteractions = intentHistory.length;
    
    // Calculate category distribution
    const categoriesUsed = intentHistory.reduce((acc: Record<string, number>, entry: any) => {
      acc[entry.intent] = (acc[entry.intent] || 0) + 1;
      return acc;
    }, {});

    // Calculate average confidence
    const averageConfidence = intentHistory.length > 0 
      ? intentHistory.reduce((sum: number, entry: any) => sum + entry.confidence, 0) / intentHistory.length
      : 0;

    // Get top topics
    const topicCounts: Record<string, number> = {};
    intentHistory.forEach((entry: any) => {
      entry.entities?.forEach((entity: any) => {
        if (entity.type === 'topic') {
          topicCounts[entity.value] = (topicCounts[entity.value] || 0) + 1;
        }
      });
    });
    
    const topTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    // Calculate productivity score (0-100)
    const productivityScore = Math.min(100, Math.round(
      (totalInteractions * 10) + 
      (averageConfidence * 50) + 
      (Object.keys(categoriesUsed).length * 5)
    ));

    // Calculate streak (simplified)
    const streakDays = Math.floor(totalInteractions / 5); // Rough estimate

    // Weekly trend (mock data for now)
    const weeklyTrend = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5);

    setAnalytics({
      totalInteractions,
      categoriesUsed,
      averageConfidence,
      topTopics,
      productivityScore,
      streakDays,
      timeSpentToday: Math.floor(totalInteractions * 2.5), // Rough estimate in minutes
      weeklyTrend
    });
  };

  if (!isVisible || !analytics) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-purple-400/30 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Your Cognitive Analytics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Interactions */}
          <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-purple-400/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-purple-200">Total Interactions</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analytics.totalInteractions}</p>
            <p className="text-sm text-purple-300">Lifetime cognitive assists</p>
          </div>

          {/* Productivity Score */}
          <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-400/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-green-200">Productivity Score</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analytics.productivityScore}/100</p>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.productivityScore}%` }}
              ></div>
            </div>
          </div>

          {/* Average Confidence */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-400/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-200">AI Confidence</h3>
            </div>
            <p className="text-3xl font-bold text-white">{Math.round(analytics.averageConfidence * 100)}%</p>
            <p className="text-sm text-blue-300">Average prediction accuracy</p>
          </div>

          {/* Time Spent Today */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-400/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-orange-200">Time Today</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analytics.timeSpentToday}m</p>
            <p className="text-sm text-orange-300">Minutes of cognitive assistance</p>
          </div>

          {/* Streak Days */}
          <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-400/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-semibold text-pink-200">Streak</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analytics.streakDays}</p>
            <p className="text-sm text-pink-300">Days of consistent use</p>
          </div>

          {/* Category Distribution */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-400/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-200 mb-3">Category Usage</h3>
            <div className="space-y-2">
              {Object.entries(analytics.categoriesUsed).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-indigo-300 capitalize">{category}</span>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Topics */}
        {analytics.topTopics.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-400/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-200 mb-3">Your Top Topics</h3>
            <div className="flex flex-wrap gap-2">
              {analytics.topTopics.map((topic, index) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-purple-600/30 border border-purple-400/30 rounded-full text-sm text-purple-200"
                >
                  #{index + 1} {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Trend */}
        <div className="mt-6 bg-gradient-to-r from-gray-900/50 to-purple-900/20 border border-gray-400/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Weekly Activity</h3>
          <div className="flex items-end justify-between h-20 gap-1">
            {analytics.weeklyTrend.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t flex-1 transition-all duration-500"
                style={{ height: `${(value / Math.max(...analytics.weeklyTrend)) * 100}%` }}
                title={`Day ${index + 1}: ${value} interactions`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            🧠 Your cognitive patterns are helping shape the future of AI interaction
          </p>
        </div>
      </div>
    </div>
  );
}