import React from 'react';
import { GameFrame } from '../ui/GameFrame';

interface MainLayoutProps {
    children: React.ReactNode; // The main viewport content (Dungeon, Town, etc.)
    statusPanel: React.ReactNode; // The party status panel
    messageLog?: React.ReactNode; // Optional message log overlay or panel
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, statusPanel, messageLog }) => {
    return (
        <div className="h-screen w-screen bg-etrian-900 p-2 flex flex-col md:flex-row gap-2 overflow-hidden">

            {/* Main Viewport (Top on mobile, Left on desktop) */}
            <div className="flex-1 min-h-0 relative w-full md:h-full">
                <GameFrame className="h-full w-full shadow-lg shadow-black/50">
                    {children}
                </GameFrame>
            </div>

            {/* Status Panel & Message Log (Bottom on mobile, Right on desktop) */}
            <div className="h-[40%] md:h-full md:w-[35%] min-h-[200px] flex md:flex-col gap-2 shrink-0">

                {/* Party Status Panel */}
                <div className="flex-1 md:flex-[3] min-w-0">
                    <GameFrame className="h-full w-full" title="PARTY STATUS">
                        {statusPanel}
                    </GameFrame>
                </div>

                {/* Message Log Panel (Hidden on small mobile, visible on tablet/desktop) */}
                {messageLog && (
                    <div className="hidden md:block md:flex-[2] min-w-0">
                        <GameFrame className="h-full w-full" title="LOG">
                            {messageLog}
                        </GameFrame>
                    </div>
                )}
            </div>
        </div>
    );
};
