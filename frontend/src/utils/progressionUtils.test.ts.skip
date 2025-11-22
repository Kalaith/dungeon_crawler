import { describe, it, expect } from 'vitest';
import { calculateExpRequirement, calculateLevelUp, distributeExperience } from './progressionUtils';
import type { Character, CharacterClass } from '../types';

// Helper to create a mock character class
const createMockClass = (): CharacterClass => ({
    name: 'Warrior',
    description: 'A brave warrior',
    base_stats: { hp: 100, mp: 50, str: 10, def: 8, agi: 5, luc: 3 },
    stat_growth: { hp: 10, mp: 5, str: 2, def: 2, agi: 1, luc: 1 },
    abilities: [],
});

// Helper to create a mock character
const createMockCharacter = (overrides: Partial<Character> = {}): Character => ({
    name: 'Test',
    class: createMockClass(),
    level: 1,
    exp: 0,
    expToNext: 100,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    str: 10,
    def: 8,
    agi: 5,
    luc: 3,
    alive: true,
    gold: 0,
    equipment: {},
    abilities: [],
    statusEffects: [],
    ...overrides,
});

describe('Progression Utils', () => {
    describe('calculateExpRequirement', () => {
        it('calculates correct XP for level 1', () => {
            expect(calculateExpRequirement(1)).toBe(100);
        });

        it('calculates correct XP for level 2', () => {
            expect(calculateExpRequirement(2)).toBe(120);
        });

        it('follows exponential growth pattern', () => {
            const level5 = calculateExpRequirement(5);
            const level10 = calculateExpRequirement(10);
            expect(level10).toBeGreaterThan(level5);
        });
    });

    describe('calculateLevelUp', () => {
        it('does not level up when XP is insufficient', () => {
            const character = createMockCharacter({ exp: 50, expToNext: 100 });
            const result = calculateLevelUp(character, 30);

            expect(result.leveledUp).toBe(false);
            expect(result.levelsGained).toBe(0);
            expect(result.character.level).toBe(1);
        });

        it('levels up when XP is sufficient', () => {
            const character = createMockCharacter({ exp: 50, expToNext: 100 });
            const result = calculateLevelUp(character, 60);

            expect(result.leveledUp).toBe(true);
            expect(result.levelsGained).toBe(1);
            expect(result.character.level).toBe(2);
        });

        it('handles multiple level ups', () => {
            const character = createMockCharacter({ exp: 0, expToNext: 100 });
            const result = calculateLevelUp(character, 500);

            expect(result.leveledUp).toBe(true);
            expect(result.levelsGained).toBeGreaterThan(1);
            expect(result.character.level).toBeGreaterThan(2);
        });

        it('increases stats on level up', () => {
            const character = createMockCharacter({ exp: 50, expToNext: 100 });
            const result = calculateLevelUp(character, 60);

            expect(result.character.maxHp).toBeGreaterThan(character.maxHp);
            expect(result.character.str).toBeGreaterThan(character.str);
        });
    });

    describe('distributeExperience', () => {
        it('distributes XP evenly among alive party members', () => {
            const party: (Character | null)[] = [
                createMockCharacter({ name: 'Warrior' }),
                createMockCharacter({ name: 'Mage', class: { ...createMockClass(), name: 'Mage' } }),
            ];

            const result = distributeExperience(party, 200);
            expect(result[0]?.exp).toBe(100);
            expect(result[1]?.exp).toBe(100);
        });

        it('does not give XP to dead party members', () => {
            const party: (Character | null)[] = [
                createMockCharacter({ name: 'Warrior', alive: true }),
                createMockCharacter({ name: 'Mage', alive: false, hp: 0 }),
            ];

            const result = distributeExperience(party, 100);
            expect(result[0]?.exp).toBe(100);
            expect(result[1]?.exp).toBe(0);
        });

        it('handles null party slots', () => {
            const party: (Character | null)[] = [
                createMockCharacter({ name: 'Warrior' }),
                null,
                createMockCharacter({ name: 'Mage' }),
            ];

            const result = distributeExperience(party, 200);
            expect(result[0]?.exp).toBe(100);
            expect(result[1]).toBeNull();
            expect(result[2]?.exp).toBe(100);
        });
    });
});
