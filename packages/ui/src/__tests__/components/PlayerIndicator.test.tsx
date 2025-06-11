import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlayerIndicator } from '../../components/PlayerIndicator';

describe('PlayerIndicator', () => {
  test('renders current player indicator', () => {
    render(<PlayerIndicator currentPlayer="red" />);
    
    expect(screen.getByText(/Player red's turn/i)).toBeInTheDocument();
    const container = screen.getByText(/Player red's turn/i).parentElement;
    expect(container).toHaveClass('player-indicator');
    expect(container).toHaveClass('current');
  });

  test('renders different current player', () => {
    render(<PlayerIndicator currentPlayer="yellow" />);
    
    expect(screen.getByText(/Player yellow's turn/i)).toBeInTheDocument();
    const container = screen.getByText(/Player yellow's turn/i).parentElement;
    expect(container).toHaveClass('player-indicator');
    expect(container).toHaveClass('current');
  });

  test('displays winner when game is won', () => {
    render(<PlayerIndicator currentPlayer="red" winner="yellow" />);
    
    expect(screen.getByText(/Player yellow wins!/i)).toBeInTheDocument();
    const container = screen.getByText(/Player yellow wins!/i).parentElement;
    expect(container).toHaveClass('player-indicator');
    expect(container).toHaveClass('winner');
  });

  test('displays different winner', () => {
    render(<PlayerIndicator currentPlayer="yellow" winner="red" />);
    
    expect(screen.getByText(/Player red wins!/i)).toBeInTheDocument();
    const container = screen.getByText(/Player red wins!/i).parentElement;
    expect(container).toHaveClass('player-indicator');
    expect(container).toHaveClass('winner');
  });

  test('accepts custom className', () => {
    render(<PlayerIndicator currentPlayer="red" className="custom-class" />);
    
    const container = screen.getByText(/Player red's turn/i).parentElement;
    expect(container).toHaveClass('custom-class');
    expect(container).toHaveClass('player-indicator');
  });

  test('shows player piece for current player', () => {
    const { container } = render(<PlayerIndicator currentPlayer="red" />);
    const playerPiece = container.querySelector('.player-piece.player-red');
    
    expect(playerPiece).toBeInTheDocument();
  });

  test('shows player piece for winner', () => {
    const { container } = render(<PlayerIndicator currentPlayer="red" winner="yellow" />);
    const playerPiece = container.querySelector('.player-piece.player-yellow');
    
    expect(playerPiece).toBeInTheDocument();
  });
});