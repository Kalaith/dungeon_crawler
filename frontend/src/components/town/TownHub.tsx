import React, { useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useGameStateStore } from '../../stores/useGameStateStore';
import { Button } from '../ui/Button';
import { InnService } from './InnService';
import { TavernService } from './TavernService';
import { TempleService } from './TempleService';
import { HealerService } from './HealerService';
import { ShopService } from './ShopService';
import { BlacksmithService } from './BlacksmithService';

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
    if (activeService === 'healer') {
        return <HealerService onClose={() => setActiveService(null)} />;
    }
    if (activeService === 'shop') {
        return <ShopService onClose={() => setActiveService(null)} />;
    }
    if (activeService === 'blacksmith') {
        return <BlacksmithService onClose={() => setActiveService(null)} />;
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
        { id: 'shop' as ServiceId, name: 'Shop', icon: '🛒', available: true, description: 'Buy and sell items' },
        { id: 'temple' as ServiceId, name: 'Temple', icon: '⛪', available: true, description: 'Blessings and resurrection' },
        { id: 'healer' as ServiceId, name: 'Healer', icon: '⚕️', available: true, description: 'Cure wounds and diseases' },
        { id: 'blacksmith' as ServiceId, name: 'Blacksmith', icon: '⚒️', available: true, description: 'Repair and upgrade equipment' },
    ];

    return (
        <div className="h-full w-full overflow-y-auto bg-etrian-900 p-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gold-500 mb-2">
                        Welcome to {currentLocation.name}
                    </h1>
                    <p className="text-lg text-cyan-100 capitalize">
                        {townData.size} • Population: {townData.population}
                    </p>
                    <p className="text-sm text-cyan-400 mt-2">
                        {currentLocation.description}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50 mb-6">
                    <h2 className="text-2xl font-semibold text-gold-500 mb-6 text-center">
                        Town Services
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                disabled={!service.available}
                                onClick={() => service.available && handleServiceClick(service.id)}
                                className={`p-4 rounded-lg border-2 transition-all ${service.available
                                    ? 'bg-etrian-700 border-cyan-900 hover:border-cyan-400 hover:bg-etrian-600 cursor-pointer'
                                    : 'bg-etrian-900 border-etrian-800 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="text-5xl mb-3 text-center">{service.icon}</div>
                                <h3 className="text-xl font-bold text-gold-500 mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-sm text-cyan-100 text-center">
                                    {service.description}
                                </p>
                                {!service.available && (
                                    <p className="text-xs text-red-500 text-center mt-2">
                                        Not available in this town
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-etrian-700/50 rounded-lg border border-cyan-900/30">
                        <p className="text-sm text-cyan-400 text-center">
                            💡 <strong>Tip:</strong> All 6 town services are now available!
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
                <div className="mt-6 bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50">
                    <h3 className="text-lg font-semibold text-gold-500 mb-3">
                        About {currentLocation.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-cyan-400">Type</p>
                            <p className="font-semibold text-cyan-100 capitalize">
                                {townData.size}
                            </p>
                        </div>
                        <div>
                            <p className="text-cyan-400">Population</p>
                            <p className="font-semibold text-cyan-100">
                                {townData.population}
                            </p>
                        </div>
                        <div>
                            <p className="text-cyan-400">Services</p>
                            <p className="font-semibold text-cyan-100">
                                {townData.services.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-cyan-400">Safety</p>
                            <p className="font-semibold text-green-500">
                                Safe Haven
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
