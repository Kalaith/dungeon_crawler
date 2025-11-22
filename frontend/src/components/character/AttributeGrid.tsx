import React from 'react';
import type { Attribute } from '../../types';

interface AttributeGridProps {
    attributes: Record<Attribute, number>;
    editable?: boolean;
    onAttributeChange?: (attr: Attribute, value: number) => void;
    racialModifiers?: Partial<Record<Attribute, number>>;
    showModifiers?: boolean;
    minValue?: number;
    maxValue?: number;
    className?: string;
}

/**
 * Reusable attribute grid component for displaying and editing character attributes.
 * Supports both read-only display and editable point-buy mode.
 * Replaces duplicated implementations in CharacterCreationWizard and CharacterSheet.
 */
export const AttributeGrid: React.FC<AttributeGridProps> = ({
    attributes,
    editable = false,
    onAttributeChange,
    racialModifiers,
    showModifiers = false,
    minValue = 8,
    maxValue = 18,
    className = ''
}) => {
    const attributeList: Attribute[] = ['ST', 'CO', 'DX', 'AG', 'IT', 'IN', 'WD', 'CH'];

    const handleIncrement = (attr: Attribute) => {
        if (editable && onAttributeChange && attributes[attr] < maxValue) {
            onAttributeChange(attr, attributes[attr] + 1);
        }
    };

    const handleDecrement = (attr: Attribute) => {
        if (editable && onAttributeChange && attributes[attr] > minValue) {
            onAttributeChange(attr, attributes[attr] - 1);
        }
    };

    return (
        <div className={`grid grid-cols-2 gap-4 ${className}`}>
            {attributeList.map((attr) => {
                const baseValue = attributes[attr];
                const modifier = racialModifiers?.[attr] || 0;
                const finalValue = baseValue + modifier;

                return (
                    <div
                        key={attr}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                        <span className="font-bold w-8 text-gray-900 dark:text-white">{attr}</span>

                        <div className="flex items-center space-x-2">
                            {editable && (
                                <button
                                    onClick={() => handleDecrement(attr)}
                                    className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={baseValue <= minValue}
                                    aria-label={`Decrease ${attr}`}
                                >
                                    -
                                </button>
                            )}

                            <span className="w-8 text-center font-mono text-lg text-gray-900 dark:text-white">
                                {showModifiers && modifier !== 0 ? finalValue : baseValue}
                            </span>

                            {editable && (
                                <button
                                    onClick={() => handleIncrement(attr)}
                                    className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={baseValue >= maxValue}
                                    aria-label={`Increase ${attr}`}
                                >
                                    +
                                </button>
                            )}
                        </div>

                        {/* Show racial modifier if any */}
                        {showModifiers && modifier !== 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                                ({modifier > 0 ? '+' : ''}{modifier})
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
