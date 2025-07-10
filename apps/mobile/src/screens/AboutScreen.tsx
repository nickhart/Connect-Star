import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../components/Button';

interface AboutScreenProps {
  onBackToMenu: () => void;
}

export function AboutScreen({ onBackToMenu }: AboutScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Back to Menu"
          onPress={onBackToMenu}
          variant="secondary"
        />
        <Text style={styles.title}>About</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect Star 🔴🟡</Text>
          <Text style={styles.sectionText}>
            A modern multi-mode Connect Four game built with TypeScript, React Native, and love.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Game Modes</Text>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>✓</Text>
            <Text style={styles.listText}>
              <Text style={styles.bold}>Local Play:</Text> Two players alternating on the same device
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>🚧</Text>
            <Text style={styles.listText}>
              <Text style={styles.bold}>Online Multiplayer:</Text> Real-time play against remote opponents (Coming Soon)
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>🔮</Text>
            <Text style={styles.listText}>
              <Text style={styles.bold}>AI Opponent:</Text> ML-powered computer opponent (Planned)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>How to Play</Text>
          <Text style={styles.listText}>1. Players take turns dropping colored pieces into columns</Text>
          <Text style={styles.listText}>2. The first player to connect four pieces wins!</Text>
          <Text style={styles.listText}>3. Connections can be horizontal, vertical, or diagonal</Text>
          <Text style={styles.listText}>4. If the board fills up without a winner, it&apos;s a draw</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Features</Text>
          <Text style={styles.listText}>• Smooth piece-dropping animations</Text>
          <Text style={styles.listText}>• Cross-platform: Web and Mobile</Text>
          <Text style={styles.listText}>• Built with modern TypeScript and React</Text>
          <Text style={styles.listText}>• Comprehensive test coverage</Text>
          <Text style={styles.listText}>• Touch-optimized for mobile devices</Text>
        </View>

        <View style={[styles.section, styles.footer]}>
          <Text style={styles.footerText}>
            Built with Turborepo, Next.js, React Native, and Expo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#764ba2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#667eea',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  spacer: {
    width: 120, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listIcon: {
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
    flex: 1,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
  },
});