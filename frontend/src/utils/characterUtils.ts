import type { Character, Item } from '../types';

/**
 * Calculates the effective stats of a character by combining base stats with equipment bonuses.
 * @param character The character to calculate stats for
 * @returns An object containing the effective stats (str, def, agi, luc, maxHp, maxMp)
 */
export const calculateEffectiveStats = (character: Character) => {
    const stats = {
        str: character.str,
        def: character.def,
        agi: character.agi,
        luc: character.luc,
        maxHp: character.maxHp,
        maxMp: character.maxMp
    };

    const processItem = (item?: Item) => {
        if (!item || !item.stats) return;

        if (item.stats.str) stats.str += item.stats.str;
        if (item.stats.def) stats.def += item.stats.def;
        if (item.stats.agi) stats.agi += item.stats.agi;
        if (item.stats.luc) stats.luc += item.stats.luc;
        if (item.stats.hp) stats.maxHp += item.stats.hp;
        if (item.stats.mp) stats.maxMp += item.stats.mp;
    };

    processItem(character.equipment.weapon);
    processItem(character.equipment.armor);
    processItem(character.equipment.accessory);

    return stats;
};
