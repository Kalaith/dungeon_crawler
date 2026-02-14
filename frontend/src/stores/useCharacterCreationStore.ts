import { create } from 'zustand';
import type {
  Race,
  CharacterClass,
  Attributes,
  NegativeAttributes,
  Skill,
  Feat,
  Attribute,
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
  ST: 10,
  CO: 10,
  DX: 10,
  AG: 10,
  IT: 10,
  IN: 10,
  WD: 10,
  CH: 10,
};

const initialNegativeAttributes: NegativeAttributes = {
  SN: 2,
  AC: 2,
  CL: 2,
  AV: 2,
  NE: 2,
  CU: 2,
  VT: 2,
};

export const useCharacterCreationStore = create<CharacterCreationState>(set => ({
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

  setStep: step => set({ step }),
  setName: name => set({ name }),
  setPortrait: portrait => set({ portrait }),
  setRace: race => set({ selectedRace: race }),
  setClass: charClass => set({ selectedClass: charClass }),
  setGenerationMethod: method => set({ generationMethod: method }),

  setAttribute: (attr, value) =>
    set(state => {
      const currentSum = Object.values(state.attributes).reduce((a, b) => a + b, 0);
      const oldVal = state.attributes[attr];
      const diff = value - oldVal;
      const newSum = currentSum + diff;
      const maxPoints = 100;

      if (newSum > maxPoints && diff > 0) return state; // Cannot exceed max points
      if (value < 8 || value > 18) return state; // Hard limits

      return {
        attributes: { ...state.attributes, [attr]: value },
        attributePointsRemaining: maxPoints - newSum,
      };
    }),

  setNegativeAttribute: (attr, value) =>
    set(state => {
      // Enforce bounds for negative attributes (2-8 for new characters)
      const clampedValue = Math.max(2, Math.min(8, value));
      const oldValue = state.negativeAttributes[attr];

      // Calculate the change in negative attribute points
      // Base is 2, so anything above 2 is "spending" points on flaws
      const oldNegativePoints = oldValue - 2;
      const newNegativePoints = clampedValue - 2;
      const negativePointChange = newNegativePoints - oldNegativePoints;

      // Trading rate: 2 negative points = 1 positive point
      // So if you increase a negative attribute by 2, you get 1 positive point
      const positivePointGain = Math.floor(negativePointChange / 2);

      // Calculate current positive attribute sum
      const currentSum = Object.values(state.attributes).reduce((a, b) => a + b, 0);
      const maxPoints = 100;

      // New points remaining = old remaining + points gained from negative attributes
      const newPointsRemaining = maxPoints - currentSum + positivePointGain;

      return {
        negativeAttributes: {
          ...state.negativeAttributes,
          [attr]: clampedValue,
        },
        attributePointsRemaining: newPointsRemaining,
      };
    }),

  rollAttributes: () =>
    set(() => {
      // 3d6 roll for positive attributes
      const roll3d6 = () =>
        Math.floor(Math.random() * 6) +
        1 +
        Math.floor(Math.random() * 6) +
        1 +
        Math.floor(Math.random() * 6) +
        1;
      // 1d6+1 roll for negative attributes (range 2-7, occasionally 8)
      const roll1d6plus1 = () => Math.floor(Math.random() * 6) + 1 + 1;

      return {
        attributes: {
          ST: roll3d6(),
          CO: roll3d6(),
          DX: roll3d6(),
          AG: roll3d6(),
          IT: roll3d6(),
          IN: roll3d6(),
          WD: roll3d6(),
          CH: roll3d6(),
        },
        negativeAttributes: {
          SN: roll1d6plus1(),
          AC: roll1d6plus1(),
          CL: roll1d6plus1(),
          AV: roll1d6plus1(),
          NE: roll1d6plus1(),
          CU: roll1d6plus1(),
          VT: roll1d6plus1(),
        },
      };
    }),

  resetAttributes: () => set({ attributes: initialAttributes }),

  toggleSkill: skill =>
    set(state => {
      const exists = state.selectedSkills.find(s => s.id === skill.id);
      if (exists) {
        return {
          selectedSkills: state.selectedSkills.filter(s => s.id !== skill.id),
        };
      } else {
        return { selectedSkills: [...state.selectedSkills, skill] };
      }
    }),

  toggleFeat: feat =>
    set(state => {
      const exists = state.selectedFeats.find(f => f.id === feat.id);
      if (exists) {
        return {
          selectedFeats: state.selectedFeats.filter(f => f.id !== feat.id),
        };
      } else {
        return { selectedFeats: [...state.selectedFeats, feat] };
      }
    }),

  setDeity: deity => set({ selectedDeity: deity }),
  setBackground: background => set({ selectedBackground: background }),

  reset: () =>
    set({
      step: 1,
      name: '',
      portrait: '',
      selectedRace: null,
      selectedClass: null,
      attributes: initialAttributes,
      negativeAttributes: initialNegativeAttributes,
      attributePointsRemaining: 20,
      selectedSkills: [],
      selectedFeats: [],
      selectedDeity: null,
      selectedBackground: null,
    }),
}));
