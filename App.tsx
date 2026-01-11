
import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import ContactsScreen from './screens/ContactsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';
import { api } from './services/api';

const App: React.FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
    const [userName, setUserName] = useState('小雅');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await api.getUser();
                if (user && user.username) {
                    setUserName(user.username);
                }
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, []);

    const handleUpdateUserName = async (name: string) => {
        try {
            await api.updateUser(name);
            setUserName(name);
        } catch (error) {
            console.error('Failed to update user', error);
        }
    };

    const navigateTo = (screen: Screen) => {
        setActiveScreen(screen);
    };

    const renderScreen = () => {
        switch (activeScreen) {
            case Screen.Home:
                return <HomeScreen navigateTo={navigateTo} userName={userName} />;
            case Screen.History:
                return <HistoryScreen navigateTo={navigateTo} />;
            case Screen.Contacts:
                return <ContactsScreen navigateTo={navigateTo} />;
            case Screen.Settings:
                return <SettingsScreen navigateTo={navigateTo} userName={userName} setUserName={handleUpdateUserName} />;
            default:
                return <HomeScreen navigateTo={navigateTo} userName={userName} />;
        }
    };
    
    const showBottomNav = [Screen.Home, Screen.History, Screen.Contacts, Screen.Settings].includes(activeScreen);

    return (
        <div className="max-w-[480px] mx-auto min-h-screen flex flex-col relative overflow-hidden bg-background-light dark:bg-background-dark font-sans text-[#131616] dark:text-[#fafafa]">
            <main className="flex-1 pb-20">
                {renderScreen()}
            </main>
            {showBottomNav && <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />}
        </div>
    );
};

export default App;
