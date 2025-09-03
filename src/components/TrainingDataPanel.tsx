import React, { useState, useEffect } from 'react';
import { Download, Trash2, Database } from 'lucide-react';

interface TrainingDataPanelProps {
  localAI: any;
}

export default function TrainingDataPanel({ localAI }: TrainingDataPanelProps) {
  const [trainingData, setTrainingData] = useState<any[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (localAI) {
      setTrainingData(localAI.getTrainingData());
    }
  }, [localAI]);

  const handleExportData = () => {
    if (!localAI) return;
    
    const data = localAI.exportTrainingData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training_data_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (!localAI) return;
    
    if (confirm('Are you sure you want to clear all training data?')) {
      localAI.clearTrainingData();
      setTrainingData([]);
    }
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Training Data"
      >
        <Database className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-purple-400/30 rounded-lg p-4 w-80 max-h-96 overflow-hidden shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Training Data
        </h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-gray-300">
          <p><strong>Collected:</strong> {trainingData.length} examples</p>
          <p><strong>Status:</strong> {trainingData.length > 0 ? 'Ready for training' : 'No data yet'}</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            disabled={trainingData.length === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleClearData}
            disabled={trainingData.length === 0}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
        
        {trainingData.length > 0 && (
          <div className="max-h-32 overflow-y-auto bg-gray-800 rounded p-2">
            <div className="text-xs text-gray-400 space-y-1">
              {trainingData.slice(-5).map((item, index) => (
                <div key={index} className="border-b border-gray-700 pb-1">
                  <p><strong>Q:</strong> {item.input.substring(0, 30)}...</p>
                  <p><strong>A:</strong> {item.output.substring(0, 30)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>💡 Collecting Q&A pairs for model training</p>
          <p>🎯 Goal: 1000+ examples for custom model</p>
        </div>
      </div>
    </div>
  );
}