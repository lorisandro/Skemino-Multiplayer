import React from 'react';

// Test component per verificare che i componenti si carichino
export const ComponentTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🎮 Skèmino</h1>
        <p className="text-gray-600 mb-6">Strategic Multiplayer Board Game</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm">React ✓</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm">Tailwind CSS ✓</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm">TypeScript ✓</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm">Vite Dev Server ✓</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Status:</strong> Ready for game development!
          </p>
        </div>
      </div>
    </div>
  );
};