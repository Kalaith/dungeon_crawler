import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HealerService } from '../HealerService';
import { useGoldStore } from '../../../stores/useGoldStore';
import { usePartyStore } from '../../../stores/usePartyStore';
import type { Character } from '../../../types';

// Mock the stores
vi.mock('../../../stores/useGoldStore');
vi.mock('../../../stores/usePartyStore');

type UseGoldStoreMock = Mock<
    [],
    {
        gold: number;
        subtractGold: (amount: number) => boolean;
        canAfford: (amount: number) => boolean;
    }
>;

type UsePartyStoreMock = Mock<
    [],
    {
        party: Character[];
        addCharacterToParty: (character: Character, slot: number) => void;
    }
>;

const useGoldStoreMock = useGoldStore as unknown as UseGoldStoreMock;
const usePartyStoreMock = usePartyStore as unknown as UsePartyStoreMock;

describe('HealerService', () => {
    const mockOnClose = vi.fn();

    const mockCharacter: Character = {
        id: '1',
        name: 'Test Hero',
        level: 5,
        race: { id: 'human', name: 'Human', description: '', attributeModifiers: {}, abilities: [], movementRate: 30 },
        class: { id: 'fighter', name: 'Fighter', description: '', baseStats: { HP: 10, AP: 0 }, growthRates: { HP: 10, AP: 0 }, primaryAttributes: ['ST'], proficiencies: { armor: [], weapons: [], savingThrows: [] }, abilities: [], startingEquipment: [] },
        derivedStats: {
            HP: { current: 30, max: 50 },
            AP: { current: 5, max: 20 },
            Initiative: 0,
            AC: 15,
            Proficiency: 2,
            Movement: 30,
        },
        attributes: { ST: 16, CO: 14, DX: 12, AG: 10, IT: 8, IN: 10, WD: 12, CH: 10 },
        negativeAttributes: { SN: 0, AC: 0, CL: 0, AV: 0, NE: 0, CU: 0, VT: 0 },
        skills: [],
        feats: [],
        equipment: {},
        inventory: [],
        spells: [],
        gold: 0,
        alive: true,
        statusEffects: [],
        position: { row: 'front', index: 0 },
        exp: 0,
        expToNext: 1000,
    };

    beforeEach(() => {
        vi.clearAllMocks();

        useGoldStoreMock.mockReturnValue({
            gold: 100,
            subtractGold: vi.fn(() => true),
            canAfford: vi.fn(() => true),
        });

        usePartyStoreMock.mockReturnValue({
            party: [mockCharacter],
            addCharacterToParty: vi.fn(),
        });
    });

    it('should display current gold balance', () => {
        render(<HealerService onClose={mockOnClose} />);
        expect(screen.getByText(/Your Gold: 100/i)).toBeInTheDocument();
    });

    it('should calculate healing cost correctly', () => {
        render(<HealerService onClose={mockOnClose} />);

        // HP missing: 20, AP missing: 15
        // Cost: 20 * 1 + 15 * 2 = 50 gold
        expect(screen.getByText(/50 💰/i)).toBeInTheDocument();
    });

    it('should deduct gold on successful heal', () => {
        const mockSubtractGold = vi.fn(() => true);
        const mockAddCharacter = vi.fn();

        useGoldStoreMock.mockReturnValue({
            gold: 100,
            subtractGold: mockSubtractGold,
            canAfford: vi.fn(() => true),
        });

        usePartyStoreMock.mockReturnValue({
            party: [mockCharacter],
            addCharacterToParty: mockAddCharacter,
        });

        render(<HealerService onClose={mockOnClose} />);

        const healButton = screen.getByText('Restore HP/AP');
        fireEvent.click(healButton);

        expect(mockSubtractGold).toHaveBeenCalled();
        expect(mockAddCharacter).toHaveBeenCalled();
    });

    it('should prevent healing when insufficient funds', () => {
        const mockSubtractGold = vi.fn();

        useGoldStoreMock.mockReturnValue({
            gold: 10,
            subtractGold: mockSubtractGold,
            canAfford: vi.fn(() => false),
        });

        render(<HealerService onClose={mockOnClose} />);

        const healButton = screen.getByText('Restore HP/AP');
        fireEvent.click(healButton);

        // Should not deduct gold
        expect(mockSubtractGold).not.toHaveBeenCalled();
    });

    it('should restore HP and AP to max on heal', () => {
        const mockAddCharacter = vi.fn();

        usePartyStoreMock.mockReturnValue({
            party: [mockCharacter],
            addCharacterToParty: mockAddCharacter,
        });

        render(<HealerService onClose={mockOnClose} />);

        const healButton = screen.getByText('Restore HP/AP');
        fireEvent.click(healButton);

        expect(mockAddCharacter).toHaveBeenCalledWith(
            expect.objectContaining({
                derivedStats: expect.objectContaining({
                    HP: { current: 50, max: 50 },
                    AP: { current: 20, max: 20 },
                }),
            }),
            0
        );
    });
});
