import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function PerformanceWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if user is on older hardware or has performance issues
    const checkPerformance = () => {
      const isOlderBrowser = !window.requestIdleCallback;
      const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      const isSlowConnection = (navigator as any).connection && (navigator as any).connection.effectiveType === 'slow-2g';
      
      if (isOlderBrowser || hasLowMemory || isSlowConnection) {
        setShowWarning(true);
      }
    };

    checkPerformance();
  }, []);

  if (!showWarning) return null;

  return (
    <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-yellow-300 font-semibold mb-2">Performance Notice</h3>
          <p className="text-yellow-200 text-sm mb-3">
            Your device may experience slower performance. For best results:
          </p>
          <ul className="text-yellow-200 text-sm space-y-1 mb-3">
            <li>• Close other browser tabs</li>
            <li>• Use Chrome or Edge for better performance</li>
            <li>• Wait for responses before typing more</li>
            <li>• Consider using on a newer device</li>
          </ul>
          <p className="text-xs text-yellow-300">
            This system works best on devices with 8GB+ RAM and modern browsers.
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}