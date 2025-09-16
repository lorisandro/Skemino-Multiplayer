import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreGameInterface } from '../components/gaming/PreGameInterface';
import type { Player, DistributionState } from '../types/game';

const PreGamePage: React.FC = () => {
  const navigate = useNavigate();

  // Demo data per la PreGameInterface
  const [gameState, setGameState] = useState<'waiting' | 'matched' | 'distributing' | 'ready' | 'starting'>('waiting');
  const [opponent, setOpponent] = useState<Player | null>(null);

  const currentPlayer: Player = {
    id: 'demo-user',
    username: 'Utente Demo',
    rating: 1000,
    isReady: false,
    isGuest: false
  };

  const distributionState: DistributionState = {
    phase: 'shuffling',
    animationProgress: 0,
    currentCard: 0
  };

  const handleStartGame = () => {
    console.log('Avvio partita richiesto');
    // Simula accettazione match
    if (gameState === 'matched') {
      setGameState('distributing');
      setTimeout(() => setGameState('ready'), 2000);
    } else if (gameState === 'ready') {
      navigate('/game');
    }
  };

  const handleLeaveMatch = () => {
    console.log('Abbandono match richiesto');
    navigate('/home');
  };

  const handleShowSettings = () => {
    console.log('Mostra impostazioni');
    // TODO: Implementare modal impostazioni
  };

  // Simula ricerca avversario
  React.useEffect(() => {
    if (gameState === 'waiting') {
      const timer = setTimeout(() => {
        setOpponent({
          id: 'demo-opponent',
          username: 'SkeminoMaster',
          rating: 1000,
          isReady: false,
          isGuest: false
        });
        setGameState('matched');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState]);

  return (
    <PreGameInterface
      gameState={gameState}
      currentPlayer={currentPlayer}
      opponent={opponent}
      distributionState={distributionState}
      onStartGame={handleStartGame}
      onLeaveMatch={handleLeaveMatch}
      onShowSettings={handleShowSettings}
    />
  );
};

export default PreGamePage;