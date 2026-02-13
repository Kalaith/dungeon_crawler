import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShopService } from '../ShopService';
import { useGoldStore } from '../../../stores/useGoldStore';
import { useInventoryStore } from '../../../stores/useInventoryStore';
import type { Item } from '../../../types';

// Mock the stores
vi.mock('../../../stores/useGoldStore');
vi.mock('../../../stores/useInventoryStore');

type UseGoldStoreMock = Mock<
    [],
    {
        gold: number;
        subtractGold: (amount: number) => boolean;
        canAfford: (amount: number) => boolean;
    }
>;

type UseInventoryStoreMock = Mock<[], { addItem: (item: Item) => void }>;

const useGoldStoreMock = useGoldStore as unknown as UseGoldStoreMock;
const useInventoryStoreMock = useInventoryStore as unknown as UseInventoryStoreMock;

describe('ShopService', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mock implementations
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

        // Add an item to cart (Iron Sword costs 50 gold)
        const addButton = screen.getAllByText('Add to Cart')[0];
        fireEvent.click(addButton);

        // Check total is displayed
        expect(screen.getByText(/50/)).toBeInTheDocument();
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

        // Add item to cart
        const addButton = screen.getAllByText('Add to Cart')[0];
        fireEvent.click(addButton);

        // Purchase
        const purchaseButton = screen.getByText('Purchase');
        fireEvent.click(purchaseButton);

        // Verify gold was deducted
        expect(mockSubtractGold).toHaveBeenCalled();

        // Verify item was added to inventory
        expect(mockAddItem).toHaveBeenCalled();
    });

    it('should prevent purchase when insufficient funds', () => {
        useGoldStoreMock.mockReturnValue({
            gold: 10,
            subtractGold: vi.fn(),
            canAfford: vi.fn(() => false),
        });

        render(<ShopService onClose={mockOnClose} />);

        // Add expensive item to cart
        const addButton = screen.getAllByText('Add to Cart')[0];
        fireEvent.click(addButton);

        // Purchase button should show insufficient funds
        expect(screen.getByText('Insufficient Funds')).toBeInTheDocument();
    });

    it('should disable purchase button when cannot afford', () => {
        useGoldStoreMock.mockReturnValue({
            gold: 10,
            subtractGold: vi.fn(),
            canAfford: vi.fn(() => false),
        });

        render(<ShopService onClose={mockOnClose} />);

        // Add item to cart
        const addButton = screen.getAllByText('Add to Cart')[0];
        fireEvent.click(addButton);

        // Purchase button should be disabled
        const purchaseButton = screen.getByText('Insufficient Funds');
        expect(purchaseButton).toBeDisabled();
    });

    it('should show warning when insufficient funds', () => {
        useGoldStoreMock.mockReturnValue({
            gold: 10,
            subtractGold: vi.fn(),
            canAfford: vi.fn(() => false),
        });

        render(<ShopService onClose={mockOnClose} />);

        // Add item to cart
        const addButton = screen.getAllByText('Add to Cart')[0];
        fireEvent.click(addButton);

        // Should show warning
        expect(screen.getByText(/Insufficient Funds!/i)).toBeInTheDocument();
    });
});
