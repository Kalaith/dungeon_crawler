import type { Attribute } from '../types';

export type SkillCategory = 'Combat' | 'Body' | 'Social' | 'Nature' | 'Lore' | 'Craftsmanship' | 'Intuitive';

export interface SkillDefinition {
    id: string;
    name: string;
    category: SkillCategory;
    primaryAttribute: Attribute;
    secondaryAttributes: Attribute[];
    description: string;
    maxIncreasePerLevel: number; // How much this skill can increase per level
}

export const SKILLS: SkillDefinition[] = [
    // COMBAT SKILLS (9 skills) - Max increase per level: +1
    {
        id: 'unarmed',
        name: 'Unarmed',
        category: 'Combat',
        primaryAttribute: 'ST',
        secondaryAttributes: ['AG', 'DX'],
        description: 'Encompasses boxing, wrestling, and kicking. A skill to fall back on in case the character\'s weapon breaks.',
        maxIncreasePerLevel: 1
    },
    {
        id: 'cutting_weapons',
        name: 'Cutting Weapons',
        category: 'Combat',
        primaryAttribute: 'ST',
        secondaryAttributes: ['AG'],
        description: 'Governs use of all weapons used in a striking fashion, including edged weapons (sabre, cutlass) and some blunt weapons (mace, morning star).',
        maxIncreasePerLevel: 1
    },
    {
        id: 'pointed_weapons',
        name: 'Pointed Weapons',
        category: 'Combat',
        primaryAttribute: 'DX',
        secondaryAttributes: ['AG'],
        description: 'Includes epee, rapier, foil, as well as all knives and daggers.',
        maxIncreasePerLevel: 1
    },
    {
        id: 'swords',
        name: 'Swords',
        category: 'Combat',
        primaryAttribute: 'ST',
        secondaryAttributes: ['AG', 'DX'],
        description: 'Swords are used as striking weapons but can be used to pierce as well. Handled easily and readily available.',
        maxIncreasePerLevel: 1
    },
    {
        id: 'axes',
        name: 'Axes',
        category: 'Combat',
        primaryAttribute: 'ST',
        secondaryAttributes: ['AG'],
        description: 'Axes and hatchets are favored weapons of northern warriors and are easy to find. Do a lot of damage but require a lot of skill to handle.',
        maxIncreasePerLevel: 1
    },
    {
        id: 'pole_arms',
        name: 'Pole Arms',
        category: 'Combat',
        primaryAttribute: 'ST',
        secondaryAttributes: ['AG'],
        description: 'Used for spears and pole arms, but also for quarterstaves and double fleurs.',
        maxIncreasePerLevel: 1
    },
    {
        id: 'two_handed_swords',
        name: 'Two-Handed Swords',
        category: 'Combat',
        primaryAttribute: 'ST',
        secondaryAttributes: ['CO'],
        description: 'Governs all two-handed swords. Normally, only warriors learn to handle these awkward weapons.',
        maxIncreasePerLevel: 1
    },
    {
        id: 'missile_weapons',
        name: 'Missile Weapons',
        category: 'Combat',
        primaryAttribute: 'DX',
        secondaryAttributes: ['AG', 'IN'],
        description: 'Most common types are the various types of bows and the crossbow.',
        maxIncreasePerLevel: 1
    },
    {
        id: 'throwing_weapons',
        name: 'Throwing Weapons',
        category: 'Combat',
        primaryAttribute: 'DX',
        secondaryAttributes: ['ST'],
        description: 'Includes all javelins, throwing knives, throwing stars, and throwing hatchets.',
        maxIncreasePerLevel: 1
    },

    // BODY SKILLS (10 skills) - Max increase per level: +2
    {
        id: 'acrobatics',
        name: 'Acrobatics',
        category: 'Body',
        primaryAttribute: 'AG',
        secondaryAttributes: ['CO', 'ST'],
        description: 'Covers attempts to stay on your feet in tricky situations, such as running across ice, balancing on a tightrope, or staying upright on a rocking ship\'s deck.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'climb',
        name: 'Climb',
        category: 'Body',
        primaryAttribute: 'ST',
        secondaryAttributes: ['CO', 'AG'],
        description: 'Climbing is always risky, especially at great heights. Success depends on skill level and whether specialized equipment is used.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'physical_control',
        name: 'Physical Control',
        category: 'Body',
        primaryAttribute: 'AG',
        secondaryAttributes: ['CO', 'IN'],
        description: 'Allows reducing consequences of a fall, escaping an opponent\'s grip, or squeezing through a narrow crack.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'ride',
        name: 'Ride',
        category: 'Body',
        primaryAttribute: 'AG',
        secondaryAttributes: ['CH', 'ST'],
        description: 'Ability to ride horseback during daring maneuvers without falling.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'stealth',
        name: 'Stealth',
        category: 'Body',
        primaryAttribute: 'AG',
        secondaryAttributes: ['CO', 'IN'],
        description: 'Ability to move without a sound and conceal yourself from enemies. Success depends on ground type and armor worn.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'swim',
        name: 'Swim',
        category: 'Body',
        primaryAttribute: 'ST',
        secondaryAttributes: ['CO', 'AG'],
        description: 'Determines how long a character can keep their head above water. Any kind of armor is a large hindrance.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'self_control',
        name: 'Self Control',
        category: 'Body',
        primaryAttribute: 'CO',
        secondaryAttributes: ['ST', 'ST'],
        description: 'Ability to take damage without letting pain get the better of you. Allows continuing actions with accuracy and skill.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'dance',
        name: 'Dance',
        category: 'Body',
        primaryAttribute: 'AG',
        secondaryAttributes: ['CH', 'AG'],
        description: 'Like Acrobatics, offers opportunities for earning money performing for an appreciative audience.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'hide',
        name: 'Hide',
        category: 'Body',
        primaryAttribute: 'AG',
        secondaryAttributes: ['CO', 'IN'],
        description: 'Ability to find a hiding place quickly and quietly.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'carouse',
        name: 'Carouse',
        category: 'Body',
        primaryAttribute: 'CO',
        secondaryAttributes: ['WD', 'IN', 'ST'],
        description: 'Ability to hold oneself in check while visiting taverns. Affects amount of alcohol a character can drink before becoming intoxicated.',
        maxIncreasePerLevel: 2
    },

    // SOCIAL SKILLS (7 skills) - Max increase per level: +2
    {
        id: 'convert',
        name: 'Convert',
        category: 'Social',
        primaryAttribute: 'CH',
        secondaryAttributes: ['WD', 'IN'],
        description: 'Ability to influence others with tact, social graces, and good nature to convince them your point of view is correct, especially regarding religious matters.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'seduce',
        name: 'Seduce',
        category: 'Social',
        primaryAttribute: 'CH',
        secondaryAttributes: ['IN', 'CH'],
        description: 'Ability to attract and charm others through personal magnetism and social grace. Used to gain favor, secure assistance, or obtain information.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'haggle',
        name: 'Haggle',
        category: 'Social',
        primaryAttribute: 'CH',
        secondaryAttributes: ['CO', 'WD'],
        description: 'Good hagglers can get discounts of up to 50% from merchants in markets.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'streetwise',
        name: 'Streetwise',
        category: 'Social',
        primaryAttribute: 'CH',
        secondaryAttributes: ['WD', 'IN'],
        description: 'Helps find your way in a strange town, find unguarded shortcuts, avoid city guards, and locate good begging spots.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'lie',
        name: 'Lie',
        category: 'Social',
        primaryAttribute: 'CH',
        secondaryAttributes: ['CO', 'IN'],
        description: 'Determines whether you can convincingly hide the truth, either verbally or through your actions. Includes misleading others through ambiguity to telling outright lies.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'human_nature',
        name: 'Human Nature',
        category: 'Social',
        primaryAttribute: 'IN',
        secondaryAttributes: ['WD', 'CH'],
        description: 'Allows determining the true intentions of a creature, such as when searching out a lie or predicting someone\'s next move.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'evaluate',
        name: 'Evaluate',
        category: 'Social',
        primaryAttribute: 'IN',
        secondaryAttributes: ['WD', 'IN'],
        description: 'Helps characters estimate the value of artifacts and other useful items.',
        maxIncreasePerLevel: 2
    },

    // NATURE SKILLS (6 skills) - Max increase per level: +2
    {
        id: 'track',
        name: 'Track',
        category: 'Nature',
        primaryAttribute: 'IN',
        secondaryAttributes: ['WD', 'AG'],
        description: 'Used to follow tracks, identify the species that left them, and determine how recently they passed. Essential for hunting wild game.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'bind',
        name: 'Bind',
        category: 'Nature',
        primaryAttribute: 'DX',
        secondaryAttributes: ['AG', 'ST'],
        description: 'Knowledge of ropes and knots. Helps when tying game and freeing oneself if bound and gagged.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'orientation',
        name: 'Orientation',
        category: 'Nature',
        primaryAttribute: 'IN',
        secondaryAttributes: ['WD', 'IN'],
        description: 'Well-honed sense of direction useful in wilderness and down in dungeons.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'herb_lore',
        name: 'Herb Lore',
        category: 'Nature',
        primaryAttribute: 'IN',
        secondaryAttributes: ['WD', 'DX'],
        description: 'Measures ability to recall lore about terrain, plants and their medicinal properties, and natural cycles.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'animal_lore',
        name: 'Animal Lore',
        category: 'Nature',
        primaryAttribute: 'IN',
        secondaryAttributes: ['CO', 'WD'],
        description: 'Comprehensive knowledge of animals including their behavior, habitats, and anatomy. In combat, knowing vulnerable spots can mean the difference between life and death.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'survival',
        name: 'Survival',
        category: 'Nature',
        primaryAttribute: 'IN',
        secondaryAttributes: ['DX', 'AG'],
        description: 'Essential wilderness skill used to guide your group through harsh terrain, identify signs that dangerous creatures live nearby, and predict the weather.',
        maxIncreasePerLevel: 2
    },

    // LORE SKILLS (9 skills) - Max increase per level: +3
    {
        id: 'alchemy',
        name: 'Alchemy',
        category: 'Lore',
        primaryAttribute: 'IT',
        secondaryAttributes: ['CO', 'WD', 'DX'],
        description: 'Governs recognition and preparation of potions and elixirs.',
        maxIncreasePerLevel: 3
    },
    {
        id: 'ancient_tongues',
        name: 'Ancient Tongues',
        category: 'Lore',
        primaryAttribute: 'IT',
        secondaryAttributes: ['WD', 'WD', 'IN'],
        description: 'Allows identifying ancient scrolls.',
        maxIncreasePerLevel: 3
    },
    {
        id: 'geography',
        name: 'Geography',
        category: 'Lore',
        primaryAttribute: 'IT',
        secondaryAttributes: ['WD', 'WD', 'IN'],
        description: 'Lore of far-off countries.',
        maxIncreasePerLevel: 3
    },
    {
        id: 'history',
        name: 'History',
        category: 'Lore',
        primaryAttribute: 'IT',
        secondaryAttributes: ['WD', 'WD', 'IN'],
        description: 'Measures ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.',
        maxIncreasePerLevel: 3
    },
    {
        id: 'ritual',
        name: 'Ritual',
        category: 'Lore',
        primaryAttribute: 'WD',
        secondaryAttributes: ['IN', 'CH'],
        description: 'Measures ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.',
        maxIncreasePerLevel: 3
    },
    {
        id: 'tactics',
        name: 'Tactics',
        category: 'Lore',
        primaryAttribute: 'IT',
        secondaryAttributes: ['CO', 'WD', 'CH'],
        description: 'Knowledge of successful combat movement.',
        maxIncreasePerLevel: 3
    },
    {
        id: 'read_write',
        name: 'Read/Write',
        category: 'Lore',
        primaryAttribute: 'IT',
        secondaryAttributes: ['WD', 'WD', 'DX'],
        description: 'Ability to read and write your native tongue. Quite a rare skill.',
        maxIncreasePerLevel: 3
    },
    {
        id: 'arcane_lore',
        name: 'Arcane Lore',
        category: 'Lore',
        primaryAttribute: 'IT',
        secondaryAttributes: ['WD', 'WD', 'DX'],
        description: 'Measures ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.',
        maxIncreasePerLevel: 3
    },
    {
        id: 'tongues',
        name: 'Tongues',
        category: 'Lore',
        primaryAttribute: 'IT',
        secondaryAttributes: ['WD', 'IN', 'CH'],
        description: 'Determines how many foreign languages a character speaks and how well they speak them.',
        maxIncreasePerLevel: 3
    },

    // CRAFTSMANSHIP SKILLS (9 skills) - Max increase per level: +2
    {
        id: 'train_animals',
        name: 'Train Animals',
        category: 'Craftsmanship',
        primaryAttribute: 'CH',
        secondaryAttributes: ['CO', 'IN'],
        description: 'Used to tame and train animals such as horses, hounds, or falcons.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'drive',
        name: 'Drive',
        category: 'Craftsmanship',
        primaryAttribute: 'CH',
        secondaryAttributes: ['IN', 'DX'],
        description: 'Skill of handling carts, coaches, and sleds.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'cheat',
        name: 'Cheat',
        category: 'Craftsmanship',
        primaryAttribute: 'DX',
        secondaryAttributes: ['CO', 'CH'],
        description: 'Skill in manipulating games of chance through sleight of hand and misdirection. Promises substantial monetary rewards as long as no one notices your tricks.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'treat_disease',
        name: 'Treat Disease',
        category: 'Craftsmanship',
        primaryAttribute: 'CH',
        secondaryAttributes: ['CO', 'WD'],
        description: 'Essential healing skill that allows you to diagnose illnesses and treat diseased companions.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'treat_poison',
        name: 'Treat Poison',
        category: 'Craftsmanship',
        primaryAttribute: 'IN',
        secondaryAttributes: ['CO', 'WD'],
        description: 'Essential healing skill for dealing with poisoned characters.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'treat_wounds',
        name: 'Treat Wounds',
        category: 'Craftsmanship',
        primaryAttribute: 'DX',
        secondaryAttributes: ['WD', 'CH'],
        description: 'Very commonly used skill for adventurers. Allows you to stabilize dying companions, bind wounds, and provide emergency medical care.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'instrument',
        name: 'Instrument',
        category: 'Craftsmanship',
        primaryAttribute: 'DX',
        secondaryAttributes: ['WD', 'IN'],
        description: 'Determines how well you can delight an audience with music. Can earn money performing at taverns and festivals.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'locks',
        name: 'Locks',
        category: 'Craftsmanship',
        primaryAttribute: 'DX',
        secondaryAttributes: ['IN', 'DX'],
        description: 'Essential skill for survival in towns and dungeons. Covers picking locks on doors, chests, and other secured containers.',
        maxIncreasePerLevel: 2
    },
    {
        id: 'pickpocket',
        name: 'Pickpocket',
        category: 'Craftsmanship',
        primaryAttribute: 'DX',
        secondaryAttributes: ['CO', 'IN'],
        description: 'Covers acts of legerdemain and manual trickery, such as planting something on someone else, concealing an object on your person, or lifting a coin purse.',
        maxIncreasePerLevel: 2
    },

    // INTUITIVE SKILLS (2 skills) - Max increase per level: +1
    {
        id: 'danger_sense',
        name: 'Danger Sense',
        category: 'Intuitive',
        primaryAttribute: 'IN',
        secondaryAttributes: ['WD', 'IN'],
        description: 'Provides warning of immediate danger posed by ambush or trap.',
        maxIncreasePerLevel: 1
    },
    {
        id: 'perception',
        name: 'Perception',
        category: 'Intuitive',
        primaryAttribute: 'IN',
        secondaryAttributes: ['WD', 'IN'],
        description: 'Lets you spot, hear, or otherwise detect the presence of something. Measures your general awareness of surroundings and the keenness of your senses.',
        maxIncreasePerLevel: 1
    }
];

// Helper function to get skill by ID
export function getSkillById(id: string): SkillDefinition | undefined {
    return SKILLS.find(skill => skill.id === id);
}

// Helper function to get skills by category
export function getSkillsByCategory(category: SkillCategory): SkillDefinition[] {
    return SKILLS.filter(skill => skill.category === category);
}

// All skill categories in order
export const skillCategories: SkillCategory[] = [
    'Combat',
    'Body',
    'Social',
    'Nature',
    'Lore',
    'Craftsmanship',
    'Intuitive'
];
