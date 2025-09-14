import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandArea } from './Cards/HandArea';
import { BoardSquare } from './Board/BoardSquare';
import { useGameStore } from '../../store/gameStore';
import { useCardDistribution, useResponsiveCardLayout, useCardSounds } from '../../hooks/useCardDistribution';
import type { BoardCell } from '../../types/game';

interface GameLayoutProps {
  gameId: string;
  onMakeMove?: (card: any, to: BoardCell) => void;
  onResign?: () => void;
  onOfferDraw?: () => void;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  gameId,
  onMakeMove,
  onResign,
  onOfferDraw,
}) => {
  const {
    gameState,
    currentPlayer,
    opponent,
    selectedCard,
    validMoves,
    isMyTurn,
    selectCard,
  } = useGameStore();

  const { distributionState, startDistribution, canInteract } = useCardDistribution();
  const layout = useResponsiveCardLayout();
  const { playSound } = useCardSounds();

  // Board setup
  const files = ['a', 'b', 'c', 'd', 'e', 'f'];
  const ranks = ['6', '5', '4', '3', '2', '1']; // Reversed for proper display

  // Calculate responsive board size
  const getBoardSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (screenWidth >= 1280) {
      return Math.min(500, screenHeight * 0.6);
    } else if (screenWidth >= 1024) {
      return Math.min(450, screenHeight * 0.55);
    } else if (screenWidth >= 768) {
      return Math.min(400, screenWidth * 0.8);
    } else {
      return Math.min(280, screenWidth * 0.85);
    }
  };

  const boardSize = getBoardSize();
  const squareSize = boardSize / 6;

  // Handle card selection
  const handleCardSelect = (card: any) => {
    if (!canInteract || !isMyTurn) return;
    selectCard(selectedCard?.id === card.id ? null : card);
  };

  // Handle square click for moves
  const handleSquareClick = (cell: BoardCell) => {
    if (!selectedCard || !validMoves.includes(cell) || !canInteract) return;
    onMakeMove?.(selectedCard, cell);
    playSound('deal');
  };

  // Demo: Start distribution on mount (replace with real game start)
  useEffect(() => {
    if (gameState?.status === 'waiting' && gameState.whiteHand.length === 0) {
      // Generate demo cards for distribution
      const generateDemoCards = (color: 'white' | 'black') => {
        return Array.from({ length: 5 }, (_, i) => ({
          id: `${color}-${i}`,
          suit: ['P', 'F', 'C'][i % 3] as any,
          value: String(i + 1) as any,
        }));
      };

      const whiteCards = generateDemoCards('white');
      const blackCards = generateDemoCards('black');

      setTimeout(() => {
        playSound('shuffle');
        startDistribution(whiteCards, blackCards);
      }, 1000);
    }
  }, [gameState?.status, startDistribution, playSound]);

  if (!gameState || !currentPlayer || !opponent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-xl font-semibold mb-4">Setting up game...</div>
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="game-layout min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Distribution overlay */}
      <AnimatePresence>
        {distributionState.isDistributing && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
              <h3 className="text-xl font-semibold mb-4">
                {distributionState.phase === 'shuffling' ? 'Shuffling deck...' : 'Dealing cards...'}
              </h3>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${distributionState.animationProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {distributionState.phase === 'dealing' &&
                  `Card ${distributionState.currentCard}/10`
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[200px_1fr_200px] lg:grid-rows-[auto_1fr_auto] h-screen gap-4 p-4">
        {/* Top bar */}
        <div className="col-span-3 flex justify-between items-center bg-white rounded-lg px-6 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="font-semibold">{opponent.username}</div>
            <div className="text-sm text-gray-600">Rating: {opponent.rating}</div>
            <div className="font-mono text-lg">
              {Math.floor(gameState.blackTime / 60)}:{(gameState.blackTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Skèmino</div>
            <div className="text-sm text-gray-600">Game #{gameId.slice(-8)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-lg">
              {Math.floor(gameState.whiteTime / 60)}:{(gameState.whiteTime % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">Rating: {currentPlayer.rating}</div>
            <div className="font-semibold">{currentPlayer.username}</div>
          </div>
        </div>

        {/* Opponent hand (left) */}
        <div className="flex items-center justify-center">
          <HandArea
            cards={gameState.blackHand}
            playerColor="black"
            selectedCard={null}
            isPlayerTurn={gameState.currentTurn === 'black'}
            isCurrentPlayer={false}
            layout="fan"
            orientation="vertical"
            showCardBacks={true}
            className="h-full"
          />
        </div>

        {/* Game board (center) */}
        <div className="flex items-center justify-center">
          <motion.div
            className="relative"
            style={{ width: boardSize, height: boardSize }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-6 gap-0 border-2 border-gray-800 rounded-lg overflow-hidden shadow-2xl">
              {ranks.map(rank =>
                files.map(file => {
                  const cell = `${file}${rank}` as BoardCell;
                  const position = gameState.board.get(cell);
                  const isValidMove = validMoves.includes(cell);
                  const isVertex = ['a1', 'f1', 'a6', 'f6'].includes(cell);

                  return (
                    <BoardSquare
                      key={cell}
                      cell={cell}
                      position={position}
                      isValidMove={isValidMove}
                      isVertex={isVertex}
                      onClick={() => handleSquareClick(cell)}
                      size={squareSize}
                    />
                  );
                })
              )}
            </div>

            {/* Vertex control indicators */}
            <div className="absolute -inset-4 pointer-events-none">
              <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 rounded-full opacity-75" />
              <div className="absolute top-0 left-0 w-8 h-8 bg-blue-500 rounded-full opacity-75" />
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-red-500 rounded-full opacity-75" />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-500 rounded-full opacity-75" />
            </div>
          </motion.div>
        </div>

        {/* Current player hand (right) */}
        <div className="flex items-center justify-center">
          <HandArea
            cards={gameState.whiteHand}
            playerColor="white"
            selectedCard={selectedCard}
            isPlayerTurn={isMyTurn}
            isCurrentPlayer={true}
            layout="fan"
            orientation="vertical"
            onCardSelect={handleCardSelect}
            className="h-full"
          />
        </div>

        {/* Bottom controls */}
        <div className="col-span-3 flex justify-between items-center bg-white rounded-lg px-6 py-3 shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={onResign}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Resign
            </button>
            <button
              onClick={onOfferDraw}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Draw
            </button>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {gameState.currentTurn === currentPlayer.color ? "Your turn" : "Opponent's turn"}
            </div>
            {selectedCard && (
              <div className="text-sm font-medium">
                Selected: {selectedCard.suit}{selectedCard.value}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Move {gameState.moveHistory.length + 1}
          </div>
        </div>
      </div>

      {/* Tablet layout */}
      <div className="hidden md:flex lg:hidden flex-col h-screen p-4 gap-4">
        {/* Top bar */}
        <div className="flex justify-between items-center bg-white rounded-lg px-4 py-2 shadow-sm">
          <div className="text-sm">{opponent.username} ({opponent.rating})</div>
          <div>Skèmino</div>
          <div className="text-sm">{currentPlayer.username} ({currentPlayer.rating})</div>
        </div>

        {/* Board */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="grid grid-cols-6 gap-0 border-2 border-gray-800 rounded-lg overflow-hidden shadow-xl"
            style={{ width: boardSize, height: boardSize }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {ranks.map(rank =>
              files.map(file => {
                const cell = `${file}${rank}` as BoardCell;
                const position = gameState.board.get(cell);
                const isValidMove = validMoves.includes(cell);
                const isVertex = ['a1', 'f1', 'a6', 'f6'].includes(cell);

                return (
                  <BoardSquare
                    key={cell}
                    cell={cell}
                    position={position}
                    isValidMove={isValidMove}
                    isVertex={isVertex}
                    onClick={() => handleSquareClick(cell)}
                    size={squareSize}
                  />
                );
              })
            )}
          </motion.div>
        </div>

        {/* Hands */}
        <HandArea
          cards={gameState.whiteHand}
          playerColor="white"
          selectedCard={selectedCard}
          isPlayerTurn={isMyTurn}
          isCurrentPlayer={true}
          layout="linear"
          orientation="horizontal"
          onCardSelect={handleCardSelect}
          className="justify-center"
        />

        <HandArea
          cards={gameState.blackHand}
          playerColor="black"
          selectedCard={null}
          isPlayerTurn={gameState.currentTurn === 'black'}
          isCurrentPlayer={false}
          layout="linear"
          orientation="horizontal"
          showCardBacks={true}
          className="justify-center"
        />
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col h-screen">
        {/* Mobile header */}
        <div className="flex justify-between items-center bg-white px-4 py-2 shadow-sm text-sm">
          <div>vs {opponent.username}</div>
          <div>Turn {gameState.moveHistory.length + 1}</div>
          <div>{isMyTurn ? "Your turn" : "Wait"}</div>
        </div>

        {/* Mobile board */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div
            className="grid grid-cols-6 gap-0 border border-gray-600 rounded overflow-hidden shadow-lg"
            style={{ width: boardSize, height: boardSize }}
          >
            {ranks.map(rank =>
              files.map(file => {
                const cell = `${file}${rank}` as BoardCell;
                const position = gameState.board.get(cell);
                const isValidMove = validMoves.includes(cell);
                const isVertex = ['a1', 'f1', 'a6', 'f6'].includes(cell);

                return (
                  <BoardSquare
                    key={cell}
                    cell={cell}
                    position={position}
                    isValidMove={isValidMove}
                    isVertex={isVertex}
                    onClick={() => handleSquareClick(cell)}
                    size={squareSize}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Mobile hands */}
        <div className="bg-white border-t">
          <HandArea
            cards={gameState.whiteHand}
            playerColor="white"
            selectedCard={selectedCard}
            isPlayerTurn={isMyTurn}
            isCurrentPlayer={true}
            layout={layout.handLayout}
            orientation="horizontal"
            onCardSelect={handleCardSelect}
            className="p-3"
          />
          <div className="border-t border-gray-200">
            <HandArea
              cards={gameState.blackHand}
              playerColor="black"
              selectedCard={null}
              isPlayerTurn={gameState.currentTurn === 'black'}
              isCurrentPlayer={false}
              layout="compact"
              orientation="horizontal"
              showCardBacks={true}
              className="p-2 justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};