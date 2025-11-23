import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useGoldStore } from '../../stores/useGoldStore';
import { useInventoryStore } from '../../stores/useInventoryStore';
import type { Item } from '../../types';

interface ShopServiceProps {
    onClose: () => void;
}

type ShopCategory = 'weapons' | 'armor' | 'potions' | 'items';

interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ShopCategory;
    icon: string;
}

const SHOP_INVENTORY: ShopItem[] = [
    // Weapons
    { id: 'sword_iron', name: 'Iron Sword', description: '+2 damage', price: 50, category: 'weapons', icon: '⚔️' },
    { id: 'sword_steel', name: 'Steel Sword', description: '+4 damage', price: 150, category: 'weapons', icon: '🗡️' },
    { id: 'bow_short', name: 'Short Bow', description: '+3 ranged damage', price: 75, category: 'weapons', icon: '🏹' },
    { id: 'staff_oak', name: 'Oak Staff', description: '+2 magic damage', price: 60, category: 'weapons', icon: '🪄' },

    // Armor
    { id: 'armor_leather', name: 'Leather Armor', description: '+2 AC', price: 40, category: 'armor', icon: '🛡️' },
    { id: 'armor_chain', name: 'Chain Mail', description: '+4 AC', price: 120, category: 'armor', icon: '🦺' },
    { id: 'shield_wood', name: 'Wooden Shield', description: '+1 AC', price: 30, category: 'armor', icon: '🛡️' },
    { id: 'helmet_iron', name: 'Iron Helmet', description: '+1 AC', price: 35, category: 'armor', icon: '⛑️' },

    // Potions
    { id: 'potion_health_small', name: 'Small Health Potion', description: 'Restore 25 HP', price: 20, category: 'potions', icon: '🧪' },
    { id: 'potion_health_medium', name: 'Medium Health Potion', description: 'Restore 50 HP', price: 40, category: 'potions', icon: '🧪' },
    { id: 'potion_mana_small', name: 'Small Mana Potion', description: 'Restore 15 AP', price: 25, category: 'potions', icon: '🔮' },
    { id: 'potion_antidote', name: 'Antidote', description: 'Cure poison', price: 15, category: 'potions', icon: '💊' },

    // Items
    { id: 'rope', name: 'Rope (50ft)', description: 'Useful for climbing', price: 10, category: 'items', icon: '🪢' },
    { id: 'torch', name: 'Torch', description: 'Light source', price: 5, category: 'items', icon: '🔦' },
    { id: 'rations', name: 'Rations (5 days)', description: 'Food supplies', price: 15, category: 'items', icon: '🍖' },
    { id: 'lockpick', name: 'Lockpick Set', description: 'Open locked doors', price: 25, category: 'items', icon: '🔓' },
];

