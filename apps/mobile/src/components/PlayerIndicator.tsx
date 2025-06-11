import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Player } from '@connect-star/types';

interface PlayerIndicatorProps {
  currentPlayer: Player;
  winner?: Player | null;
}

export default function PlayerIndicator({ currentPlayer, winner }: PlayerIndicatorProps) {
  if (winner) {
    return (
      <View style={styles.container}>
        <View style={[styles.piece, winner === 'red' ? styles.redPiece : styles.yellowPiece]} />
        <Text style={[styles.text, styles.winnerText]}>
          Player {winner} wins!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.piece, currentPlayer === 'red' ? styles.redPiece : styles.yellowPiece]} />
      <Text style={styles.text}>
        Player {currentPlayer}'s turn
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  piece: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
  },
  redPiece: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
  yellowPiece: {
    backgroundColor: '#fbbf24',
    borderColor: '#f59e0b',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  winnerText: {
    color: '#10b981',
  },
});