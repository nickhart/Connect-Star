import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { createInitialGameState, makeMove } from '@connect-star/game-logic';
import type { GameState } from '@connect-star/types';
import GameBoard from '../components/GameBoard';
import PlayerIndicator from '../components/PlayerIndicator';
import Button from '../components/Button';

export default function GameScreen() {
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
      <View style={styles.content}>
        <Text style={styles.title}>Connect Star</Text>

        {gameState.status === 'waiting' && (
          <View style={styles.waitingContainer}>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
});
