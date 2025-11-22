import React from 'react';
import type { Character } from '../../types';
import { StatBar } from '../ui/StatBar';

interface CharacterCardProps {
    character: Character;
    variant?: 'compact' | 'detailed';
    onClick?: () => void;
    showBars?: boolean;
    showStats?: boolean;
    showAbilityCount?: boolean;
    className?: string;
}

/**
 * Unified character display component.
 * Consolidates character display logic from PartyStatus and CharacterSlot.
 * 
 * @param variant - 'compact' for slot view, 'detailed' for party status
 * @param showBars - Whether to show HP/AP progress bars
 * @param showStats - Whether to show detailed stats (level, gold, exp)
 * @param showAbilityCount - Whether to show ability count
 */
export const CharacterCard: React.FC<CharacterCardProps> = ({
    character,
    variant = 'detailed',
    onClick,
    showBars = true,
    showStats = true,
    showAbilityCount = false,
    className = ''
}) => {
    const isAlive = character.alive && character.derivedStats.HP.current > 0;

    const baseClasses = variant === 'compact'
        ? 'bg-green-400/8 dark:bg-green-400/15 border-2 border-gray-400/20 rounded-lg p-4 min-h-[200px] flex items-center justify-center text-center'
        : 'bg-purple-400/8 dark:bg-purple-400/15 border border-gray-400/20 rounded-lg p-3';

    const interactiveClasses = onClick
        ? 'transition-all hover:border-teal-500 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer'
        : '';

    const aliveClasses = !isAlive ? 'opacity-50' : '';

    return (
        <div
            className={`${baseClasses} ${interactiveClasses} ${aliveClasses} ${className}`}
            onClick={onClick}
        >
            <div className={variant === 'compact' ? 'w-full' : ''}>
                {/* Header: Name and Class */}
                <div className={variant === 'compact' ? 'mb-3' : 'flex justify-between items-center mb-2'}>
                    <div className={`font-semibold text-slate-900 dark:text-gray-200 ${variant === 'compact' ? 'text-lg mb-2' : 'text-sm'}`}>
                        {character.name}
                    </div>
                    <div className={`text-xs text-slate-500 dark:text-gray-300 ${variant === 'compact' ? 'mb-3' : ''}`}>
                        {variant === 'compact'
                            ? `${character.race.name} ${character.class.name}`
                            : character.class.name
                        }
                    </div>
                </div>

                {/* HP/AP Bars (detailed variant only) */}
                {showBars && variant === 'detailed' && (
                    <>
                        <StatBar
                            current={character.derivedStats.HP.current}
                            max={character.derivedStats.HP.max}
                            color="health"
                            height="sm"
                            className="mb-1"
                        />
                        <StatBar
                            current={character.derivedStats.AP.current}
                            max={character.derivedStats.AP.max}
                            color="mana"
                            height="sm"
                            className="mb-2"
                        />
                    </>
                )}

                {/* Stats Display */}
                <div className={`space-y-1 text-xs ${variant === 'compact' ? 'leading-relaxed' : ''} text-slate-600 dark:text-gray-400`}>
                    {/* HP/AP Values */}
                    <div className={variant === 'compact' ? '' : 'flex justify-between'}>
                        <span>HP: {character.derivedStats.HP.current}/{character.derivedStats.HP.max}</span>
                        {variant === 'detailed' && <span>AP: {character.derivedStats.AP.current}/{character.derivedStats.AP.max}</span>}
                    </div>

                    {variant === 'compact' && (
                        <>
                            <div>AP: {character.derivedStats.AP.current}/{character.derivedStats.AP.max}</div>
                            <div>
                                ST: {character.attributes.ST} CO: {character.attributes.CO}
                            </div>
                            <div>
                                IT: {character.attributes.IT} WD: {character.attributes.WD}
                            </div>
                        </>
                    )}

                    {/* Additional Stats (detailed variant only) */}
                    {showStats && variant === 'detailed' && (
                        <>
                            <div className="flex justify-between">
                                <span>Level: {character.level}</span>
                                <span>Gold: {character.gold}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>EXP: {character.exp}</span>
                                <span>Next: {character.expToNext}</span>
                            </div>
                        </>
                    )}

                    {/* Ability Count */}
                    {showAbilityCount && character.class.abilities.length > 0 && (
                        <div className="text-center pt-1 border-t border-gray-400/20">
                            <span className="text-xs text-slate-500 dark:text-gray-300">
                                {character.class.abilities.length} abilities
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
