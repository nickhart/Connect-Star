'use client';

import { Button } from '@connect-star/ui';

interface AboutScreenProps {
  onBackToMenu: () => void;
}

export function AboutScreen({ onBackToMenu }: AboutScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBackToMenu} variant="secondary">
            ← Back to Menu
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">About</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Connect Star 🔴🟡
            </h2>
            <p className="text-lg">
              A modern multi-mode Connect Four game built with TypeScript,
              React, and love.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Game Modes</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <strong>Local Play:</strong> Two players alternating on the same
                device
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">🚧</span>
                <strong>Online Multiplayer:</strong> Real-time play against
                remote opponents (Coming Soon)
              </li>
              <li className="flex items-center">
                <span className="text-purple-600 mr-2">🔮</span>
                <strong>AI Opponent:</strong> ML-powered computer opponent
                (Planned)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">How to Play</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Players take turns dropping colored pieces into columns</li>
              <li>The first player to connect four pieces wins!</li>
              <li>Connections can be horizontal, vertical, or diagonal</li>
              <li>If the board fills up without a winner, it&apos;s a draw</li>
            </ol>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Features</h3>
            <ul className="space-y-1">
              <li>• Smooth piece-dropping animations</li>
              <li>• Cross-platform: Web and Mobile</li>
              <li>• Built with modern TypeScript and React</li>
              <li>• Comprehensive test coverage</li>
              <li>• Responsive design for all devices</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              Built with Turborepo, Next.js, React Native, and Expo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
