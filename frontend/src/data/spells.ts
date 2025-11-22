export interface Spell {
    id: string;
    name: string;
    level: number; // 0 = Cantrip, 1-9 = Spell levels
    school: string;
    castingTime: string;
    range: string;
    components: {
        verbal: boolean;
        somatic: boolean;
        material: boolean;
        materialDescription?: string;
    };
    duration: string;
    concentration: boolean;
    description: string;
    damageType?: string;
    savingThrow?: 'ST' | 'CO' | 'DX' | 'AG' | 'IT' | 'IN' | 'WD' | 'CH';
    attackRoll?: boolean;
    apCost: number;
}

// AP Cost by spell level
export const AP_COSTS: Record<number, number> = {
    0: 0,   // Cantrips
    1: 5,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 25,
    7: 30,
    8: 35,
    9: 40
};

export const spells: Spell[] = [
    // Cantrips (Level 0)
    {
        id: 'fire_bolt',
        name: 'Fire Bolt',
        level: 0,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true, material: false },
        duration: 'Instantaneous',
        concentration: false,
        description: 'You hurl a mote of fire at a creature or object within range. Make a ranged spell attack. On a hit, the target takes 1d10 fire damage.',
        damageType: 'fire',
        attackRoll: true,
        apCost: 0
    },
    {
        id: 'mage_hand',
        name: 'Mage Hand',
        level: 0,
        school: 'Conjuration',
        castingTime: '1 action',
        range: '30 feet',
        components: { verbal: true, somatic: true, material: false },
        duration: '1 minute',
        concentration: false,
        description: 'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it.',
        apCost: 0
    },
    {
        id: 'sacred_flame',
        name: 'Sacred Flame',
        level: 0,
        school: 'Evocation',
        castingTime: '1 action',
        range: '60 feet',
        components: { verbal: true, somatic: true, material: false },
        duration: 'Instantaneous',
        concentration: false,
        description: 'Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage.',
        damageType: 'radiant',
        savingThrow: 'DX',
        apCost: 0
    },
    {
        id: 'eldritch_blast',
        name: 'Eldritch Blast',
        level: 0,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true, material: false },
        duration: 'Instantaneous',
        concentration: false,
        description: 'A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack. On a hit, the target takes 1d10 force damage.',
        damageType: 'force',
        attackRoll: true,
        apCost: 0
    },

    // Level 1 Spells
    {
        id: 'magic_missile',
        name: 'Magic Missile',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true, material: false },
        duration: 'Instantaneous',
        concentration: false,
        description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target.',
        damageType: 'force',
        apCost: 5
    },
    {
        id: 'cure_wounds',
        name: 'Cure Wounds',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: 'Touch',
        components: { verbal: true, somatic: true, material: false },
        duration: 'Instantaneous',
        concentration: false,
        description: 'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.',
        apCost: 5
    },
    {
        id: 'shield',
        name: 'Shield',
        level: 1,
        school: 'Abjuration',
        castingTime: '1 reaction',
        range: 'Self',
        components: { verbal: true, somatic: true, material: false },
        duration: '1 round',
        concentration: false,
        description: 'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC.',
        apCost: 5
    },
    {
        id: 'burning_hands',
        name: 'Burning Hands',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: 'Self (15-foot cone)',
        components: { verbal: true, somatic: true, material: false },
        duration: 'Instantaneous',
        concentration: false,
        description: 'A thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much on a successful one.',
        damageType: 'fire',
        savingThrow: 'DX',
        apCost: 5
    },
    {
        id: 'bless',
        name: 'Bless',
        level: 1,
        school: 'Enchantment',
        castingTime: '1 action',
        range: '30 feet',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a sprinkling of holy water' },
        duration: '1 minute',
        concentration: true,
        description: 'You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.',
        apCost: 5
    },

    // Level 2 Spells
    {
        id: 'scorching_ray',
        name: 'Scorching Ray',
        level: 2,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: { verbal: true, somatic: true, material: false },
        duration: 'Instantaneous',
        concentration: false,
        description: 'You create three rays of fire and hurl them at targets within range. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.',
        damageType: 'fire',
        attackRoll: true,
        apCost: 8
    },
    {
        id: 'hold_person',
        name: 'Hold Person',
        level: 2,
        school: 'Enchantment',
        castingTime: '1 action',
        range: '60 feet',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a small, straight piece of iron' },
        duration: '1 minute',
        concentration: true,
        description: 'Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration.',
        savingThrow: 'WD',
        apCost: 8
    },
    {
        id: 'spiritual_weapon',
        name: 'Spiritual Weapon',
        level: 2,
        school: 'Evocation',
        castingTime: '1 bonus action',
        range: '60 feet',
        components: { verbal: true, somatic: true, material: false },
        duration: '1 minute',
        concentration: false,
        description: 'You create a floating, spectral weapon within range that lasts for the duration. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.',
        damageType: 'force',
        attackRoll: true,
        apCost: 8
    },

    // Level 3 Spells
    {
        id: 'fireball',
        name: 'Fireball',
        level: 3,
        school: 'Evocation',
        castingTime: '1 action',
        range: '150 feet',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a tiny ball of bat guano and sulfur' },
        duration: 'Instantaneous',
        concentration: false,
        description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much on a successful one.',
        damageType: 'fire',
        savingThrow: 'DX',
        apCost: 12
    },
    {
        id: 'lightning_bolt',
        name: 'Lightning Bolt',
        level: 3,
        school: 'Evocation',
        castingTime: '1 action',
        range: 'Self (100-foot line)',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a bit of fur and a rod of amber, crystal, or glass' },
        duration: 'Instantaneous',
        concentration: false,
        description: 'A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much on a successful one.',
        damageType: 'lightning',
        savingThrow: 'DX',
        apCost: 12
    },
    {
        id: 'revivify',
        name: 'Revivify',
        level: 3,
        school: 'Necromancy',
        castingTime: '1 action',
        range: 'Touch',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'diamonds worth 300 gp' },
        duration: 'Instantaneous',
        concentration: false,
        description: 'You touch a creature that has died within the last minute. That creature returns to life with 1 hit point.',
        apCost: 12
    },

    // Level 4 Spells
    {
        id: 'greater_invisibility',
        name: 'Greater Invisibility',
        level: 4,
        school: 'Illusion',
        castingTime: '1 action',
        range: 'Touch',
        components: { verbal: true, somatic: true, material: false },
        duration: '1 minute',
        concentration: true,
        description: 'You or a creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target\'s person.',
        apCost: 16
    },
    {
        id: 'ice_storm',
        name: 'Ice Storm',
        level: 4,
        school: 'Evocation',
        castingTime: '1 action',
        range: '300 feet',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a pinch of dust and a few drops of water' },
        duration: 'Instantaneous',
        concentration: false,
        description: 'A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much on a successful one.',
        damageType: 'cold',
        savingThrow: 'DX',
        apCost: 16
    },

    // Level 5 Spells
    {
        id: 'cone_of_cold',
        name: 'Cone of Cold',
        level: 5,
        school: 'Evocation',
        castingTime: '1 action',
        range: 'Self (60-foot cone)',
        components: { verbal: true, somatic: true, material: true, materialDescription: 'a small crystal or glass cone' },
        duration: 'Instantaneous',
        concentration: false,
        description: 'A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much on a successful one.',
        damageType: 'cold',
        savingThrow: 'CO',
        apCost: 20
    },
    {
        id: 'mass_cure_wounds',
        name: 'Mass Cure Wounds',
        level: 5,
        school: 'Evocation',
        castingTime: '1 action',
        range: '60 feet',
        components: { verbal: true, somatic: true, material: false },
        duration: 'Instantaneous',
        concentration: false,
        description: 'A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier.',
        apCost: 20
    }
];

/**
 * Get spells by level
 */
export function getSpellsByLevel(level: number): Spell[] {
    return spells.filter(spell => spell.level === level);
}

/**
 * Get spells available to a character based on their class
 */
export function getAvailableSpells(className: string, characterLevel: number): Spell[] {
    // This is a simplified version - in a full implementation, 
    // you'd filter by class spell lists
    const maxSpellLevel = Math.min(Math.ceil(characterLevel / 2), 9);
    return spells.filter(spell => spell.level <= maxSpellLevel);
}

/**
 * Get spells a character can currently cast (has enough AP)
 */
export function getCastableSpells(availableSpells: Spell[], currentAP: number): Spell[] {
    return availableSpells.filter(spell => spell.apCost <= currentAP);
}
