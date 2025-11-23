import React, { useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useGameStateStore } from '../../stores/useGameStateStore';
import type { WorldLocation } from '../../types/world';
import { Button } from '../ui/Button';
import { DungeonEntrance } from '../dungeon/DungeonEntrance';

export const OverworldMap: React.FC = () => {
    const {
        worldMap,
        currentLocationId,
        getCurrentLocation,
        getConnectedLocations,
        isLocationDiscovered,
        setCurrentLocation,
        startTravel
    } = useWorldStore();

    const { setGameState } = useGameStateStore();
    const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
    const [showingDungeonEntrance, setShowingDungeonEntrance] = useState(false);

    const currentLocation = getCurrentLocation();
    const connectedLocations = currentLocationId ? getConnectedLocations(currentLocationId) : [];

    // If showing dungeon entrance, render that instead
    if (showingDungeonEntrance && currentLocation?.type === 'dungeon') {
        return <DungeonEntrance />;
    }

    const handleLocationClick = (location: WorldLocation) => {
        if (!isLocationDiscovered(location.id)) {
            return; // Can't select undiscovered locations
        }
        setSelectedLocation(location);
    };

    const handleTravelTo = (location: WorldLocation) => {
        if (!currentLocationId) return;

        // Start travel
        startTravel(currentLocationId, location.id);

        // For now, instantly complete travel (will add animation later)
        setTimeout(() => {
            setCurrentLocation(location.id);
            setSelectedLocation(null);

            // Transition to appropriate game state
            if (location.type === 'town') {
                setGameState('town');
            } else if (location.type === 'dungeon') {
                setShowingDungeonEntrance(true);
            }
        }, 500);
    };

    const handleEnterLocation = () => {
        if (!currentLocation) return;

        if (currentLocation.type === 'town') {
            setGameState('town');
        } else if (currentLocation.type === 'dungeon') {
            setShowingDungeonEntrance(true);
        }
    };

    const getLocationIcon = (type: string) => {
        switch (type) {
            case 'town': return '🏰';
            case 'dungeon': return '⛰️';
            case 'wilderness': return '🌲';
            case 'landmark': return '🗿';
            default: return '📍';
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-etrian-900 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-200 mb-2">
                        {worldMap.name}
                    </h1>
                    {currentLocation && (
                        <p className="text-lg text-slate-600 dark:text-gray-400">
                            Currently at: <span className="font-semibold">{currentLocation.name}</span>
                        </p>
                    )}
                </div>

                {/* Map Container */}
                <div className="bg-etrian-800 rounded-xl p-4 shadow-lg border border-cyan-900/50 mb-6 relative z-0">
                    <div className="relative w-full h-[50vh] md:h-[600px] bg-etrian-900 rounded-lg border-2 border-cyan-900 overflow-hidden">
                        {/* Render locations */}
                        {worldMap.locations.map((location) => {
                            const discovered = isLocationDiscovered(location.id);
                            const isCurrent = location.id === currentLocationId;
                            const isConnected = connectedLocations.some(loc => loc.id === location.id);
                            const isSelected = selectedLocation?.id === location.id;

                            if (!discovered) return null;

                            return (
                                <div
                                    key={location.id}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${isCurrent ? 'scale-125 z-20' : isSelected ? 'scale-110 z-10' : 'z-0'
                                        }`}
                                    style={{
                                        left: `${(location.position.x / 1000) * 100}%`,
                                        top: `${(location.position.y / 1000) * 100}%`
                                    }}
                                    onClick={() => handleLocationClick(location)}
                                >
                                    {/* Location marker */}
                                    <div className={`relative ${isCurrent ? 'animate-pulse' : ''}`}>
                                        <div className={`text-4xl ${isCurrent ? 'drop-shadow-lg' : ''}`}>
                                            {getLocationIcon(location.type)}
                                        </div>

                                        {/* Location name */}
                                        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap text-xs font-semibold px-2 py-1 rounded ${isCurrent
                                            ? 'bg-blue-500 text-white'
                                            : isConnected
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-700 text-gray-200'
                                            }`}>
                                            {location.name}
                                        </div>

                                        {/* Current location indicator */}
                                        {isCurrent && (
                                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 dark:text-blue-400 font-bold">
                                                ★ You are here
                                            </div>
                                        )}

                                        {/* Dungeon completion indicator */}
                                        {location.type === 'dungeon' && location.dungeonData?.completed && (
                                            <div className="absolute -top-1 -right-1 text-lg">✅</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Render connections (simple lines) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                            {worldMap.connections.map((conn, idx) => {
                                const fromLoc = worldMap.locations.find(l => l.id === conn.from);
                                const toLoc = worldMap.locations.find(l => l.id === conn.to);

                                if (!fromLoc || !toLoc) return null;
                                if (!isLocationDiscovered(fromLoc.id) || !isLocationDiscovered(toLoc.id)) return null;

                                const x1 = (fromLoc.position.x / 1000) * 100;
                                const y1 = (fromLoc.position.y / 1000) * 100;
                                const x2 = (toLoc.position.x / 1000) * 100;
                                const y2 = (toLoc.position.y / 1000) * 100;

                                return (
                                    <line
                                        key={idx}
                                        x1={`${x1}%`}
                                        y1={`${y1}%`}
                                        x2={`${x2}%`}
                                        y2={`${y2}%`}
                                        stroke="rgba(100, 100, 100, 0.3)"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* Location Details Panel */}
                {selectedLocation && (
                    <div className="fixed inset-x-4 bottom-4 md:static md:inset-auto md:bg-etrian-800 md:rounded-xl md:p-6 md:shadow-lg md:border md:border-cyan-500 md:mb-6 z-50 bg-etrian-900 border-2 border-cyan-500 rounded-xl p-4 shadow-2xl">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-200 mb-2">
                                    {getLocationIcon(selectedLocation.type)} {selectedLocation.name}
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-gray-400 capitalize">
                                    {selectedLocation.type}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLocation(null)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-slate-700 dark:text-gray-300 mb-4">
                            {selectedLocation.description}
                        </p>

                        {/* Dungeon-specific info */}
                        {selectedLocation.dungeonData && (
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
                                <p className="text-sm text-slate-700 dark:text-gray-300">
                                    <strong>Floors:</strong> {selectedLocation.dungeonData.floors} |
                                    <strong> Difficulty:</strong> {selectedLocation.dungeonData.difficulty}/10 |
                                    <strong> Recommended Level:</strong> {selectedLocation.dungeonData.recommendedLevel}
                                </p>
                                {selectedLocation.dungeonData.completed && (
                                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                        ✅ Completed
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Town-specific info */}
                        {selectedLocation.townData && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                                <p className="text-sm text-slate-700 dark:text-gray-300 mb-2">
                                    <strong>Size:</strong> {selectedLocation.townData.size} |
                                    <strong> Population:</strong> {selectedLocation.townData.population}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-gray-400">
                                    Services: {selectedLocation.townData.services.join(', ')}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {selectedLocation.id === currentLocationId ? (
                                <Button
                                    variant="primary"
                                    onClick={handleEnterLocation}
                                >
                                    Enter {selectedLocation.type === 'town' ? 'Town' : 'Dungeon'}
                                </Button>
                            ) : connectedLocations.some(loc => loc.id === selectedLocation.id) ? (
                                <Button
                                    variant="primary"
                                    onClick={() => handleTravelTo(selectedLocation)}
                                >
                                    Travel Here
                                </Button>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Not connected to current location
                                </p>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => setSelectedLocation(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}

                {/* Current Location Actions */}
                {currentLocation && !selectedLocation && (
                    <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50">
                        <h3 className="text-lg font-semibold text-gold-500 mb-4">
                            Available Actions
                        </h3>
                        <div className="flex gap-3">
                            <Button
                                variant="primary"
                                onClick={handleEnterLocation}
                            >
                                Enter {currentLocation.type === 'town' ? 'Town' : currentLocation.name}
                            </Button>

                            {connectedLocations.length > 0 && (
                                <div className="text-sm text-slate-600 dark:text-gray-400 flex items-center">
                                    Click a connected location to travel there
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
