import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDungeonStore } from '../useDungeonStore';

describe('Encounter System', () => {
    beforeEach(() => {
        useDungeonStore.setState({
            stepsUntilEncounter: 30,
            stepCount: 0
        });
    });

    it('should initialize with a safe buffer', () => {
        const state = useDungeonStore.getState();
        expect(state.stepsUntilEncounter).toBe(30);
    });

    it('should decrement counter', () => {
        const { decrementEncounterCounter } = useDungeonStore.getState();

        decrementEncounterCounter();
        expect(useDungeonStore.getState().stepsUntilEncounter).toBe(29);

        decrementEncounterCounter();
        expect(useDungeonStore.getState().stepsUntilEncounter).toBe(28);
    });

    it('should not decrement below 0', () => {
        useDungeonStore.setState({ stepsUntilEncounter: 0 });
        const { decrementEncounterCounter } = useDungeonStore.getState();

        decrementEncounterCounter();
        expect(useDungeonStore.getState().stepsUntilEncounter).toBe(0);
    });

    it('should reset counter to a random value between 20 and 45', () => {
        const { resetEncounterCounter } = useDungeonStore.getState();

        // Run multiple times to check range
        for (let i = 0; i < 100; i++) {
            resetEncounterCounter();
            const steps = useDungeonStore.getState().stepsUntilEncounter;
            expect(steps).toBeGreaterThanOrEqual(20);
            expect(steps).toBeLessThanOrEqual(45);
        }
    });
});
