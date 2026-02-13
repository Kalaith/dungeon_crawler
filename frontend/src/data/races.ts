import type { Race } from '../types';

export const races: Race[] = [
  {
    id: 'human',
    name: 'Human',
    description:
      'Versatile and adaptable, humans are the most common race. They excel in any profession through sheer drive and versatility.',
    attributeModifiers: {},
    abilities: [
      {
        id: 'versatile',
        name: 'Versatile',
        description: '+5 Skill Increase Attempts (25 total base)',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
  },
  {
    id: 'thorwalian',
    name: 'Thorwalian',
    description:
      'Hulking seafaring warriors known for good living and battle lust. Hardy fighters who thrive in harsh northern climates.',
    attributeModifiers: {
      CO: 1,
      ST: 2,
      CH: -1,
    },
    abilities: [
      {
        id: 'seafaring',
        name: 'Seafaring',
        description: 'Proficiency with ships and navigation',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'battle_lust',
        name: 'Battle Lust',
        description: 'Advantage on attack rolls when below half HP',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'elf',
    name: 'Elf',
    description:
      'Graceful and long-lived, elves are at home in nature and magic. Known for their keen senses and intuition.',
    attributeModifiers: {
      DX: 2,
      IT: 1,
      CO: -1,
    },
    abilities: [
      {
        id: 'keen_senses',
        name: 'Keen Senses',
        description: 'Proficiency in Perception skill',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'fey_ancestry',
        name: 'Fey Ancestry',
        description:
          "Advantage on saving throws against being charmed, magic can't put you to sleep",
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'trance',
        name: 'Trance',
        description: 'Meditate for 4 hours instead of sleeping 8',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'darkvision',
        name: 'Darkvision',
        description:
          'See in dim light within 60 feet as if it were bright light',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    description:
      'Excellent smiths and warriors. Known for resilience, stonework affinity, and unwavering loyalty to clan and tradition.',
    attributeModifiers: {
      DX: 1,
      ST: 2,
      CH: -1,
      AG: -1,
    },
    abilities: [
      {
        id: 'dwarven_resilience',
        name: 'Dwarven Resilience',
        description:
          'Resistance to poison damage and advantage on saving throws against poison',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'stonecunning',
        name: 'Stonecunning',
        description: 'Proficiency in History checks related to stonework',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
  },
  {
    id: 'green_elf',
    name: 'Green Elf',
    description:
      'Elves with closest contact to humans. Skilled with magic and missile weapons, self-disciplined and sociable.',
    attributeModifiers: {
      IT: 2,
      AG: 1,
      ST: -1,
      CO: -1,
    },
    abilities: [
      {
        id: 'keen_senses',
        name: 'Keen Senses',
        description: 'Proficiency in Perception skill',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'fey_ancestry',
        name: 'Fey Ancestry',
        description:
          "Advantage on saving throws against being charmed, magic can't put you to sleep",
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'trance',
        name: 'Trance',
        description: 'Meditate for 4 hours instead of sleeping 8',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'ice_elf',
    name: 'Ice Elf',
    description:
      'Rare elves from the frozen north with mysterious sensory magic. Remarkable endurance and keen perception.',
    attributeModifiers: {
      AG: 2,
      IN: 1,
      ST: -1,
      CH: -1,
    },
    abilities: [
      {
        id: 'cold_resistance',
        name: 'Cold Resistance',
        description: 'Resistance to cold damage',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'arctic_endurance',
        name: 'Arctic Endurance',
        description:
          'Advantage on Constitution saves against environmental hazards',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'fey_ancestry',
        name: 'Fey Ancestry',
        description: 'Advantage on saving throws against being charmed',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'silvan_elf',
    name: 'Silvan Elf',
    description:
      'Secluded forest dwellers, masters of archery and nature magic. Self-sufficient and perfectly adapted to forest life.',
    attributeModifiers: {
      AG: 2,
      IN: 2,
      ST: -2,
      CO: -1,
    },
    abilities: [
      {
        id: 'forest_survival',
        name: 'Forest Survival',
        description: 'Proficiency in Survival and Nature skills',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'master_archer',
        name: 'Master Archer',
        description: 'Advantage on ranged weapon attacks with bows',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'fey_ancestry',
        name: 'Fey Ancestry',
        description: 'Advantage on saving throws against being charmed',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 35,
    isNpcOnly: true,
  },
  {
    id: 'halfling',
    name: 'Halfling',
    description:
      'Diminutive folk known for practical minds, kind hearts, and surprising courage. Naturally lucky and nimble.',
    attributeModifiers: {
      DX: 2,
      CH: 1,
      ST: -2,
    },
    abilities: [
      {
        id: 'lucky',
        name: 'Lucky',
        description:
          'Reroll natural 1s on attack rolls, ability checks, or saving throws',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'brave',
        name: 'Brave',
        description: 'Advantage on saving throws against being frightened',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'nimble',
        name: 'Nimble',
        description: 'Can move through spaces of larger creatures',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
  },
  {
    id: 'gnome',
    name: 'Gnome',
    description:
      'Boundlessly energetic and curious inventors. Natural affinity for illusions and mechanical contraptions.',
    attributeModifiers: {
      IT: 2,
      DX: 1,
      ST: -2,
    },
    abilities: [
      {
        id: 'gnome_cunning',
        name: 'Gnome Cunning',
        description: 'Advantage on INT, WIS, and CHA saves against magic',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'artificers_lore',
        name: "Artificer's Lore",
        description:
          'Proficiency in History checks related to magic items and technology',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'darkvision',
        name: 'Darkvision',
        description:
          'See in dim light within 60 feet as if it were bright light',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    description:
      'Born of dragons, combining draconic and humanoid traits. Value honor and clan, possess devastating breath weapons.',
    attributeModifiers: {
      ST: 2,
      CH: 1,
      DX: -1,
    },
    abilities: [
      {
        id: 'draconic_ancestry',
        name: 'Draconic Ancestry',
        description:
          'Choose a dragon type, gain resistance to associated damage type',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'breath_weapon',
        name: 'Breath Weapon',
        description: 'Exhale destructive energy based on draconic ancestry',
        unlockLevel: 1,
        target: 'enemy',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    description:
      'Bearing infernal bloodline marks. Natural command of darkness and fire, often face prejudice but not inherently evil.',
    attributeModifiers: {
      CH: 2,
      IT: 1,
      WD: -1,
    },
    abilities: [
      {
        id: 'darkvision',
        name: 'Darkvision',
        description:
          'See in dim light within 60 feet as if it were bright light',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'hellish_resistance',
        name: 'Hellish Resistance',
        description: 'Resistance to fire damage',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'infernal_legacy',
        name: 'Infernal Legacy',
        description:
          'Know Thaumaturgy cantrip, can cast Hellish Rebuke and Darkness',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'half_elf',
    name: 'Half-Elf',
    description:
      'Walking in two worlds but belonging to neither. Combine human versatility with elven grace and fey heritage.',
    attributeModifiers: {
      CH: 2,
      AG: 1,
      ST: -1,
    },
    abilities: [
      {
        id: 'fey_ancestry',
        name: 'Fey Ancestry',
        description:
          "Advantage on saving throws against being charmed, magic can't put you to sleep",
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'skill_versatility',
        name: 'Skill Versatility',
        description: 'Proficiency in two skills of your choice',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'darkvision',
        name: 'Darkvision',
        description:
          'See in dim light within 60 feet as if it were bright light',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
  },
  {
    id: 'grung',
    name: 'Grung',
    description:
      'Small, poisonous frog-like humanoids from tropical jungles. Fiercely territorial and caste-bound.',
    attributeModifiers: {
      DX: 2,
      CO: 1,
    },
    abilities: [
      {
        id: 'poisonous_skin',
        name: 'Poisonous Skin',
        description: 'Contact with skin is poisonous. Immune to poison damage.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'standing_leap',
        name: 'Standing Leap',
        description: 'Can jump long distances without a running start.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'water_dependency',
        name: 'Water Dependency',
        description: 'Must immerse in water daily or suffer exhaustion.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'aarakocra',
    name: 'Aarakocra',
    description:
      'Birdfolk from the Elemental Plane of Air. Cherish freedom and the open sky above all else.',
    attributeModifiers: {
      DX: 2,
      WD: 1,
    },
    abilities: [
      {
        id: 'flight',
        name: 'Flight',
        description:
          'Can fly at 50ft speed when not wearing medium or heavy armor.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'talons',
        name: 'Talons',
        description: 'Unarmed strikes deal 1d6 slashing damage.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'changeling',
    name: 'Changeling',
    description:
      'Shapeshifters who can alter their appearance at will. Often hide their true nature behind many masks.',
    attributeModifiers: {
      CH: 2,
    },
    abilities: [
      {
        id: 'shapechanger',
        name: 'Shapechanger',
        description:
          'Change appearance and voice to any Medium humanoid seen before.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'changeling_instincts',
        name: 'Changeling Instincts',
        description: 'Proficiency in Deception and Insight.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'plasmoid',
    name: 'Plasmoid',
    description:
      'Amorphous beings of ooze. Can alter their shape and squeeze through tiny gaps.',
    attributeModifiers: {
      ST: 1,
      CO: 1,
      DX: 1,
    },
    abilities: [
      {
        id: 'amorphous',
        name: 'Amorphous',
        description: 'Can squeeze through spaces as narrow as 1 inch.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'shape_self',
        name: 'Shape Self',
        description: 'Reshape body to form limbs or flatten out.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'acid_resistance',
        name: 'Acid Resistance',
        description: 'Resistance to acid and poison damage.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'yuan_ti_pureblood',
    name: 'Yuan-ti Pureblood',
    description:
      'Serpent-blooded humans who view emotions as weakness. Masters of poison and magic resistance.',
    attributeModifiers: {
      CH: 2,
      IT: 1,
    },
    abilities: [
      {
        id: 'magic_resistance',
        name: 'Magic Resistance',
        description:
          'Advantage on saving throws against spells and magical effects.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'poison_immunity',
        name: 'Poison Immunity',
        description: 'Immune to poison damage and the poisoned condition.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'innate_spellcasting',
        name: 'Innate Spellcasting',
        description:
          'Know Poison Spray, Animal Friendship (snakes), and Suggestion.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'centaur',
    name: 'Centaur',
    description:
      'Upper body of a human, lower body of a horse. Nature wardens with immense speed and charge attacks.',
    attributeModifiers: {
      ST: 2,
      WD: 1,
    },
    abilities: [
      {
        id: 'charge',
        name: 'Charge',
        description:
          'Move 30ft then hit with melee attack to deal extra damage.',
        unlockLevel: 1,
        target: 'enemy',
      },
      {
        id: 'equine_build',
        name: 'Equine Build',
        description:
          'Count as one size larger for carrying capacity. Climbing costs extra movement.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'hooves',
        name: 'Hooves',
        description: 'Unarmed strikes deal 1d6 bludgeoning damage.',
        unlockLevel: 1,
        target: 'enemy',
      },
    ],
    movementRate: 40,
    isNpcOnly: true,
  },
  {
    id: 'bugbear',
    name: 'Bugbear',
    description:
      'Massive, hairy goblinoids born for stealth and ambush. Surprisingly quiet for their size.',
    attributeModifiers: {
      ST: 2,
      DX: 1,
    },
    abilities: [
      {
        id: 'long_limbed',
        name: 'Long-Limbed',
        description: 'Melee reach increases by 5 feet.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'surprise_attack',
        name: 'Surprise Attack',
        description:
          "Deal extra 2d6 damage if you hit a creature that hasn't taken a turn yet.",
        unlockLevel: 1,
        target: 'enemy',
      },
      {
        id: 'powerful_build',
        name: 'Powerful Build',
        description: 'Count as one size larger for carrying capacity.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'loxodon',
    name: 'Loxodon',
    description:
      'Elephant-like humanoids known for their serenity, wisdom, and immense strength.',
    attributeModifiers: {
      CO: 2,
      WD: 1,
    },
    abilities: [
      {
        id: 'natural_armor',
        name: 'Natural Armor',
        description: 'AC is 12 + CON modifier when unarmored.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'trunk',
        name: 'Trunk',
        description:
          'Can grasp things, lift objects, and make unarmed strikes.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'loxodon_serenity',
        name: 'Loxodon Serenity',
        description:
          'Advantage on saving throws against being charmed or frightened.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'eladrin',
    name: 'Eladrin',
    description:
      'Elves of the Feywild, their moods and forms shifting like the seasons.',
    attributeModifiers: {
      DX: 2,
      CH: 1,
    },
    abilities: [
      {
        id: 'fey_step',
        name: 'Fey Step',
        description: 'Teleport 30ft as a bonus action.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'seasonal_affinity',
        name: 'Seasonal Affinity',
        description:
          'Fey Step gains additional effects based on current season (Spring, Summer, Autumn, Winter).',
        unlockLevel: 3,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'githyanki',
    name: 'Githyanki',
    description:
      'Astral warriors who were once enslaved by mind flayers. Raiders of the multiverse.',
    attributeModifiers: {
      ST: 2,
      IT: 1,
    },
    abilities: [
      {
        id: 'astral_knowledge',
        name: 'Astral Knowledge',
        description:
          'Gain proficiency in one skill and one weapon/tool of choice after a rest.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'psionics',
        name: 'Psionics',
        description:
          'Cast Mage Hand (invisible), Jump, and Misty Step using psionics.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'verdan',
    name: 'Verdan',
    description:
      'Goblinoids transformed by chaotic energy. They evolve and mutate as they level up.',
    attributeModifiers: {
      CO: 2,
      CH: 1,
    },
    abilities: [
      {
        id: 'black_blood_healing',
        name: 'Black Blood Healing',
        description: 'Reroll 1s and 2s on Hit Dice for healing.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'telepathic_insight',
        name: 'Telepathic Insight',
        description: 'Advantage on Wisdom saves. Limited telepathy.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'mutative_growth',
        name: 'Mutative Growth',
        description: 'Size becomes Medium at level 5.',
        unlockLevel: 5,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'satyr',
    name: 'Satyr',
    description:
      'Fey creatures who revel in nature and music. Resistant to magic and naturally nimble.',
    attributeModifiers: {
      CH: 2,
      DX: 1,
    },
    abilities: [
      {
        id: 'magic_resistance',
        name: 'Magic Resistance',
        description: 'Advantage on saving throws against spells.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'mirthful_leaps',
        name: 'Mirthful Leaps',
        description: 'Add d8 to jump distance.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'ram',
        name: 'Ram',
        description: 'Unarmed strike with head deals 1d6 bludgeoning damage.',
        unlockLevel: 1,
        target: 'enemy',
      },
    ],
    movementRate: 35,
    isNpcOnly: true,
  },
  {
    id: 'firbolg',
    name: 'Firbolg',
    description:
      'Gentle giant-kin of the forests. Can speak with plants and animals and turn invisible briefly.',
    attributeModifiers: {
      WD: 2,
      ST: 1,
    },
    abilities: [
      {
        id: 'firbolg_magic',
        name: 'Firbolg Magic',
        description:
          'Cast Detect Magic and Disguise Self. Turn invisible for one turn.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'speech_beast_leaf',
        name: 'Speech of Beast and Leaf',
        description: 'Communicate with beasts and plants.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'powerful_build',
        name: 'Powerful Build',
        description: 'Count as one size larger for carrying capacity.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'kobold',
    name: 'Kobold',
    description:
      'Small reptilian humanoids. Weak individually but deadly in groups thanks to pack tactics.',
    attributeModifiers: {
      DX: 2,
      ST: -2,
    },
    abilities: [
      {
        id: 'pack_tactics',
        name: 'Pack Tactics',
        description:
          'Advantage on attacks if an ally is within 5ft of the target.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'sunlight_sensitivity',
        name: 'Sunlight Sensitivity',
        description:
          'Disadvantage on attacks and perception in direct sunlight.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'thri_kreen',
    name: 'Thri-Kreen',
    description:
      'Insectile nomads from arid lands. Have four arms and telepathy.',
    attributeModifiers: {
      DX: 2,
      WD: 1,
    },
    abilities: [
      {
        id: 'secondary_arms',
        name: 'Secondary Arms',
        description:
          'Two smaller arms can manipulate light objects and weapons.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'chameleon_carapace',
        name: 'Chameleon Carapace',
        description: 'Change color to hide. AC 13 + DEX when unarmored.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'sleepless',
        name: 'Sleepless',
        description: 'Do not sleep. Alert while resting.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'autognome',
    name: 'Autognome',
    description:
      'Mechanical gnomes built for specific purposes. Durable and precise.',
    attributeModifiers: {
      IT: 2,
      CO: 1,
    },
    abilities: [
      {
        id: 'armored_casing',
        name: 'Armored Casing',
        description: 'AC 13 + DEX (max 2) when unarmored.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'built_for_success',
        name: 'Built for Success',
        description: 'Add d4 to attack, check, or save a few times per day.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'mechanical_nature',
        name: 'Mechanical Nature',
        description: 'Immune to disease, poison, and needing to breathe/eat.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'giff',
    name: 'Giff',
    description:
      'Hippo-folk spacefarers with a love for firearms and explosives.',
    attributeModifiers: {
      ST: 2,
      CO: 1,
    },
    abilities: [
      {
        id: 'firearms_mastery',
        name: 'Firearms Mastery',
        description: 'Proficiency with firearms. Ignore loading property.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'hippo_build',
        name: 'Hippo Build',
        description: 'Advantage on STR checks/saves. Powerful Build.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'damage_dealer',
        name: 'Damage Dealer',
        description:
          'Reroll 1s on damage dice with melee weapons and firearms.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'hadozee',
    name: 'Hadozee',
    description:
      'Simian shipmates capable of gliding. Agile climbers and deckhands.',
    attributeModifiers: {
      DX: 2,
      CO: 1,
    },
    abilities: [
      {
        id: 'glide',
        name: 'Glide',
        description: 'Glide 5ft for every 1ft fallen. Negate fall damage.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'dexterous_feet',
        name: 'Dexterous Feet',
        description: 'Use feet to manipulate objects as a bonus action.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'dodge_response',
        name: 'Dodge Response',
        description: 'Use reaction to reduce damage taken.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'astral_elf',
    name: 'Astral Elf',
    description:
      'Elves who have lived in the Astral Sea for eons. Ageless and magical.',
    attributeModifiers: {
      DX: 2,
      IT: 1,
    },
    abilities: [
      {
        id: 'astral_fire',
        name: 'Astral Fire',
        description:
          'Know one cantrip from: Sacred Flame, Dancing Lights, or Light.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'starlight_step',
        name: 'Starlight Step',
        description: 'Teleport 30ft as a bonus action (PB times/long rest).',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'astral_trance',
        name: 'Astral Trance',
        description:
          'Gain proficiency in one skill and one weapon/tool after a rest.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  }, // Uncommon Races
  {
    id: 'azarketi',
    name: 'Azarketi',
    description:
      'Aquatic humanoids adapted to life underwater. Amphibious beings with gills and webbed extremities.',
    attributeModifiers: {
      CO: 2,
      CH: 1,
      WD: -1,
    },
    abilities: [
      {
        id: 'amphibious',
        name: 'Amphibious',
        description: 'Can breathe both air and water.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'aquatic_adaptation',
        name: 'Aquatic Adaptation',
        description:
          'Swim speed equal to land speed. Advantage on Athletics checks in water.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'catfolk',
    name: 'Catfolk',
    description:
      'Feline humanoids known for their curiosity, agility, and keen senses.',
    attributeModifiers: {
      DX: 2,
      CH: 1,
      WD: -1,
    },
    abilities: [
      {
        id: 'cats_luck',
        name: "Cat's Luck",
        description: 'Reroll a failed Reflex save once per day.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'low_light_vision',
        name: 'Low-Light Vision',
        description: 'See in dim light as if it were bright light.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'claws',
        name: 'Claws',
        description: 'Unarmed strikes deal 1d6 slashing damage.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'fetchling',
    name: 'Fetchling',
    description:
      'Shadow-touched humanoids from the Shadow Plane. Masters of stealth and darkness.',
    attributeModifiers: {
      DX: 2,
      WD: 1,
      CO: -1,
    },
    abilities: [
      {
        id: 'darkvision',
        name: 'Darkvision',
        description: 'See in darkness up to 60 feet.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'shadow_blending',
        name: 'Shadow Blending',
        description: 'Advantage on Stealth checks in dim light or darkness.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'gnoll',
    name: 'Gnoll',
    description:
      'Hyena-like humanoids known for their pack tactics and ferocity in battle.',
    attributeModifiers: {
      ST: 2,
      CO: 1,
      CH: -2,
    },
    abilities: [
      {
        id: 'pack_tactics',
        name: 'Pack Tactics',
        description:
          'Advantage on attacks when an ally is within 5ft of target.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'bite',
        name: 'Bite',
        description: 'Unarmed bite attack deals 1d6 piercing damage.',
        unlockLevel: 1,
        target: 'enemy',
      },
      {
        id: 'rampage',
        name: 'Rampage',
        description:
          'Move up to half speed as bonus action after reducing enemy to 0 HP.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'grippli',
    name: 'Grippli',
    description:
      'Frog-like humanoids from tropical jungles. Excellent climbers and jumpers.',
    attributeModifiers: {
      DX: 2,
      WD: 1,
      ST: -1,
    },
    abilities: [
      {
        id: 'jumper',
        name: 'Jumper',
        description: 'Jump distance is tripled. No running start needed.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'sticky_feet',
        name: 'Sticky Feet',
        description: 'Climb speed equal to land speed.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'hobgoblin',
    name: 'Hobgoblin',
    description:
      'Disciplined warrior humanoids who value military precision and tactical superiority.',
    attributeModifiers: {
      CO: 2,
      IT: 1,
      CH: -1,
    },
    abilities: [
      {
        id: 'martial_training',
        name: 'Martial Training',
        description: 'Proficiency with martial weapons.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'formation_tactics',
        name: 'Formation Tactics',
        description: '+1 AC when adjacent to an ally.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'kitsune',
    name: 'Kitsune',
    description:
      'Fox-like humanoids with shapeshifting abilities and natural cunning.',
    attributeModifiers: {
      CH: 2,
      DX: 1,
      ST: -1,
    },
    abilities: [
      {
        id: 'change_shape',
        name: 'Change Shape',
        description: 'Transform between humanoid and fox form.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'fox_magic',
        name: 'Fox Magic',
        description: 'Know one illusion cantrip.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'lizardfolk',
    name: 'Lizardfolk',
    description: 'Reptilian humanoids adapted to swamp and marsh environments.',
    attributeModifiers: {
      ST: 2,
      WD: 1,
      IT: -1,
    },
    abilities: [
      {
        id: 'natural_armor',
        name: 'Natural Armor',
        description: 'AC is 13 + DEX modifier when unarmored.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'bite',
        name: 'Bite',
        description: 'Unarmed bite attack deals 1d6 piercing damage.',
        unlockLevel: 1,
        target: 'enemy',
      },
      {
        id: 'hold_breath',
        name: 'Hold Breath',
        description: 'Can hold breath for 15 minutes.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'orc',
    name: 'Orc',
    description:
      'Powerful warrior humanoids known for their strength and endurance.',
    attributeModifiers: {
      ST: 2,
      CO: 1,
      IT: -1,
    },
    abilities: [
      {
        id: 'relentless_endurance',
        name: 'Relentless Endurance',
        description: 'Drop to 1 HP instead of 0 once per long rest.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'aggressive',
        name: 'Aggressive',
        description: 'Move up to speed toward an enemy as bonus action.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'ratfolk',
    name: 'Ratfolk',
    description:
      'Rat-like humanoids known for their adaptability and resourcefulness.',
    attributeModifiers: {
      DX: 2,
      IT: 1,
      ST: -2,
    },
    abilities: [
      {
        id: 'swarming',
        name: 'Swarming',
        description: 'Can occupy same space as one other ratfolk ally.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'tinker',
        name: 'Tinker',
        description: "Proficiency with one set of artisan's tools.",
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'tengu',
    name: 'Tengu',
    description:
      'Crow-like humanoids with natural curiosity and talent for swordplay.',
    attributeModifiers: {
      DX: 2,
      WD: 1,
      CO: -1,
    },
    abilities: [
      {
        id: 'gifted_linguist',
        name: 'Gifted Linguist',
        description: 'Learn languages twice as fast. Know 2 extra languages.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'low_light_vision',
        name: 'Low-Light Vision',
        description: 'See in dim light as if it were bright light.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'vanara',
    name: 'Vanara',
    description:
      'Monkey-like humanoids known for their agility and mischievous nature.',
    attributeModifiers: {
      DX: 2,
      WD: 1,
      IT: -1,
    },
    abilities: [
      {
        id: 'prehensile_tail',
        name: 'Prehensile Tail',
        description: 'Can use tail to retrieve small objects as bonus action.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'nimble',
        name: 'Nimble',
        description: 'Climb speed equal to land speed.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'vishkanya',
    name: 'Vishkanya',
    description:
      'Snake-like humanoids with natural poison resistance and venomous abilities.',
    attributeModifiers: {
      DX: 2,
      CH: 1,
      WD: -1,
    },
    abilities: [
      {
        id: 'poison_resistance',
        name: 'Poison Resistance',
        description:
          'Resistance to poison damage. Advantage on saves vs poison.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'toxic',
        name: 'Toxic',
        description: 'Unarmed strikes can inflict poison damage.',
        unlockLevel: 3,
        target: 'enemy',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'wayang',
    name: 'Wayang',
    description:
      'Shadowy humanoids from the Shadow Plane with affinity for darkness and illusion.',
    attributeModifiers: {
      DX: 2,
      IT: 1,
      WD: -1,
    },
    abilities: [
      {
        id: 'darkvision',
        name: 'Darkvision',
        description: 'See in darkness up to 60 feet.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'shadow_magic',
        name: 'Shadow Magic',
        description: 'Know one illusion or necromancy cantrip.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'lurker',
        name: 'Lurker',
        description: 'Advantage on Stealth checks in dim light.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  // Rare Races
  {
    id: 'android',
    name: 'Android',
    description:
      'Artificial humanoids created through advanced technology. Emotionally reserved but highly logical.',
    attributeModifiers: {
      IT: 2,
      DX: 1,
      CH: -1,
    },
    abilities: [
      {
        id: 'constructed',
        name: 'Constructed',
        description:
          "Immune to disease and poison. Don't need to eat or breathe.",
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'emotionally_unaware',
        name: 'Emotionally Unaware',
        description:
          'Disadvantage on Insight checks but advantage on saves vs emotion effects.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'automaton',
    name: 'Automaton',
    description:
      'Mechanical humanoids housing mortal souls. Blend of magic and technology.',
    attributeModifiers: {
      ST: 2,
      CO: 1,
      CH: -1,
    },
    abilities: [
      {
        id: 'constructed_body',
        name: 'Constructed Body',
        description: 'Immune to disease, poison, and exhaustion.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'armor_plating',
        name: 'Armor Plating',
        description: 'AC is 13 + DEX modifier when unarmored.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'conrasu',
    name: 'Conrasu',
    description:
      'Plant-like humanoids who are guardians of the natural order and cosmic balance.',
    attributeModifiers: {
      CO: 2,
      WD: 1,
      DX: -1,
    },
    abilities: [
      {
        id: 'sunlight_healing',
        name: 'Sunlight Healing',
        description: 'Regain 1 HP per hour in direct sunlight.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'plant_nourishment',
        name: 'Plant Nourishment',
        description: 'Can subsist on sunlight and water instead of food.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'fleshwarp',
    name: 'Fleshwarp',
    description:
      'Mutated humanoids twisted by dark magic or aberrant experiments.',
    attributeModifiers: {
      ST: 2,
      CO: 1,
      CH: -2,
    },
    abilities: [
      {
        id: 'unusual_anatomy',
        name: 'Unusual Anatomy',
        description: 'Resistance to one damage type (chosen at creation).',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'unnatural_resilience',
        name: 'Unnatural Resilience',
        description: 'Advantage on saves against disease and poison.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'gathlain',
    name: 'Gathlain',
    description:
      'Tree-like fey humanoids with butterfly wings. Guardians of forests and nature.',
    attributeModifiers: {
      DX: 2,
      CH: 1,
      ST: -2,
    },
    abilities: [
      {
        id: 'flight',
        name: 'Flight',
        description: 'Fly speed of 30ft when not wearing heavy armor.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'final_rest',
        name: 'Final Rest',
        description: 'When killed, body transforms into a tree sapling.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'ghoran',
    name: 'Ghoran',
    description:
      'Plant-based humanoids created by ancient druids. Photosynthetic and resilient.',
    attributeModifiers: {
      CO: 2,
      WD: 1,
      CH: -1,
    },
    abilities: [
      {
        id: 'photosynthesis',
        name: 'Photosynthesis',
        description:
          'Can subsist on sunlight and water. Regain 1 HP per hour in sunlight.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'delicious',
        name: 'Delicious',
        description: 'Disadvantage on saves vs being swallowed or eaten.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'leshy',
    name: 'Leshy',
    description:
      'Small plant spirits inhabiting plant bodies. Guardians of nature.',
    attributeModifiers: {
      WD: 2,
      CO: 1,
      ST: -2,
    },
    abilities: [
      {
        id: 'plant',
        name: 'Plant',
        description: 'Count as plant creature. Vulnerable to fire.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'seedpod',
        name: 'Seedpod',
        description:
          'Leave behind a seedpod when killed that can grow into new leshy.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'low_light_vision',
        name: 'Low-Light Vision',
        description: 'See in dim light as if it were bright light.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'samsaran',
    name: 'Samsaran',
    description: 'Reincarnated humanoids who retain memories from past lives.',
    attributeModifiers: {
      IT: 2,
      WD: 1,
      CO: -1,
    },
    abilities: [
      {
        id: 'past_life_knowledge',
        name: 'Past Life Knowledge',
        description: 'Proficiency in one additional skill of choice.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'lifebound',
        name: 'Lifebound',
        description: 'Advantage on death saving throws.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'strix',
    name: 'Strix',
    description:
      'Owl-like humanoids with dark wings. Nocturnal hunters and fierce warriors.',
    attributeModifiers: {
      DX: 2,
      ST: 1,
      CH: -2,
    },
    abilities: [
      {
        id: 'flight',
        name: 'Flight',
        description: 'Fly speed of 25ft.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'darkvision',
        name: 'Darkvision',
        description: 'See in darkness up to 60 feet.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'suspicious',
        name: 'Suspicious',
        description: 'Disadvantage on Charisma checks with non-strix.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
  {
    id: 'anadi',
    name: 'Anadi',
    description:
      'Spider-like humanoids who can shift between humanoid and spider forms.',
    attributeModifiers: {
      DX: 2,
      WD: 1,
      ST: -1,
    },
    abilities: [
      {
        id: 'change_shape',
        name: 'Change Shape',
        description: 'Transform between humanoid and spider form.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'web_weaver',
        name: 'Web Weaver',
        description: 'Can create webs. Climb speed equal to land speed.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'aasimar',
    name: 'Aasimar',
    description:
      'Angelic humanoids descended from celestial beings. Radiate divine light.',
    attributeModifiers: {
      CH: 2,
      WD: 1,
      CO: -1,
    },
    abilities: [
      {
        id: 'celestial_resistance',
        name: 'Celestial Resistance',
        description: 'Resistance to radiant and necrotic damage.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'healing_hands',
        name: 'Healing Hands',
        description: 'Touch to heal HP equal to your level once per long rest.',
        unlockLevel: 1,
        target: 'ally',
      },
      {
        id: 'light_bearer',
        name: 'Light Bearer',
        description: 'Know the Light cantrip.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'dhampir',
    name: 'Dhampir',
    description:
      'Vampire-descended humanoids. Living beings with vampiric traits.',
    attributeModifiers: {
      DX: 2,
      CH: 1,
      CO: -1,
    },
    abilities: [
      {
        id: 'darkvision',
        name: 'Darkvision',
        description: 'See in darkness up to 60 feet.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'vampiric_bite',
        name: 'Vampiric Bite',
        description: 'Bite attack that heals you for half damage dealt.',
        unlockLevel: 1,
        target: 'enemy',
      },
      {
        id: 'undead_resistance',
        name: 'Undead Resistance',
        description: 'Advantage on saves vs disease and necrotic damage.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'drow',
    name: 'Drow',
    description:
      'Dark elves from the Underdark. Masters of shadow magic and intrigue.',
    attributeModifiers: {
      DX: 2,
      CH: 1,
      CO: -1,
    },
    abilities: [
      {
        id: 'superior_darkvision',
        name: 'Superior Darkvision',
        description: 'See in darkness up to 120 feet.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'drow_magic',
        name: 'Drow Magic',
        description:
          'Know Dancing Lights cantrip. Cast Faerie Fire and Darkness.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'sunlight_sensitivity',
        name: 'Sunlight Sensitivity',
        description:
          'Disadvantage on attacks and perception in direct sunlight.',
        unlockLevel: 1,
        target: 'self',
      },
    ],
    movementRate: 30,
    isNpcOnly: true,
  },
  {
    id: 'duergar',
    name: 'Duergar',
    description:
      'Gray dwarves from the Underdark. Psionically gifted and resistant to magic.',
    attributeModifiers: {
      ST: 2,
      CO: 1,
      CH: -2,
    },
    abilities: [
      {
        id: 'superior_darkvision',
        name: 'Superior Darkvision',
        description: 'See in darkness up to 120 feet.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'duergar_resilience',
        name: 'Duergar Resilience',
        description: 'Advantage on saves vs illusions, charm, and paralysis.',
        unlockLevel: 1,
        target: 'self',
      },
      {
        id: 'enlarge',
        name: 'Enlarge',
        description:
          'Grow to Large size, increasing strength once per long rest.',
        unlockLevel: 3,
        target: 'self',
      },
    ],
    movementRate: 25,
    isNpcOnly: true,
  },
];
