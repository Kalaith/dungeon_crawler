import { checkImmunity, applyStatusEffect } from '../statusEffectUtils';
import { Character, Race, CharacterClass } from '../../types';

describe('statusEffectUtils', () => {
    const mockRace: Race = {
        id: 'android',
        name: 'Android',
        description: 'Constructed',
        attributeModifiers: {},
        abilities: [],
        movementRate: 30
    };

    const mockClass: CharacterClass = {
        id: 'fighter',
        name: 'Fighter',
        description: '',
        baseStats: { HP: 10, AP: 0 },
        growthRates: { HP: 10, AP: 0 },
        primaryAttributes: [],
        proficiencies: { armor: [], weapons: [], savingThrows: [] },
        abilities: [],
        startingEquipment: []
    };

    const mockCharacter: Character = {
        id: 'char1',
        name: 'Test Android',
        race: mockRace,
        class: mockClass,
        level: 1,
        exp: 0,
        expToNext: 1000,
        attributes: { ST: 10, CO: 10, DX: 10, AG: 10, IT: 10, IN: 10, WD: 10, CH: 10 },
        negativeAttributes: { SN: 0, AC: 0, CL: 0, AV: 0, NE: 0, CU: 0, VT: 0 },
        derivedStats: {
            HP: { current: 10, max: 10 },
            AP: { current: 0, max: 0 },
            Initiative: 0,
            AC: 10,
            Proficiency: 2,
            Movement: 30
        },
        skills: [],
        feats: [],
        equipment: {},
        inventory: [],
        spells: [],
        gold: 0,
        alive: true,
        statusEffects: [],
        position: { row: 'front', index: 0 }
    };

    it('should return true for Android immunity to poison', () => {
        expect(checkImmunity(mockCharacter, 'poison')).toBe(true);
    });

    it('should return true for Android immunity to disease', () => {
        expect(checkImmunity(mockCharacter, 'disease')).toBe(true); // Assuming 'disease' is a valid type or mapped
    });

    it('should not apply poison to an Android', () => {
        const effects = applyStatusEffect(mockCharacter, { type: 'poison', duration: 3, value: 5 });
        expect(effects).toHaveLength(0);
    });

    it('should apply buff to an Android', () => {
        const effects = applyStatusEffect(mockCharacter, { type: 'buff_str', duration: 3, value: 5 } as any);
        expect(effects).toHaveLength(1);
        expect(effects[0].type).toBe('buff_str');
    });
});
