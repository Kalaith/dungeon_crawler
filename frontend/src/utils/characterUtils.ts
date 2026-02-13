import type { Character, Item } from '../types';

/**
 * Calculates the effective stats of a character by combining base stats with equipment bonuses.
 * @param character The character to calculate stats for
 * @returns An object containing the effective stats (str, def, agi, luc, maxHp, maxMp)
 */
export const calculateEffectiveStats = (character: Character) => {
  const effectiveAttributes = { ...character.attributes };
  const effectiveDerived = {
    ...character.derivedStats,
    HP: { ...character.derivedStats.HP },
    AP: { ...character.derivedStats.AP },
  };

  const processItem = (item?: Item) => {
    if (!item || !item.stats) return;

    // Apply attribute bonuses
    if (item.stats.ST) effectiveAttributes.ST += item.stats.ST;
    if (item.stats.CO) effectiveAttributes.CO += item.stats.CO;
    if (item.stats.DX) effectiveAttributes.DX += item.stats.DX;
    if (item.stats.AG) effectiveAttributes.AG += item.stats.AG;
    if (item.stats.IT) effectiveAttributes.IT += item.stats.IT;
    if (item.stats.IN) effectiveAttributes.IN += item.stats.IN;
    if (item.stats.WD) effectiveAttributes.WD += item.stats.WD;
    if (item.stats.CH) effectiveAttributes.CH += item.stats.CH;

    // Apply derived stat bonuses
    if (item.stats.AC) effectiveDerived.AC += item.stats.AC;
    if (item.stats.HP) effectiveDerived.HP.max += item.stats.HP;
    if (item.stats.AP) effectiveDerived.AP.max += item.stats.AP;
  };

  processItem(character.equipment.mainHand);
  processItem(character.equipment.offHand);
  processItem(character.equipment.armor);
  processItem(character.equipment.head);
  processItem(character.equipment.accessory1);
  processItem(character.equipment.accessory2);

  return {
    attributes: effectiveAttributes,
    derivedStats: effectiveDerived,
    // Legacy mappings for compatibility if needed, but we should update consumers
    str: effectiveAttributes.ST,
    def: effectiveDerived.AC,
    agi: effectiveAttributes.AG,
    maxHp: effectiveDerived.HP.max,
    maxMp: effectiveDerived.AP.max,
  };
};
