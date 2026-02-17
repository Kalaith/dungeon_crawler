import { describe, it, expect, beforeEach } from 'vitest';
import { useCharacterCreationStore } from '../../src/stores/useCharacterCreationStore';
import { races } from '../../src/data/races';
import { characterClasses } from '../../src/data/classes';

describe('Character Creation Store', () => {
  beforeEach(() => {
    useCharacterCreationStore.getState().reset();
  });

  describe('Basic State Management', () => {
    it('should initialize with default values', () => {
      const store = useCharacterCreationStore.getState();
      expect(store.step).toBe(1);
      expect(store.name).toBe('');
      expect(store.selectedRace).toBeNull();
      expect(store.selectedClass).toBeNull();
      expect(store.generationMethod).toBe('point-buy');
    });

    it('should set character name', () => {
      useCharacterCreationStore.getState().setName('Aragorn');
      expect(useCharacterCreationStore.getState().name).toBe('Aragorn');
    });

    it('should set race', () => {
      const human = races.find(r => r.id === 'human');
      if (human) {
        useCharacterCreationStore.getState().setRace(human);
        expect(useCharacterCreationStore.getState().selectedRace).toEqual(human);
      }
    });

    it('should set class', () => {
      const warrior = characterClasses.find(c => c.id === 'warrior');
      if (warrior) {
        useCharacterCreationStore.getState().setClass(warrior);
        expect(useCharacterCreationStore.getState().selectedClass).toEqual(warrior);
      }
    });

    it('should navigate between steps', () => {
      useCharacterCreationStore.getState().setStep(2);
      expect(useCharacterCreationStore.getState().step).toBe(2);

      useCharacterCreationStore.getState().setStep(5);
      expect(useCharacterCreationStore.getState().step).toBe(5);
    });
  });

  describe('Point-Buy System', () => {
    it('should start with 20 points', () => {
      expect(useCharacterCreationStore.getState().attributePointsRemaining).toBe(20);
    });

    it('should initialize all attributes to 10', () => {
      const attrs = useCharacterCreationStore.getState().attributes;
      expect(attrs.ST).toBe(10);
      expect(attrs.CO).toBe(10);
      expect(attrs.DX).toBe(10);
      expect(attrs.AG).toBe(10);
      expect(attrs.IT).toBe(10);
      expect(attrs.IN).toBe(10);
      expect(attrs.WD).toBe(10);
      expect(attrs.CH).toBe(10);
    });

    it('should increase attribute and decrease points', () => {
      const initialPoints = useCharacterCreationStore.getState().attributePointsRemaining;
      useCharacterCreationStore.getState().setAttribute('ST', 11);

      expect(useCharacterCreationStore.getState().attributes.ST).toBe(11);
      expect(useCharacterCreationStore.getState().attributePointsRemaining).toBeLessThan(
        initialPoints
      );
    });

    it('should not allow attributes below 8', () => {
      useCharacterCreationStore.getState().setAttribute('ST', 7);
      expect(useCharacterCreationStore.getState().attributes.ST).toBeGreaterThanOrEqual(8);
    });

    it('should not allow attributes above 18', () => {
      useCharacterCreationStore.getState().setAttribute('ST', 19);
      expect(useCharacterCreationStore.getState().attributes.ST).toBeLessThanOrEqual(18);
    });

    it('should not allow spending more points than available', () => {
      const store = useCharacterCreationStore.getState();
      store.setAttribute('ST', 15);
      store.setAttribute('CO', 15);
      store.setAttribute('DX', 15);
      store.setAttribute('AG', 15);

      expect(useCharacterCreationStore.getState().attributePointsRemaining).toBeGreaterThanOrEqual(
        0
      );
    });
  });

  describe('Random Generation', () => {
    it('should generate random attributes', () => {
      const store = useCharacterCreationStore.getState();
      store.setGenerationMethod('random');
      store.rollAttributes();

      const attrs = useCharacterCreationStore.getState().attributes;
      Object.values(attrs).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(3);
        expect(value).toBeLessThanOrEqual(18);
      });
    });
  });

  describe('Deity and Background Selection', () => {
    it('should set deity', () => {
      useCharacterCreationStore.getState().setDeity('Phex');
      expect(useCharacterCreationStore.getState().selectedDeity).toBe('Phex');
    });

    it('should set background', () => {
      useCharacterCreationStore.getState().setBackground('Soldier');
      expect(useCharacterCreationStore.getState().selectedBackground).toBe('Soldier');
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all state to defaults', () => {
      const store = useCharacterCreationStore.getState();

      // Set some values
      store.setName('Test');
      store.setStep(3);
      if (races[0]) store.setRace(races[0]);

      // Verify changes
      expect(useCharacterCreationStore.getState().name).toBe('Test');

      // Reset
      store.reset();

      // Verify reset
      const resetState = useCharacterCreationStore.getState();
      expect(resetState.step).toBe(1);
      expect(resetState.name).toBe('');
      expect(resetState.selectedRace).toBeNull();
      expect(resetState.attributes.ST).toBe(10);
      expect(resetState.attributePointsRemaining).toBe(20);
    });
  });
});

