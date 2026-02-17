import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BlacksmithService } from '../BlacksmithService';
import { useGoldStore } from '../../../stores/useGoldStore';

vi.mock('../../../stores/useGoldStore');

const useGoldStoreMock = useGoldStore as unknown as {
  mockReturnValue: (value: ReturnType<typeof useGoldStore>) => void;
};

describe('BlacksmithService', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    useGoldStoreMock.mockReturnValue({
      gold: 100,
      subtractGold: vi.fn(() => true),
      canAfford: vi.fn(() => true),
    });
  });

  it('should calculate repair cost based on condition', () => {
    render(<BlacksmithService onClose={mockOnClose} />);

    const ironSwordCard = screen.getByRole('heading', { name: 'Iron Sword' }).closest('.bg-etrian-700');
    expect(ironSwordCard).not.toBeNull();
    expect(within(ironSwordCard as HTMLElement).getByText(/35/)).toBeInTheDocument();
  });

  it('should calculate upgrade cost correctly', () => {
    render(<BlacksmithService onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole('button', { name: /Enhance equipment power/i }));

    const ironSwordCard = screen.getByRole('heading', { name: 'Iron Sword' }).closest('.bg-etrian-700');
    expect(ironSwordCard).not.toBeNull();
    expect(within(ironSwordCard as HTMLElement).getByText(/100/)).toBeInTheDocument();
  });

  it('should deduct gold on successful repair', () => {
    const mockSubtractGold = vi.fn(() => true);

    useGoldStoreMock.mockReturnValue({
      gold: 100,
      subtractGold: mockSubtractGold,
      canAfford: vi.fn(() => true),
    });

    render(<BlacksmithService onClose={mockOnClose} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Repair' })[0]);

    expect(mockSubtractGold).toHaveBeenCalled();
  });

  it('should deduct gold on successful upgrade', () => {
    const mockSubtractGold = vi.fn(() => true);

    useGoldStoreMock.mockReturnValue({
      gold: 150,
      subtractGold: mockSubtractGold,
      canAfford: vi.fn(() => true),
    });

    render(<BlacksmithService onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole('button', { name: /Enhance equipment power/i }));
    fireEvent.click(screen.getAllByRole('button', { name: /Upgrade to Lv/i })[0]);

    expect(mockSubtractGold).toHaveBeenCalled();
  });

  it('should prevent repair when insufficient funds', () => {
    const mockSubtractGold = vi.fn();

    useGoldStoreMock.mockReturnValue({
      gold: 10,
      subtractGold: mockSubtractGold,
      canAfford: vi.fn(() => false),
    });

    render(<BlacksmithService onClose={mockOnClose} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Repair' })[0]);

    expect(mockSubtractGold).not.toHaveBeenCalled();
  });

  it('should prevent upgrade when insufficient funds', () => {
    const mockSubtractGold = vi.fn();

    useGoldStoreMock.mockReturnValue({
      gold: 50,
      subtractGold: mockSubtractGold,
      canAfford: vi.fn(() => false),
    });

    render(<BlacksmithService onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole('button', { name: /Enhance equipment power/i }));
    fireEvent.click(screen.getAllByRole('button', { name: /Upgrade to Lv/i })[0]);

    expect(mockSubtractGold).not.toHaveBeenCalled();
  });
});
