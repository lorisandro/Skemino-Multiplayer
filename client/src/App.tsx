import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameContainer } from './components/gaming/GameContainer';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <GameContainer />
      </div>
    </DndProvider>
  );
}

export default App;