export const ShopService: React.FC<ShopServiceProps> = ({ onClose }) => {
    const { gold, subtractGold, canAfford } = useGoldStore();
    const { addItem } = useInventoryStore();
    const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('weapons');
    const [cart, setCart] = useState<Map<string, number>>(new Map());

    const filteredItems = SHOP_INVENTORY.filter(item => item.category === selectedCategory);

    const addToCart = (itemId: string) => {
        setCart(prev => {
            const newCart = new Map(prev);
            newCart.set(itemId, (newCart.get(itemId) || 0) + 1);
            return newCart;
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => {
            const newCart = new Map(prev);
            const currentQty = newCart.get(itemId) || 0;
            if (currentQty > 1) {
                newCart.set(itemId, currentQty - 1);
            } else {
                newCart.delete(itemId);
            }
            return newCart;
        });
    };

    const getTotalCost = (): number => {
        let total = 0;
        cart.forEach((quantity, itemId) => {
            const item = SHOP_INVENTORY.find(i => i.id === itemId);
            if (item) {
                total += item.price * quantity;
            }
        });
        return total;
    };

    const handlePurchase = () => {
        const total = getTotalCost();

        if (!canAfford(total)) {
            alert(`Insufficient funds! You need ${total} gold but only have ${gold} gold.`);
            return;
        }

        // Deduct gold
        const success = subtractGold(total);
        if (!success) {
            alert('Transaction failed!');
            return;
        }

        // Add items to inventory
        cart.forEach((quantity, itemId) => {
            const shopItem = SHOP_INVENTORY.find(i => i.id === itemId);
            if (shopItem) {
                const item: Item = {
                    id: shopItem.id,
                    name: shopItem.name,
                    type: shopItem.category === 'potions' ? 'consumable' :
                        shopItem.category === 'weapons' ? 'weapon' :
                            shopItem.category === 'armor' ? 'armor' : 'material',
                    category: shopItem.category,
                    rarity: 'common',
                    value: shopItem.price,
                    description: shopItem.description,
                    stackable: shopItem.category === 'potions' || shopItem.category === 'items',
                    icon: shopItem.icon,
                };
                addItem(item, quantity);
            }
        });

        alert(`Purchase complete! Spent ${total} gold.\nRemaining gold: ${gold - total}`);
        setCart(new Map());
    };

    const categories: { id: ShopCategory; name: string; icon: string }[] = [
        { id: 'weapons', name: 'Weapons', icon: '⚔️' },
        { id: 'armor', name: 'Armor', icon: '🛡️' },
        { id: 'potions', name: 'Potions', icon: '🧪' },
        { id: 'items', name: 'Items', icon: '🎒' },
    ];

    return (
        <div className="h-full w-full overflow-y-auto bg-etrian-900 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🛒</div>
                    <h1 className="text-4xl font-bold text-gold-500 mb-2">
                        General Store
                    </h1>
                    <p className="text-lg text-cyan-100">
                        Buy equipment, potions, and supplies for your adventures
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Shop Area */}
                    <div className="lg:col-span-2">
                        {/* Category Tabs */}
                        <div className="bg-etrian-800 rounded-xl p-4 shadow-lg border border-cyan-900/50 mb-6">
                            <div className="flex gap-2 flex-wrap">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === category.id
                                            ? 'bg-cyan-700 text-white shadow-lg border border-cyan-400'
                                            : 'bg-etrian-900 text-cyan-400 hover:bg-etrian-700 border border-cyan-900/30'
                                            }`}
                                    >
                                        {category.icon} {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Items Grid */}
                        <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50">
                            <h2 className="text-xl font-semibold text-gold-500 mb-4 capitalize">
                                {selectedCategory}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-etrian-700 rounded-lg p-4 border border-cyan-900/30 hover:border-cyan-500/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{item.icon}</span>
                                                <div>
                                                    <h3 className="font-bold text-cyan-100">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-cyan-400">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <p className="text-lg font-bold text-gold-500">
                                                {item.price} 💰
                                            </p>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => addToCart(item.id)}
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Shopping Cart */}
                    <div className="lg:col-span-1">
                        <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50 sticky top-8">
                            <h2 className="text-xl font-semibold text-gold-500 mb-4">
                                🛒 Shopping Cart
                            </h2>

                            {/* Gold Display */}
                            <div className="mb-4 p-3 bg-etrian-900 border border-gold-500/30 rounded-lg">
                                <p className="text-sm font-semibold text-gold-500">
                                    💰 Your Gold: {gold}
                                </p>
                            </div>

                            {cart.size === 0 ? (
                                <p className="text-center text-cyan-400 py-8">
                                    Your cart is empty
                                </p>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                        {Array.from(cart.entries()).map(([itemId, quantity]) => {
                                            const item = SHOP_INVENTORY.find(i => i.id === itemId);
                                            if (!item) return null;

                                            return (
                                                <div
                                                    key={itemId}
                                                    className="bg-etrian-700 rounded-lg p-3 border border-cyan-900/30"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{item.icon}</span>
                                                            <div>
                                                                <p className="font-semibold text-sm text-cyan-100">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-xs text-cyan-400">
                                                                    {item.price} 💰 each
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => removeFromCart(itemId)}
                                                                className="w-6 h-6 rounded bg-red-900/50 border border-red-500/50 text-red-200 hover:bg-red-800 flex items-center justify-center text-sm font-bold"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="text-sm font-semibold text-cyan-100 w-8 text-center">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => addToCart(itemId)}
                                                                className="w-6 h-6 rounded bg-green-900/50 border border-green-500/50 text-green-200 hover:bg-green-800 flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <p className="text-sm font-bold text-gold-500">
                                                            {item.price * quantity} 💰
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-cyan-900/30 pt-4 mb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-lg font-bold text-cyan-100">
                                                Total:
                                            </p>
                                            <p className="text-2xl font-bold text-gold-500">
                                                {getTotalCost()} 💰
                                            </p>
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={handlePurchase}
                                            disabled={!canAfford(getTotalCost())}
                                            className="w-full"
                                        >
                                            {canAfford(getTotalCost()) ? 'Purchase' : 'Insufficient Funds'}
                                        </Button>
                                    </div>
                                </>
                            )}

                            {!canAfford(getTotalCost()) && cart.size > 0 && (
                                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                                    <p className="text-xs text-red-400">
                                        ⚠️ <strong>Insufficient Funds!</strong> You need {getTotalCost() - gold} more gold.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mt-6">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onClose}
                    >
                        ← Back to Town
                    </Button>
                </div>
            </div>
        </div>
    );
};
