import { create } from 'zustand';
import type {
    Race,
    CharacterClass,
    Attributes,
    NegativeAttributes,
    Skill,
    Feat,
    Attribute
} from '../types';

interface CharacterCreationState {
    step: number;
    name: string;
    portrait: string;
    selectedRace: Race | null;
    selectedClass: CharacterClass | null;
    attributes: Attributes;
    negativeAttributes: NegativeAttributes;
    attributePointsRemaining: number; // For point buy
    generationMethod: 'point-buy' | 'random' | 'quick';
    selectedSkills: Skill[];
    selectedFeats: Feat[];
    selectedDeity: string | null;
    selectedBackground: string | null;

    // Actions
    setStep: (step: number) => void;
    setName: (name: string) => void;
    setPortrait: (portrait: string) => void;
    setRace: (race: Race) => void;
    setClass: (charClass: CharacterClass) => void;
    setGenerationMethod: (method: 'point-buy' | 'random' | 'quick') => void;
    setAttribute: (attr: Attribute, value: number) => void;
    setNegativeAttribute: (attr: keyof NegativeAttributes, value: number) => void;
    rollAttributes: () => void; // For random generation
    resetAttributes: () => void;
    toggleSkill: (skill: Skill) => void;
    toggleFeat: (feat: Feat) => void;
    setDeity: (deity: string) => void;
    setBackground: (background: string) => void;
    reset: () => void;
}

const initialAttributes: Attributes = {
    ST: 10, CO: 10, DX: 10, AG: 10, IT: 10, IN: 10, WD: 10, CH: 10
};

const initialNegativeAttributes: NegativeAttributes = {
    SN: 0, AC: 0, CL: 0, AV: 0, NE: 0, CU: 0, VT: 0
};

export const useCharacterCreationStore = create<CharacterCreationState>((set) => ({
    step: 1,
    name: '',
    portrait: '',
    selectedRace: null,
    selectedClass: null,
    attributes: initialAttributes,
    negativeAttributes: initialNegativeAttributes,
    attributePointsRemaining: 20, // 100 total - 80 used (8 * 10)
    generationMethod: 'point-buy',
    selectedSkills: [],
    selectedFeats: [],
    selectedDeity: null,
    selectedBackground: null,

    setStep: (step) => set({ step }),
    setName: (name) => set({ name }),
    setPortrait: (portrait) => set({ portrait }),
    setRace: (race) => set({ selectedRace: race }),
    setClass: (charClass) => set({ selectedClass: charClass }),
    setGenerationMethod: (method) => set({ generationMethod: method }),

    setAttribute: (attr, value) => set((state) => {
        const currentSum = Object.values(state.attributes).reduce((a, b) => a + b, 0);
        const oldVal = state.attributes[attr];
        const diff = value - oldVal;
        const newSum = currentSum + diff;
        const MAX_POINTS = 100;

        if (newSum > MAX_POINTS && diff > 0) return state; // Cannot exceed max points
        if (value < 8 || value > 18) return state; // Hard limits

        return {
            attributes: { ...state.attributes, [attr]: value },
            attributePointsRemaining: MAX_POINTS - newSum
        };
    }),

    setNegativeAttribute: (attr, value) => set((state) => ({
        negativeAttributes: { ...state.negativeAttributes, [attr]: value }
    })),

    rollAttributes: () => set(() => {
        // Simple 3d6 roll for each attribute
        const roll = () => Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
        return {
            attributes: {
                ST: roll(), CO: roll(), DX: roll(), AG: roll(),
                IT: roll(), IN: roll(), WD: roll(), CH: roll()
            }
        };
    }),

    resetAttributes: () => set({ attributes: initialAttributes }),

    toggleSkill: (skill) => set((state) => {
        const exists = state.selectedSkills.find(s => s.id === skill.id);
        if (exists) {
            return { selectedSkills: state.selectedSkills.filter(s => s.id !== skill.id) };
        } else {
            return { selectedSkills: [...state.selectedSkills, skill] };
        }
    }),

    toggleFeat: (feat) => set((state) => {
        const exists = state.selectedFeats.find(f => f.id === feat.id);
        if (exists) {
            return { selectedFeats: state.selectedFeats.filter(f => f.id !== feat.id) };
        } else {
            return { selectedFeats: [...state.selectedFeats, feat] };
        }
    }),

    setDeity: (deity) => set({ selectedDeity: deity }),
    setBackground: (background) => set({ selectedBackground: background }),

    reset: () => set({
        step: 1,
        name: '',
        portrait: '',
        selectedRace: null,
        selectedClass: null,
        attributes: initialAttributes,
        negativeAttributes: initialNegativeAttributes,
        selectedSkills: [],
        selectedFeats: [],
        selectedDeity: null,
        selectedBackground: null
    })
}));
