import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { createInitialGameState, makeMove } from '@connect-star/game-logic';
import type { GameState } from '@connect-star/types';
import GameBoard from '../components/GameBoard';
import PlayerIndicator from '../components/PlayerIndicator';
import Button from '../components/Button';

interface LocalGameScreenProps {
  onBackToMenu: () => void;
}

export function LocalGameScreen({ onBackToMenu }: LocalGameScreenProps) {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );

  const handleColumnPress = (col: number) => {
    if (gameState.status !== 'playing') return;

    try {
      const newGameState = makeMove(gameState, col);
      setGameState(newGameState);
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  const startNewGame = () => {
    setGameState({ ...createInitialGameState(), status: 'playing' });
  };

  const resetGame = () => {
    setGameState(createInitialGameState());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="← Menu" onPress={onBackToMenu} variant="secondary" />
        <Text style={styles.title}>Local Play</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        {gameState.status === 'waiting' && (
          <View style={styles.waitingContainer}>
            <Text style={styles.subtitle}>
              Two players alternating on this device
            </Text>
            <Button title="Start Game" onPress={startNewGame} />
          </View>
        )}

        {gameState.status !== 'waiting' && (
          <>
            <PlayerIndicator
              currentPlayer={gameState.currentPlayer}
              winner={gameState.winner}
            />

            <GameBoard
              board={gameState.board}
              onColumnPress={handleColumnPress}
              disabled={gameState.status === 'finished'}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Reset Game"
                onPress={resetGame}
                variant="secondary"
              />
              {gameState.status === 'finished' && (
                <Button title="New Game" onPress={startNewGame} />
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1e40af',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  spacer: {
    width: 80, // Same width as back button for centering
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 20,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
});
