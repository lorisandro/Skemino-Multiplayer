import React from 'react';
import { MatchmakingDemo } from '../../pages/MatchmakingDemo';
import DashboardSidebar from './DashboardSidebar';

const GamePageWithSidebar: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex">
        {/* Left Sidebar */}
        <DashboardSidebar />

        {/* Main Game Content */}
        <main className="flex-1">
          <MatchmakingDemo />
        </main>
      </div>
    </div>
  );
};

export default GamePageWithSidebar;