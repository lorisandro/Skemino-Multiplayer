import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MatchmakingDemo } from './pages/MatchmakingDemo';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <MatchmakingDemo />
    </DndProvider>
  );
}

export default App;