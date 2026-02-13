import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TempleService } from '../TempleService';
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

describe('TempleService', () => {
  const mockOnClose = vi.fn();

  const createMockCharacter = (level: number, alive: boolean): Character => ({
    id: `char-${level}`,
    name: `Hero Level ${level}`,
    level,
    race: {
      id: 'human',
      name: 'Human',
      description: '',
      attributeModifiers: {},
      abilities: [],
      movementRate: 30,
    },
    class: {
      id: 'fighter',
      name: 'Fighter',
      description: '',
      baseStats: { HP: 10, AP: 0 },
      growthRates: { HP: 10, AP: 0 },
      primaryAttributes: ['ST'],
      proficiencies: { armor: [], weapons: [], savingThrows: [] },
      abilities: [],
      startingEquipment: [],
    },
    derivedStats: {
      HP: { current: 0, max: 50 },
      AP: { current: 0, max: 20 },
      Initiative: 0,
      AC: 15,
      Proficiency: 2,
      Movement: 30,
    },
    attributes: {
      ST: 16,
      CO: 14,
      DX: 12,
      AG: 10,
      IT: 8,
      IN: 10,
      WD: 12,
      CH: 10,
    },
    negativeAttributes: { SN: 0, AC: 0, CL: 0, AV: 0, NE: 0, CU: 0, VT: 0 },
    skills: [],
    feats: [],
    equipment: {},
    inventory: [],
    spells: [],
    gold: 0,
    alive,
    statusEffects: [],
    position: { row: 'front', index: 0 },
    exp: 0,
    expToNext: 1000,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    useGoldStoreMock.mockReturnValue({
      gold: 100,
      subtractGold: vi.fn(() => true),
      canAfford: vi.fn(() => true),
    });
  });

  it('should not deduct gold for level 1 resurrection', () => {
    const mockSubtractGold = vi.fn();
    const deadChar = createMockCharacter(1, false);

    useGoldStoreMock.mockReturnValue({
      gold: 100,
      subtractGold: mockSubtractGold,
      canAfford: vi.fn(() => true),
    });

    usePartyStoreMock.mockReturnValue({
      party: [deadChar],
      addCharacterToParty: vi.fn(),
    });

    render(<TempleService onClose={mockOnClose} />);

    const resurrectButton = screen.getByText('Resurrect');
    fireEvent.click(resurrectButton);

    // Should not deduct gold for level 1
    expect(mockSubtractGold).not.toHaveBeenCalled();
  });

  it('should deduct correct gold for higher level resurrection', () => {
    const mockSubtractGold = vi.fn(() => true);
    const deadChar = createMockCharacter(5, false);

    useGoldStoreMock.mockReturnValue({
      gold: 200,
      subtractGold: mockSubtractGold,
      canAfford: vi.fn(() => true),
    });

    usePartyStoreMock.mockReturnValue({
      party: [deadChar],
      addCharacterToParty: vi.fn(),
    });

    render(<TempleService onClose={mockOnClose} />);

    const resurrectButton = screen.getByText('Resurrect');
    fireEvent.click(resurrectButton);

    // Cost should be (5 - 1) * 50 = 200 gold
    expect(mockSubtractGold).toHaveBeenCalledWith(200);
  });

  it('should prevent resurrection when insufficient funds', () => {
    const mockSubtractGold = vi.fn();
    const deadChar = createMockCharacter(5, false);

    useGoldStoreMock.mockReturnValue({
      gold: 50,
      subtractGold: mockSubtractGold,
      canAfford: vi.fn(() => false),
    });

    usePartyStoreMock.mockReturnValue({
      party: [deadChar],
      addCharacterToParty: vi.fn(),
    });

    render(<TempleService onClose={mockOnClose} />);

    const resurrectButton = screen.getByText('Resurrect');
    fireEvent.click(resurrectButton);

    // Should not deduct gold
    expect(mockSubtractGold).not.toHaveBeenCalled();
  });

  it('should calculate resurrection cost correctly', () => {
    const deadChar = createMockCharacter(3, false);

    usePartyStoreMock.mockReturnValue({
      party: [deadChar],
      addCharacterToParty: vi.fn(),
    });

    render(<TempleService onClose={mockOnClose} />);

    // Cost should be (3 - 1) * 50 = 100 gold
    expect(screen.getByText('100 💰')).toBeInTheDocument();
  });

  it('should show free for level 1', () => {
    const deadChar = createMockCharacter(1, false);

    usePartyStoreMock.mockReturnValue({
      party: [deadChar],
      addCharacterToParty: vi.fn(),
    });

    render(<TempleService onClose={mockOnClose} />);

    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('should revive character with 50% HP', () => {
    const mockAddCharacter = vi.fn();
    const deadChar = createMockCharacter(1, false);

    usePartyStoreMock.mockReturnValue({
      party: [deadChar],
      addCharacterToParty: mockAddCharacter,
    });

    render(<TempleService onClose={mockOnClose} />);

    const resurrectButton = screen.getByText('Resurrect');
    fireEvent.click(resurrectButton);

    expect(mockAddCharacter).toHaveBeenCalledWith(
      expect.objectContaining({
        alive: true,
        derivedStats: expect.objectContaining({
          HP: { current: 25, max: 50 }, // 50% of max
        }),
      }),
      0
    );
  });
});
