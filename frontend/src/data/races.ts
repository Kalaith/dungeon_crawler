import type { Race } from '../types';

export const races: Race[] = [
    {
        id: 'human',
        name: 'Human',
        description: 'Versatile and adaptable, humans are the most common race in the realms.',
        attributeModifiers: {},
        abilities: [],
        movementRate: 30
    },
    {
        id: 'elf',
        name: 'Elf',
        description: 'Graceful and magical, elves live in harmony with nature.',
        attributeModifiers: {
            AG: 1,
            IN: 1,
            CO: -1,
            ST: -1
        },
        abilities: [
            {
                id: 'keen_senses',
                name: 'Keen Senses',
                description: 'Proficiency in Perception skill.',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'fey_ancestry',
                name: 'Fey Ancestry',
                description: 'Advantage on saving throws against being charmed, and magic can\'t put you to sleep.',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 30
    },
    {
        id: 'dwarf',
        name: 'Dwarf',
        description: 'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',
        attributeModifiers: {
            CO: 2,
            ST: 1,
            CH: -1,
            AG: -1
        },
        abilities: [
            {
                id: 'dwarven_resilience',
                name: 'Dwarven Resilience',
                description: 'Advantage on saving throws against poison, and resistance against poison damage.',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 25
    },
    {
        id: 'halfling',
        name: 'Halfling',
        description: 'The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.',
        attributeModifiers: {
            DX: 2,
            CH: 1,
            ST: -1
        },
        abilities: [
            {
                id: 'lucky',
                name: 'Lucky',
                description: 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'brave',
                name: 'Brave',
                description: 'Advantage on saving throws against being frightened.',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 25
    }
];
