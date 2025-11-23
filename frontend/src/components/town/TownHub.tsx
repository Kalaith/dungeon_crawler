import React, { useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useGameStateStore } from '../../stores/useGameStateStore';
import { Button } from '../ui/Button';
import { InnService } from './InnService';
import { TavernService } from './TavernService';
import { TempleService } from './TempleService';

type ServiceId = 'inn' | 'tavern' | 'shop' | 'temple' | 'healer' | 'blacksmith' | null;

export const TownHub: React.FC = () => {
    const { getCurrentLocation } = useWorldStore();
    const { setGameState } = useGameStateStore();
    const [activeService, setActiveService] = useState<ServiceId>(null);

    const currentLocation = getCurrentLocation();

    if (!currentLocation || currentLocation.type !== 'town' || !currentLocation.townData) {
        return null;
    }

    const { townData } = currentLocation;

    // If a service is active, show that service's component
    if (activeService === 'inn') {
        return <InnService onClose={() => setActiveService(null)} />;
    }
    if (activeService === 'tavern') {
        return <TavernService onClose={() => setActiveService(null)} />;
    }
    if (activeService === 'temple') {
        return <TempleService onClose={() => setActiveService(null)} />;
    }

    const handleLeaveToOverworld = () => {
        setGameState('overworld');
    };

    const handleServiceClick = (serviceId: ServiceId) => {
        setActiveService(serviceId);
    };

    const services = [
        { id: 'inn' as ServiceId, name: 'Inn', icon: '🏨', available: true, description: 'Rest and recover' },
        { id: 'tavern' as ServiceId, name: 'Tavern', icon: '🍺', available: true, description: 'Recruit adventurers' },
        { id: 'shop' as ServiceId, name: 'Shop', icon: '🛒', available: townData.hasShop, description: 'Buy and sell items' },
        { id: 'temple' as ServiceId, name: 'Temple', icon: '⛪', available: true, description: 'Blessings and resurrection' },
        { id: 'healer' as ServiceId, name: 'Healer', icon: '⚕️', available: townData.hasHealer, description: 'Cure wounds and diseases' },
        { id: 'blacksmith' as ServiceId, name: 'Blacksmith', icon: '⚒️', available: townData.hasBlacksmith, description: 'Repair and upgrade equipment' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-400/8 to-orange-400/8 dark:from-amber-400/15 dark:to-orange-400/15 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-200 mb-2">
                        Welcome to {currentLocation.name}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400 capitalize">
                        {townData.size} • Population: {townData.population}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-gray-500 mt-2">
                        {currentLocation.description}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl p-8 shadow-lg border border-gray-400/20 mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-gray-200 mb-6 text-center">
                        Town Services
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                disabled={!service.available}
                                onClick={() => service.available && handleServiceClick(service.id)}
                                className={`p-6 rounded-lg border-2 transition-all ${service.available
                                        ? 'bg-white dark:bg-charcoal-700 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:shadow-lg cursor-pointer'
                                        : 'bg-gray-100 dark:bg-charcoal-900 border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="text-5xl mb-3 text-center">{service.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-gray-200 text-center mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-gray-400 text-center">
                                    {service.description}
                                </p>
                                {!service.available && (
                                    <p className="text-xs text-red-500 dark:text-red-400 text-center mt-2">
                                        Not available in this town
                                    </p>
                                )}
                                {service.available && service.id !== 'inn' && service.id !== 'tavern' && service.id !== 'temple' && (
                                    <p className="text-xs text-blue-500 dark:text-blue-400 text-center mt-2">
                                        Coming Soon
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                            💡 <strong>Tip:</strong> Visit the Inn to rest, the Tavern to recruit, or the Temple to resurrect fallen heroes!
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleLeaveToOverworld}
                    >
                        ← Leave Town
                    </Button>
                </div>

                {/* Town Info Panel */}
                <div className="mt-6 bg-cream-100 dark:bg-charcoal-800 rounded-xl p-6 shadow-lg border border-gray-400/20">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-200 mb-3">
                        About {currentLocation.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-slate-600 dark:text-gray-400">Type</p>
                            <p className="font-semibold text-slate-900 dark:text-gray-200 capitalize">
                                {townData.size}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-gray-400">Population</p>
                            <p className="font-semibold text-slate-900 dark:text-gray-200">
                                {townData.population}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-gray-400">Services</p>
                            <p className="font-semibold text-slate-900 dark:text-gray-200">
                                {townData.services.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-gray-400">Safety</p>
                            <p className="font-semibold text-green-600 dark:text-green-400">
                                Safe Haven
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
