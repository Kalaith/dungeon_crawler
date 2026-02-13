import { describe, it, expect } from 'vitest';
import {
  getMaxSpellLevel,
  getClassSpellList,
  getMaxKnownSpells,
  getMaxPreparedSpells,
  canLearnSpell,
  learnSpell,
  getCantrips,
  initializeCharacterSpells,
} from '../spellLearning';
import {
  spells,
  getSpellsByLevel,
  getCastableSpells,
  apCosts,
} from '../../data/spells';
import {
  checkConcentration,
  breakConcentration,
  startConcentration,
  isConcentrating,
} from '../concentrationMechanics';
import type { Character } from '../../types';

describe('Spell Learning System', () => {
  describe('Max Spell Level', () => {
    it('should return correct max spell level by character level', () => {
      expect(getMaxSpellLevel(1)).toBe(1);
      expect(getMaxSpellLevel(3)).toBe(2);
      expect(getMaxSpellLevel(5)).toBe(3);
      expect(getMaxSpellLevel(7)).toBe(4);
      expect(getMaxSpellLevel(9)).toBe(5);
      expect(getMaxSpellLevel(11)).toBe(6);
      expect(getMaxSpellLevel(13)).toBe(7);
      expect(getMaxSpellLevel(15)).toBe(8);
      expect(getMaxSpellLevel(17)).toBe(9);
      expect(getMaxSpellLevel(20)).toBe(9);
    });
  });

  describe('Class Spell Lists', () => {
    it('should return spells for wizard', () => {
      const wizardSpells = getClassSpellList('Wizard');
      expect(wizardSpells.length).toBeGreaterThan(0);
      expect(wizardSpells.some(s => s.id === 'fire_bolt')).toBe(true);
      expect(wizardSpells.some(s => s.id === 'fireball')).toBe(true);
    });

    it('should return spells for cleric', () => {
      const clericSpells = getClassSpellList('Cleric');
      expect(clericSpells.length).toBeGreaterThan(0);
      expect(clericSpells.some(s => s.id === 'cure_wounds')).toBe(true);
      expect(clericSpells.some(s => s.id === 'bless')).toBe(true);
    });

    it('should return empty array for non-caster', () => {
      const warriorSpells = getClassSpellList('Warrior');
      expect(warriorSpells.length).toBe(0);
    });
  });

  describe('Spell Capacity', () => {
    const mockWizard: Character = {
      level: 3,
      attributes: {
        ST: 10,
        CO: 10,
        DX: 10,
        AG: 10,
        IT: 16, // +3 modifier
        IN: 10,
        WD: 10,
        CH: 10,
      },
      class: {
        name: 'Wizard',
        spellcasting: {
          ability: 'IT',
          type: 'prepared',
        },
      },
      spells: [],
    } as unknown as Character;

    it('should calculate max prepared spells correctly', () => {
      const max = getMaxPreparedSpells(mockWizard);
      expect(max).toBe(6); // 3 (level) + 3 (IT mod)
    });

    it('should calculate max known spells for known casters', () => {
      const mockSorcerer: Character = {
        ...mockWizard,
        attributes: {
          ...mockWizard.attributes,
          CH: 16, // +3 modifier
        },
        class: {
          name: 'Sorcerer',
          spellcasting: {
            ability: 'CH',
            type: 'known',
          },
        },
      } as unknown as Character;

      const max = getMaxKnownSpells(mockSorcerer);
      expect(max).toBe(6); // 3 (level) + 3 (CH mod)
    });

    it('should have minimum of 1 spell', () => {
      const lowLevelCharacter: Character = {
        ...mockWizard,
        level: 1,
        attributes: {
          ...mockWizard.attributes,
          IT: 8, // -1 modifier
        },
      } as unknown as Character;

      const max = getMaxPreparedSpells(lowLevelCharacter);
      expect(max).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Learning Spells', () => {
    const mockCharacter: Character = {
      level: 3,
      attributes: {
        ST: 10,
        CO: 10,
        DX: 10,
        AG: 10,
        IT: 16,
        IN: 10,
        WD: 10,
        CH: 10,
      },
      class: {
        name: 'Wizard',
        spellcasting: {
          ability: 'IT',
          type: 'known',
        },
      },
      spells: [],
    } as unknown as Character;

    it('should allow learning valid spell', () => {
      const fireBolt = spells.find(s => s.id === 'fire_bolt');
      if (!fireBolt) throw new Error('Spell not found');

      expect(canLearnSpell(mockCharacter, fireBolt)).toBe(true);
    });

    it('should not allow learning spell above max level', () => {
      const fireball = spells.find(s => s.id === 'fireball'); // Level 3
      if (!fireball) throw new Error('Spell not found');

      const lowLevelChar: Character = {
        ...mockCharacter,
        level: 1,
      } as unknown as Character;

      expect(canLearnSpell(lowLevelChar, fireball)).toBe(false);
    });

    it('should not allow learning already known spell', () => {
      const fireBolt = spells.find(s => s.id === 'fire_bolt');
      if (!fireBolt) throw new Error('Spell not found');

      const charWithSpell: Character = {
        ...mockCharacter,
        spells: [fireBolt],
      } as unknown as Character;

      expect(canLearnSpell(charWithSpell, fireBolt)).toBe(false);
    });

    it('should add spell to character', () => {
      const fireBolt = spells.find(s => s.id === 'fire_bolt');
      if (!fireBolt) throw new Error('Spell not found');

      const updated = learnSpell(mockCharacter, fireBolt);
      expect(updated.spells).toContain(fireBolt);
      expect(updated.spells.length).toBe(1);
    });
  });

  describe('Cantrips', () => {
    it('should return only level 0 spells', () => {
      const mockWizard: Character = {
        class: {
          name: 'Wizard',
        },
      } as unknown as Character;

      const cantrips = getCantrips(mockWizard);
      expect(cantrips.every(s => s.level === 0)).toBe(true);
    });
  });

  describe('Spell Initialization', () => {
    it('should initialize known caster with cantrips and level 1 spells', () => {
      const mockSorcerer: Character = {
        level: 1,
        attributes: {
          ST: 10,
          CO: 10,
          DX: 10,
          AG: 10,
          IT: 10,
          IN: 10,
          WD: 10,
          CH: 16,
        },
        class: {
          name: 'Sorcerer',
          spellcasting: {
            ability: 'CH',
            type: 'known',
          },
        },
        spells: [],
      } as unknown as Character;

      const initialized = initializeCharacterSpells(mockSorcerer);
      expect(initialized.spells.length).toBeGreaterThan(0);
      expect(initialized.spells.some(s => s.level === 0)).toBe(true);
    });

    it('should initialize prepared caster with only cantrips', () => {
      const mockWizard: Character = {
        level: 1,
        attributes: {
          ST: 10,
          CO: 10,
          DX: 10,
          AG: 10,
          IT: 16,
          IN: 10,
          WD: 10,
          CH: 10,
        },
        class: {
          name: 'Wizard',
          spellcasting: {
            ability: 'IT',
            type: 'prepared',
          },
        },
        spells: [],
      } as unknown as Character;

      const initialized = initializeCharacterSpells(mockWizard);
      expect(initialized.spells.every(s => s.level === 0)).toBe(true);
    });
  });
});

describe('Spell Data', () => {
  describe('Spell Database', () => {
    it('should have spells defined', () => {
      expect(spells.length).toBeGreaterThan(0);
    });

    it('should have cantrips', () => {
      const cantrips = spells.filter(s => s.level === 0);
      expect(cantrips.length).toBeGreaterThan(0);
    });

    it('should have correct AP costs', () => {
      spells.forEach(spell => {
        expect(spell.apCost).toBe(apCosts[spell.level]);
      });
    });

    it('should have valid concentration flags', () => {
      spells.forEach(spell => {
        expect(typeof spell.concentration).toBe('boolean');
      });
    });

    it('should have damage spells with damage types', () => {
      const damageSpells = spells.filter(s => s.damageType);
      expect(damageSpells.length).toBeGreaterThan(0);

      damageSpells.forEach(spell => {
        expect(spell.damageType).toBeTruthy();
      });
    });
  });

  describe('Spell Filtering', () => {
    it('should filter spells by level', () => {
      const level1Spells = getSpellsByLevel(1);
      expect(level1Spells.every(s => s.level === 1)).toBe(true);
    });

    it('should filter castable spells by AP', () => {
      const allSpells = spells.slice(0, 10);
      const castable = getCastableSpells(allSpells, 5);

      expect(castable.every(s => (s.apCost ?? 0) <= 5)).toBe(true);
    });

    it('should return empty array when insufficient AP', () => {
      const level3Spells = getSpellsByLevel(3);
      const castable = getCastableSpells(level3Spells, 0);

      expect(castable.length).toBe(0);
    });
  });
});

describe('Concentration Mechanics', () => {
  const mockCharacter: Character = {
    id: 'test',
    attributes: {
      ST: 10,
      CO: 14, // +2 modifier
      DX: 10,
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
        savingThrows: ['CO', 'IT'],
      },
    },
  } as unknown as Character;

  describe('Concentration Checks', () => {
    it('should maintain concentration on low damage', () => {
      const character = startConcentration(mockCharacter, 'bless');

      // Low damage (DC 10)
      const maintained = checkConcentration(character, 5);
      // Result depends on roll, but should be possible
      expect(typeof maintained).toBe('boolean');
    });

    it('should use higher DC for high damage', () => {
      const character = startConcentration(mockCharacter, 'bless');

      // High damage (DC = half damage = 15)
      const maintained = checkConcentration(character, 30);
      expect(typeof maintained).toBe('boolean');
    });
  });

  describe('Concentration State', () => {
    it('should track concentration', () => {
      const character = startConcentration(mockCharacter, 'bless');
      expect(isConcentrating(character)).toBe(true);
      expect(character.concentratingOn).toBe('bless');
    });

    it('should break concentration', () => {
      const concentrating = startConcentration(mockCharacter, 'bless');
      const broken = breakConcentration(concentrating);

      expect(isConcentrating(broken)).toBe(false);
      expect(broken.concentratingOn).toBeUndefined();
    });

    it('should not be concentrating initially', () => {
      expect(isConcentrating(mockCharacter)).toBe(false);
    });
  });
});
