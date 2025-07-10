import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { registerRootComponent } from 'expo';
import { MainMenuMobile } from './src/components/MainMenuMobile';
import { LocalGameScreen } from './src/screens/LocalGameScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import type { GameMode } from '@connect-star/types';

type AppScreen = 'menu' | 'local-game' | 'about';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');

  const handleGameModeSelect = (mode: GameMode) => {
    if (mode === 'local') {
      setCurrentScreen('local-game');
    } else if (mode === 'multiplayer') {
      // Handled by alert in MainMenuMobile
    } else if (mode === 'ai') {
      // Handled by alert in MainMenuMobile
    }
  };

  const handleAbout = () => {
    setCurrentScreen('about');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'menu' && (
        <MainMenuMobile
          onGameModeSelect={handleGameModeSelect}
          onAbout={handleAbout}
        />
      )}
      
      {currentScreen === 'local-game' && (
        <LocalGameScreen onBackToMenu={handleBackToMenu} />
      )}
      
      {currentScreen === 'about' && (
        <AboutScreen onBackToMenu={handleBackToMenu} />
      )}
      
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default registerRootComponent(App);
