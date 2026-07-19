import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AICommandCenter from '@/components/AICommandCenter';
import * as hooks from '@/hooks/useGeminiRequest';

vi.mock('@/hooks/useGeminiRequest');

describe('AICommandCenter', () => {
  let mockRequest;
  
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    mockRequest = vi.fn();
    vi.spyOn(hooks, 'useGeminiRequest').mockReturnValue({
      request: mockRequest,
      loading: false,
      error: null,
      cancel: vi.fn(),
    });
  });

  it('renders chat interface correctly', () => {
    render(<AICommandCenter />);
    expect(screen.getByText(/Intelligence on Demand/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to StadiumIQ/i)).toBeInTheDocument();
  });

  it('changes context when role button is clicked', () => {
    render(<AICommandCenter />);
    
    const organizerBtn = screen.getByRole('button', { name: /organizer View/i });
    fireEvent.click(organizerBtn);
    
    expect(organizerBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Context switched to organizer mode/i)).toBeInTheDocument(); // Announcement
  });

  it('sends message when Send is clicked', async () => {
    mockRequest.mockResolvedValueOnce('AI Response Test');
    
    render(<AICommandCenter />);
    
    const input = screen.getByPlaceholderText(/Ask the AI anything/i);
    const sendBtn = screen.getByRole('button', { name: /Send/i });
    
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(sendBtn);
    
    expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Hello AI',
      context: 'fan'
    }));
  });

  it('sends suggestion when clicked', () => {
    render(<AICommandCenter />);
    
    // First suggestion for fan
    const suggestionBtn = screen.getByText(/Where is Gate C/i);
    fireEvent.click(suggestionBtn);
    
    expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Where is Gate C')
    }));
  });
});
