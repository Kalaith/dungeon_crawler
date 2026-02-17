import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  rollD20,
  rollDice,
  getAttributeModifier,
  rollWithAdvantage,
  rollWithDisadvantage,
  performAttackRoll,
  calculateWeaponDamage,
  calculateSpellSaveDC,
  calculateSpellAttackBonus,
  performSavingThrow,
  calculateAC,
  hasPositionalAdvantage,
} from '../../src/utils/combatMechanics';
import type { Character } from '../../src/types';

// Mock Math.random for predictable tests
const mockRandom = (value: number) => {
  vi.spyOn(Math, 'random').mockReturnValue(value);
};

describe('Combat Mechanics', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Dice Rolling', () => {
    it('should roll d20 between 1 and 20', () => {
      mockRandom(0); // Should give 1
      expect(rollD20()).toBe(1);

      mockRandom(0.99); // Should give 20
      expect(rollD20()).toBe(20);
    });

    it('should roll multiple dice correctly', () => {
      mockRandom(0.5); // Middle value
      const result = rollDice(2, 6);
      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThanOrEqual(12);
    });

    it('should handle advantage correctly', () => {
      // Mock to return different values for two rolls
      let callCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 0.5 : 0.9; // 11 and 19
      });

      const result = rollWithAdvantage();
      expect(result).toBe(19); // Should take the higher roll
    });

    it('should handle disadvantage correctly', () => {
      let callCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 0.5 : 0.9; // 11 and 19
      });

      const result = rollWithDisadvantage();
      expect(result).toBe(11); // Should take the lower roll
    });
  });

  describe('Attribute Modifiers', () => {
    it('should calculate correct modifiers', () => {
      expect(getAttributeModifier(10)).toBe(0);
      expect(getAttributeModifier(12)).toBe(1);
      expect(getAttributeModifier(14)).toBe(2);
      expect(getAttributeModifier(8)).toBe(-1);
      expect(getAttributeModifier(20)).toBe(5);
    });
  });

  describe('Attack Rolls', () => {
    const mockCharacter: Character = {
      id: 'test',
      name: 'Test Warrior',
      attributes: {
        ST: 16, // +3 modifier
        CO: 14,
        DX: 12,
        AG: 10,
        IT: 10,
        IN: 10,
        WD: 10,
        CH: 10,
      },
      derivedStats: {
        HP: { current: 20, max: 20 },
        AP: { current: 0, max: 0 },
        Initiative: 0,
        AC: 15,
        Proficiency: 2,
        Movement: 30,
      },
    } as Character;

    it('should perform normal attack roll', () => {
      mockRandom(0.5); // Roll of 11
      const result = performAttackRoll(mockCharacter, 15);

      expect(result.roll).toBe(11);
      expect(result.total).toBe(16); // 11 + 3 (ST) + 2 (prof)
      expect(result.hit).toBe(true);
      expect(result.isCritical).toBe(false);
    });

    it('should detect critical hit on natural 20', () => {
      mockRandom(0.95); // Roll of 20
      const result = performAttackRoll(mockCharacter, 25);

      expect(result.roll).toBe(20);
      expect(result.isCritical).toBe(true);
      expect(result.hit).toBe(true);
    });

    it('should detect critical miss on natural 1', () => {
      mockRandom(0); // Roll of 1
      const result = performAttackRoll(mockCharacter, 5);

      expect(result.roll).toBe(1);
      expect(result.isCriticalMiss).toBe(true);
      expect(result.hit).toBe(false);
    });

    it('should miss when total is below AC', () => {
      mockRandom(0.1); // Roll of 3
      const result = performAttackRoll(mockCharacter, 20);

      expect(result.hit).toBe(false);
    });
  });

  describe('Damage Calculation', () => {
    const mockCharacter: Character = {
      attributes: {
        ST: 16, // +3 modifier
        CO: 14,
        DX: 12,
        AG: 10,
        IT: 10,
        IN: 10,
        WD: 10,
        CH: 10,
      },
    } as Character;

    it('should calculate normal damage', () => {
      mockRandom(0.5);
      const result = calculateWeaponDamage(
        mockCharacter,
        { count: 1, sides: 8 }, // 1d8
        false
      );

      expect(result.damage).toBeGreaterThanOrEqual(4); // 1 (min roll) + 3 (ST mod)
      expect(result.damageType).toBe('physical');
      expect(result.isCritical).toBe(false);
    });

    it('should double weapon dice on critical hit', () => {
      mockRandom(0.5);
      const result = calculateWeaponDamage(mockCharacter, { count: 1, sides: 8 }, true);

      expect(result.isCritical).toBe(true);
      // Should roll 2d8 + 3 (ST mod)
      expect(result.damage).toBeGreaterThanOrEqual(5); // 2 (min) + 3
    });

    it('should have minimum damage of 1', () => {
      const weakCharacter: Character = {
        attributes: {
          ST: 6, // -2 modifier
          CO: 10,
          DX: 10,
          AG: 10,
          IT: 10,
          IN: 10,
          WD: 10,
          CH: 10,
        },
      } as Character;

      mockRandom(0); // Roll of 1
      const result = calculateWeaponDamage(weakCharacter, { count: 1, sides: 4 }, false);

      expect(result.damage).toBe(1); // Should not go below 1
    });
  });

  describe('Spell Mechanics', () => {
    const mockCaster: Character = {
      attributes: {
        ST: 10,
        CO: 10,
        DX: 10,
        AG: 10,
        IT: 18, // +4 modifier
        IN: 10,
        WD: 10,
        CH: 10,
      },
      derivedStats: {
        Proficiency: 3,
      },
      class: {
        spellcasting: {
          ability: 'IT',
          type: 'prepared',
        },
      },
    } as Character;

    it('should calculate spell save DC correctly', () => {
      const dc = calculateSpellSaveDC(mockCaster);
      expect(dc).toBe(15); // 8 + 3 (prof) + 4 (IT mod)
    });

    it('should calculate spell attack bonus correctly', () => {
      const bonus = calculateSpellAttackBonus(mockCaster);
      expect(bonus).toBe(7); // 3 (prof) + 4 (IT mod)
    });
  });

  describe('Saving Throws', () => {
    const mockCharacter: Character = {
      attributes: {
        ST: 10,
        CO: 14, // +2 modifier
        DX: 12,
        AG: 10,
        IT: 10,
        IN: 10,
        WD: 10,
        CH: 10,
      },
      derivedStats: {
        Proficiency: 2,
      },
      class: {
        proficiencies: {
          savingThrows: ['CO', 'ST'],
        },
      },
    } as Character;

    it('should succeed on saving throw', () => {
      mockRandom(0.7); // Roll of 15
      const result = performSavingThrow(mockCharacter, 'CO', 15);

      // 15 + 2 (CO mod) + 2 (prof) = 19
      expect(result.total).toBe(19);
      expect(result.success).toBe(true);
    });

    it('should fail on saving throw', () => {
      mockRandom(0.1); // Roll of 3
      const result = performSavingThrow(mockCharacter, 'CO', 15);

      expect(result.success).toBe(false);
    });

    it('should add proficiency bonus for proficient saves', () => {
      mockRandom(0.5);
      const result = performSavingThrow(mockCharacter, 'CO', 10);

      // Should include proficiency bonus
      expect(result.total).toBeGreaterThanOrEqual(13); // 11 + 2 (mod) + 2 (prof) minimum
    });

    it('should not add proficiency for non-proficient saves', () => {
      mockRandom(0.5);
      const result = performSavingThrow(mockCharacter, 'DX', 10);

      // Should NOT include proficiency bonus
      expect(result.total).toBeLessThan(15); // No proficiency in DX
    });
  });

  describe('AC Calculation', () => {
    it('should calculate base AC correctly', () => {
      const character: Character = {
        attributes: {
          ST: 10,
          CO: 10,
          DX: 10,
          AG: 14, // +2 modifier
          IT: 10,
          IN: 10,
          WD: 10,
          CH: 10,
        },
        equipment: {},
      } as Character;

      const ac = calculateAC(character);
      expect(ac).toBe(12); // 10 + 2 (AG mod)
    });
  });

  describe('Positional Advantage', () => {
    it('should give disadvantage for melee from back row', () => {
      const result = hasPositionalAdvantage('back', 'front', false);
      expect(result.disadvantage).toBe(true);
      expect(result.advantage).toBe(false);
    });

    it('should not penalize ranged attacks from back row', () => {
      const result = hasPositionalAdvantage('back', 'front', true);
      expect(result.disadvantage).toBe(false);
      expect(result.advantage).toBe(false);
    });

    it('should have no penalty for melee from front row', () => {
      const result = hasPositionalAdvantage('front', 'front', false);
      expect(result.disadvantage).toBe(false);
      expect(result.advantage).toBe(false);
    });
  });
});


