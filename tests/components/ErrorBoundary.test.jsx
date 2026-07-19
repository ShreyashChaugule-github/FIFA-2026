import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '@/components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test component error');
};

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should render error UI when child throws', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Section failed to load')).toBeInTheDocument();
    
    consoleErrorSpy.mockRestore();
  });

  it('should recover when Try Again is clicked', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Rerender with safe child before clicking try again
    rerender(
      <ErrorBoundary>
        <div data-testid="safe-child">Safe Content</div>
      </ErrorBoundary>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    
    expect(screen.getByTestId('safe-child')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    
    consoleErrorSpy.mockRestore();
  });
});
