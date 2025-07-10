import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainMenu } from '../../components/MainMenu';

describe('MainMenu', () => {
  const mockOnGameModeSelect = jest.fn();
  const mockOnAbout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title and subtitle', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    expect(screen.getByText('Connect Star')).toBeInTheDocument();
    expect(screen.getByText('🔴🟡 Connect Four')).toBeInTheDocument();
  });

  it('renders all game mode buttons', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    expect(screen.getByText('Play Locally')).toBeInTheDocument();
    expect(screen.getByText('Play Online')).toBeInTheDocument();
    expect(screen.getByText('Play vs Computer')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('calls onGameModeSelect with "local" when Play Locally is clicked', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    fireEvent.click(screen.getByText('Play Locally'));
    expect(mockOnGameModeSelect).toHaveBeenCalledWith('local');
  });

  it('calls onGameModeSelect with "multiplayer" when Play Online is clicked', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    fireEvent.click(screen.getByText('Play Online'));
    expect(mockOnGameModeSelect).toHaveBeenCalledWith('multiplayer');
  });

  it('calls onAbout when About button is clicked', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    fireEvent.click(screen.getByText('About'));
    expect(mockOnAbout).toHaveBeenCalled();
  });

  it('disables the AI mode button', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    const aiButton = screen.getByText('Play vs Computer');
    expect(aiButton).toBeDisabled();
  });

  it('shows "Coming Soon" text for AI mode', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    expect(screen.getByText('(Coming Soon)')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MainMenu
        onGameModeSelect={mockOnGameModeSelect}
        onAbout={mockOnAbout}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('main-menu', 'custom-class');
  });

  it('shows the description text', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    expect(
      screen.getByText('Choose your game mode to get started!')
    ).toBeInTheDocument();
  });

  it('does not call onGameModeSelect when AI button is clicked (disabled)', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    fireEvent.click(screen.getByText('Play vs Computer'));
    expect(mockOnGameModeSelect).not.toHaveBeenCalledWith('ai');
  });

  it('has proper accessibility attributes', () => {
    render(
      <MainMenu onGameModeSelect={mockOnGameModeSelect} onAbout={mockOnAbout} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4); // Local, Online, AI, About

    // Check that buttons are properly enabled/disabled
    expect(screen.getByText('Play Locally')).toBeEnabled();
    expect(screen.getByText('Play Online')).toBeEnabled();
    expect(screen.getByText('Play vs Computer')).toBeDisabled();
    expect(screen.getByText('About')).toBeEnabled();
  });
});
