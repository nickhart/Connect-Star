import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Button from './Button';
import type { GameMode } from '@connect-star/types';

interface MainMenuMobileProps {
  onGameModeSelect: (mode: GameMode) => void;
  onAbout: () => void;
}

export function MainMenuMobile({
  onGameModeSelect,
  onAbout,
}: MainMenuMobileProps) {
  const handleMultiplayerSelect = () => {
    Alert.alert(
      'Coming Soon!',
      'Online multiplayer is coming soon! Please check back later.',
      [{ text: 'OK' }]
    );
  };

  const handleAISelect = () => {
    Alert.alert(
      'Coming Soon!',
      'AI mode is coming soon! Please check back later.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connect Star</Text>
        <Text style={styles.subtitle}>🔴🟡 Connect Four</Text>
      </View>

      <View style={styles.options}>
        <Button
          title="Play Locally"
          onPress={() => onGameModeSelect('local')}
          variant="primary"
        />

        <Button
          title="Play Online"
          onPress={handleMultiplayerSelect}
          variant="secondary"
        />

        <Button
          title="Play vs Computer (Coming Soon)"
          onPress={handleAISelect}
          variant="secondary"
          disabled
        />

        <Button title="About" onPress={onAbout} variant="secondary" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.description}>
          Choose your game mode to get started!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#667eea',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  options: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 32,
    gap: 16,
  },
  footer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
});
