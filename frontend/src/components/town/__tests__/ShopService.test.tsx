import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShopService } from '../ShopService';
import { useGoldStore } from '../../../stores/useGoldStore';
import { useInventoryStore } from '../../../stores/useInventoryStore';

vi.mock('../../../stores/useGoldStore');
vi.mock('../../../stores/useInventoryStore');

const useGoldStoreMock = useGoldStore as unknown as {
  mockReturnValue: (value: ReturnType<typeof useGoldStore>) => void;
};
const useInventoryStoreMock = useInventoryStore as unknown as {
  mockReturnValue: (value: ReturnType<typeof useInventoryStore>) => void;
};

describe('ShopService', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    useGoldStoreMock.mockReturnValue({
      gold: 100,
      subtractGold: vi.fn(() => true),
      canAfford: vi.fn((amount: number) => amount <= 100),
    });

    useInventoryStoreMock.mockReturnValue({
      addItem: vi.fn(),
    });
  });

  it('should display current gold balance', () => {
    render(<ShopService onClose={mockOnClose} />);
    expect(screen.getByText(/Your Gold: 100/i)).toBeInTheDocument();
  });

  it('should calculate cart total correctly', () => {
    render(<ShopService onClose={mockOnClose} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);

    const totalLabel = screen.getByText('Total:');
    expect(totalLabel.parentElement).toHaveTextContent('50');
  });

  it('should deduct gold and add items on successful purchase', () => {
    const mockSubtractGold = vi.fn(() => true);
    const mockAddItem = vi.fn();

    useGoldStoreMock.mockReturnValue({
      gold: 100,
      subtractGold: mockSubtractGold,
      canAfford: vi.fn(() => true),
    });

    useInventoryStoreMock.mockReturnValue({
      addItem: mockAddItem,
    });

    render(<ShopService onClose={mockOnClose} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Purchase' }));

    expect(mockSubtractGold).toHaveBeenCalled();
    expect(mockAddItem).toHaveBeenCalled();
  });

  it('should prevent purchase when insufficient funds', () => {
    useGoldStoreMock.mockReturnValue({
      gold: 10,
      subtractGold: vi.fn(),
      canAfford: vi.fn(() => false),
    });

    render(<ShopService onClose={mockOnClose} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);

    expect(screen.getByText('Insufficient Funds')).toBeInTheDocument();
  });

  it('should disable purchase button when cannot afford', () => {
    useGoldStoreMock.mockReturnValue({
      gold: 10,
      subtractGold: vi.fn(),
      canAfford: vi.fn(() => false),
    });

    render(<ShopService onClose={mockOnClose} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);

    const purchaseButton = screen.getByRole('button', { name: 'Insufficient Funds' });
    expect(purchaseButton).toBeDisabled();
  });

  it('should show warning when insufficient funds', () => {
    useGoldStoreMock.mockReturnValue({
      gold: 10,
      subtractGold: vi.fn(),
      canAfford: vi.fn(() => false),
    });

    render(<ShopService onClose={mockOnClose} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);

    expect(screen.getByText(/Insufficient Funds!/i)).toBeInTheDocument();
  });
});
