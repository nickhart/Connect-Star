import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../components/Button';

describe('Button', () => {
  test('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('applies default variant and size classes', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button-primary');
    expect(button).toHaveClass('button-medium');
  });

  test('applies custom variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('button-secondary');
    expect(button).not.toHaveClass('button-primary');
  });

  test('applies custom size classes', () => {
    render(<Button size="large">Large</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('button-large');
    expect(button).not.toHaveClass('button-medium');
  });

  test('applies danger variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('button-danger');
  });

  test('applies small size classes', () => {
    render(<Button size="small">Small</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('button-small');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('button');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('forwards other props to button element', () => {
    render(
      <Button disabled type="submit" data-testid="submit-button">
        Submit
      </Button>
    );
    
    const button = screen.getByTestId('submit-button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('combines all classes correctly', () => {
    render(
      <Button variant="danger" size="large" className="extra-class">
        Complex Button
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button-danger');
    expect(button).toHaveClass('button-large');
    expect(button).toHaveClass('extra-class');
  });

  test('renders with complex children', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});