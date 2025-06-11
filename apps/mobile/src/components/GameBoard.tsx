import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import type { Board } from '@connect-star/types';
import { ROWS, COLS } from '@connect-star/game-logic';

interface GameBoardProps {
  board: Board;
  onColumnPress?: (col: number) => void;
  disabled?: boolean;
}

export default function GameBoard({
  board,
  onColumnPress,
  disabled = false,
}: GameBoardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {Array.from({ length: COLS }).map((_, col) => (
          <TouchableOpacity
            key={col}
            style={styles.column}
            onPress={() => !disabled && onColumnPress?.(col)}
            disabled={disabled}
          >
            {Array.from({ length: ROWS }).map((_, row) => (
              <View
                key={`${row}-${col}`}
                style={[
                  styles.cell,
                  board[row][col] === 'red' && styles.cellRed,
                  board[row][col] === 'yellow' && styles.cellYellow,
                ]}
              />
            ))}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  board: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    gap: 5,
  },
  column: {
    gap: 5,
    padding: 5,
  },
  cell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#1e40af',
  },
  cellRed: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
  cellYellow: {
    backgroundColor: '#fbbf24',
    borderColor: '#f59e0b',
  },
});
