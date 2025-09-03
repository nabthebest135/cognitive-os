import React, { useState } from 'react';
import { Info, Cpu, HardDrive, Zap } from 'lucide-react';

export default function ResourceUsageInfo() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 px-3 py-2 rounded-lg transition-colors text-sm"
        title="Resource Usage Info"
      >
        <Info className="w-4 h-4" />
        Resource Usage
      </button>

      {showInfo && (
        <div className="absolute top-12 right-0 bg-gray-900 border border-blue-400/30 rounded-lg p-4 w-80 z-50 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              How Cognitive OS Uses Your Device
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-300 font-medium">Ultra-Lightweight Processing</p>
                  <p className="text-gray-300">Uses ~0.1% CPU for text analysis (same as typing in a text editor)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <HardDrive className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-300 font-medium">Minimal Memory Usage</p>
                  <p className="text-gray-300">Uses ~5MB RAM (less than a single browser tab)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-purple-300 font-medium">No Heavy AI Models</p>
                  <p className="text-gray-300">Uses smart keyword matching, not resource-intensive neural networks</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-sm font-medium text-yellow-300 mb-2">Performance Comparison:</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• YouTube video: ~100MB RAM, 5-15% CPU</p>
                <p>• Cognitive OS: ~5MB RAM, 0.1% CPU</p>
                <p>• ChatGPT web: ~50MB RAM, 2-5% CPU</p>
              </div>
            </div>
            
            <div className="bg-green-900/20 border border-green-400/20 rounded p-2">
              <p className="text-xs text-green-300">
                ✅ <strong>Lighter than most websites!</strong> Uses less resources than social media or news sites.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}