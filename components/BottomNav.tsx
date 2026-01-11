
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

interface NavItemProps {
    screen: Screen;
    icon: string;
    label: string;
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<NavItemProps> = ({ screen, icon, label, activeScreen, setActiveScreen }) => {
    const isActive = activeScreen === screen;
    return (
        <button
            onClick={() => setActiveScreen(screen)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-[#6b8080] dark:text-zinc-400'}`}
        >
            <span className={`material-symbols-outlined ${isActive ? 'font-variation-fill-1' : ''}`}>
                {icon}
            </span>
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-around h-20 z-50">
            <NavItem screen={Screen.Home} icon="home" label="首页" activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            <NavItem screen={Screen.History} icon="history" label="历史" activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            <NavItem screen={Screen.Contacts} icon="group" label="联系人" activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            <NavItem screen={Screen.Settings} icon="settings" label="设置" activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </nav>
    );
};

export default BottomNav;