describe('Character Data Validation', () => {
  describe('Race Data', () => {
    it('should have all required races', () => {
      expect(races.length).toBeGreaterThanOrEqual(4);
      const raceIds = races.map(r => r.id);
      expect(raceIds).toContain('human');
      expect(raceIds).toContain('elf');
      expect(raceIds).toContain('dwarf');
      expect(raceIds).toContain('halfling');
    });

    it('should have valid attribute modifiers', () => {
      races.forEach(race => {
        expect(race.attributeModifiers).toBeDefined();
        Object.values(race.attributeModifiers).forEach(mod => {
          if (mod !== undefined) {
            expect(mod).toBeGreaterThanOrEqual(-2);
            expect(mod).toBeLessThanOrEqual(2);
          }
        });
      });
    });

    it('should have movement rates', () => {
      races.forEach(race => {
        expect(race.movementRate).toBeGreaterThan(0);
        expect(race.movementRate).toBeLessThanOrEqual(40);
      });
    });
  });

  describe('Class Data', () => {
    it('should have at least 12 classes', () => {
      expect(characterClasses.length).toBeGreaterThanOrEqual(12);
      const classIds = characterClasses.map(c => c.id);
      expect(classIds).toContain('warrior');
      expect(classIds).toContain('wizard');
      expect(classIds).toContain('cleric');
      expect(classIds).toContain('rogue');
    });

    it('should have valid base stats', () => {
      characterClasses.forEach(cls => {
        expect(cls.baseStats.HP).toBeGreaterThan(0);
        expect(cls.baseStats.AP).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have starting equipment', () => {
      characterClasses.forEach(cls => {
        expect(cls.startingEquipment).toBeDefined();
        expect(cls.startingEquipment.length).toBeGreaterThan(0);
      });
    });

    it('should have primary attributes', () => {
      characterClasses.forEach(cls => {
        expect(cls.primaryAttributes).toBeDefined();
        expect(cls.primaryAttributes.length).toBeGreaterThan(0);
        expect(cls.primaryAttributes.length).toBeLessThanOrEqual(3);
      });
    });

    it('should have proficiencies', () => {
      characterClasses.forEach(cls => {
        expect(cls.proficiencies).toBeDefined();
        expect(cls.proficiencies.armor).toBeDefined();
        expect(cls.proficiencies.weapons).toBeDefined();
        expect(cls.proficiencies.savingThrows).toBeDefined();
        expect(cls.proficiencies.savingThrows.length).toBe(2);
      });
    });

    it('should have spellcasting info for casters', () => {
      const casters = [
        'wizard',
        'cleric',
        'druid',
        'sorcerer',
        'warlock',
        'bard',
        'paladin',
        'ranger',
      ];
      characterClasses.forEach(cls => {
        if (casters.includes(cls.id)) {
          expect(cls.spellcasting).toBeDefined();
          expect(cls.spellcasting?.ability).toBeDefined();
          expect(cls.spellcasting?.type).toMatch(/prepared|known/);
        }
      });
    });
  });
});


