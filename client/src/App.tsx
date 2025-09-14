import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameBoard } from './components/gaming/Board/GameBoard';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <GameBoard />
      </div>
    </DndProvider>
  );
}

export default App;