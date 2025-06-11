import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { registerRootComponent } from 'expo';
import GameScreen from './src/screens/GameScreen';

function App() {
  return (
    <View style={styles.container}>
      <GameScreen />
      <StatusBar style="auto" />
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