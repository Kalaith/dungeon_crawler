import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlacksmithService } from '../BlacksmithService';
import { useGoldStore } from '../../stores/useGoldStore';

// Mock the stores
vi.mock('../../stores/useGoldStore');

describe('BlacksmithService', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useGoldStore as any).mockReturnValue({
            gold: 100,
            subtractGold: vi.fn(() => true),
            canAfford: vi.fn(() => true),
        });
    });

    it('should calculate repair cost based on condition', () => {
        render(<BlacksmithService onClose={mockOnClose} />);

        // Iron Sword has 65% condition, level 1
        // Damage: 35%, Cost: ceil((35/10) * 1 * 10) = 40 gold
        expect(screen.getByText('40 💰')).toBeInTheDocument();
    });

    it('should calculate upgrade cost correctly', () => {
        render(<BlacksmithService onClose={mockOnClose} />);

        // Switch to upgrade tab
        const upgradeButton = screen.getByText(/Upgrade/i);
        fireEvent.click(upgradeButton);

        // Level 1 item: 1 * 100 = 100 gold
        expect(screen.getByText('100 💰')).toBeInTheDocument();
    });

    it('should deduct gold on successful repair', () => {
        const mockSubtractGold = vi.fn(() => true);

        (useGoldStore as any).mockReturnValue({
            gold: 100,
            subtractGold: mockSubtractGold,
            canAfford: vi.fn(() => true),
        });

        render(<BlacksmithService onClose={mockOnClose} />);

        const repairButton = screen.getAllByText('Repair')[0];
        fireEvent.click(repairButton);

        expect(mockSubtractGold).toHaveBeenCalled();
    });

    it('should deduct gold on successful upgrade', () => {
        const mockSubtractGold = vi.fn(() => true);

        (useGoldStore as any).mockReturnValue({
            gold: 150,
            subtractGold: mockSubtractGold,
            canAfford: vi.fn(() => true),
        });

        render(<BlacksmithService onClose={mockOnClose} />);

        // Switch to upgrade tab
        const upgradeTab = screen.getByText(/Upgrade/i);
        fireEvent.click(upgradeTab);

        const upgradeButton = screen.getAllByText(/Upgrade to Lv/)[0];
        fireEvent.click(upgradeButton);

        expect(mockSubtractGold).toHaveBeenCalled();
    });

    it('should prevent repair when insufficient funds', () => {
        const mockSubtractGold = vi.fn();

        (useGoldStore as any).mockReturnValue({
            gold: 10,
            subtractGold: mockSubtractGold,
            canAfford: vi.fn(() => false),
        });

        render(<BlacksmithService onClose={mockOnClose} />);

        const repairButton = screen.getAllByText('Repair')[0];
        fireEvent.click(repairButton);

        // Should not deduct gold
        expect(mockSubtractGold).not.toHaveBeenCalled();
    });

    it('should prevent upgrade when insufficient funds', () => {
        const mockSubtractGold = vi.fn();

        (useGoldStore as any).mockReturnValue({
            gold: 50,
            subtractGold: mockSubtractGold,
            canAfford: vi.fn(() => false),
        });

        render(<BlacksmithService onClose={mockOnClose} />);

        // Switch to upgrade tab
        const upgradeTab = screen.getByText(/Upgrade/i);
        fireEvent.click(upgradeTab);

        const upgradeButton = screen.getAllByText(/Upgrade to Lv/)[0];
        fireEvent.click(upgradeButton);

        // Should not deduct gold
        expect(mockSubtractGold).not.toHaveBeenCalled();
    });
});
