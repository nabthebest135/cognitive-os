import React, { useState } from 'react';
import { Play, RotateCcw, Zap } from 'lucide-react';

interface DemoModeProps {
  onDemoText: (text: string) => void;
}

const DemoMode: React.FC<DemoModeProps> = ({ onDemoText }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoScenarios = [
    {
      category: 'Planning',
      examples: [
        'schedule meeting with Sarah tomorrow at 2pm',
        'remind me to call the client on Friday',
        'plan team lunch next week',
        'set deadline for project review'
      ]
    },
    {
      category: 'Coding', 
      examples: [
        'create new React TypeScript project',
        'debug API integration issues',
        'deploy application to AWS',
        'setup Docker development environment'
      ]
    },
    {
      category: 'Research',
      examples: [
        'research machine learning algorithms',
        'analyze market trends for Q4',
        'study quantum computing papers',
        'investigate new JavaScript frameworks'
      ]
    },
    {
      category: 'Communication',
      examples: [
        'email team about project updates',
        'call John about the presentation',
        'follow up with client feedback',
        'send message to support team'
      ]
    },
    {
      category: 'Creative',
      examples: [
        'design new mobile app interface',
        'write blog post about AI trends',
        'brainstorm marketing campaign ideas',
        'sketch logo concepts for startup'
      ]
    }
  ];

  const allExamples = demoScenarios.flatMap(scenario => 
    scenario.examples.map(example => ({ category: scenario.category, text: example }))
  );

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    for (let i = 0; i < allExamples.length; i++) {
      setCurrentStep(i);
      onDemoText(allExamples[i].text);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between examples
    }

    setIsRunning(false);
    setCurrentStep(0);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    onDemoText('');
  };

  return (
    <div className="bg-gray-900/30 border border-purple-400/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-purple-300 font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Demo Mode - Test AI Capabilities
        </h3>
        <div className="flex gap-2">
          <button
            onClick={runDemo}
            disabled={isRunning}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
          >
            <Play className="w-3 h-3" />
            {isRunning ? 'Running...' : 'Start Demo'}
          </button>
          <button
            onClick={resetDemo}
            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {isRunning && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-300 text-sm">
              Testing: {allExamples[currentStep]?.category}
            </span>
            <span className="text-purple-400 text-xs">
              {currentStep + 1} / {allExamples.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / allExamples.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {demoScenarios.map((scenario, index) => (
          <div key={index} className="bg-black/20 rounded-lg p-3">
            <h4 className="text-purple-300 font-medium mb-2 text-sm">{scenario.category}</h4>
            <div className="space-y-1">
              {scenario.examples.slice(0, 2).map((example, exampleIndex) => (
                <button
                  key={exampleIndex}
                  onClick={() => onDemoText(example)}
                  className="w-full text-left text-xs text-purple-200/70 hover:text-purple-200 hover:bg-purple-900/20 p-1 rounded transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-400/20">
        <div className="text-xs text-purple-300 font-medium mb-1">
          🚀 What happens when you click:
        </div>
        <div className="text-xs text-purple-200/70">
          • AI analyzes your intent in real-time<br/>
          • Downloads actual files to your computer<br/>
          • Creates calendar events, opens email drafts<br/>
          • Learns your patterns for future suggestions
        </div>
      </div>
    </div>
  );
};

export default DemoMode;