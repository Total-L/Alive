
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { api } from '../services/api';

interface HomeScreenProps {
    navigateTo: (screen: Screen) => void;
    userName: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigateTo, userName }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 });
    const [greeting, setGreeting] = useState('早安');
    const [lastCheckinTime, setLastCheckinTime] = useState<string>('从未');
    const [isCheckedInToday, setIsCheckedInToday] = useState(false);

    const fetchStatus = async () => {
        try {
            const history = await api.getHistory();
            if (history.length > 0) {
                const last = history[0];
                const lastDate = new Date(last.date);
                
                // Format relative time
                const diff = Date.now() - lastDate.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                if (hours < 1) {
                    setLastCheckinTime('刚刚');
                } else if (hours < 24) {
                    setLastCheckinTime(`${hours}小时前`);
                } else {
                    setLastCheckinTime(`${Math.floor(hours / 24)}天前`);
                }

                // Check if today
                const today = new Date();
                if (lastDate.getDate() === today.getDate() && 
                    lastDate.getMonth() === today.getMonth() && 
                    lastDate.getFullYear() === today.getFullYear() &&
                    last.type === 'safe') {
                    setIsCheckedInToday(true);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStatus();
        // ... existing timer code ...
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                let { hours, minutes, seconds } = prevTime;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    // Reset or handle timer end
                    return { hours: 23, minutes: 59, seconds: 59 };
                }
                return { hours, minutes, seconds };
            });
        }, 1000);

        const determineGreeting = () => {
            const currentHour = new Date().getHours();
            if (currentHour >= 5 && currentHour < 12) {
                setGreeting('早安');
            } else if (currentHour >= 12 && currentHour < 18) {
                setGreeting('下午好');
            } else {
                setGreeting('晚上好');
            }
        };

        determineGreeting();

        return () => clearInterval(timer);
    }, []);

    const handleCheckIn = async () => {
        try {
            await api.checkin('safe', 'Manual check-in from home screen');
            // Refresh status to show "Just now"
            await fetchStatus();
            // Optional: Show success feedback
            alert('签到成功！');
        } catch (error) {
            console.error('Check-in failed', error);
            alert('签到失败，请重试');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex items-center justify-between p-6 pt-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[28px]">shield_with_heart</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">每日签到</h2>
                </div>
                <button onClick={() => navigateTo(Screen.Settings)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </header>
            
            <div className="px-6 py-4">
                <h1 className="text-3xl font-black leading-tight">{greeting}，<br />{userName}</h1>
                <p className="text-[#6b8080] dark:text-zinc-400 mt-1 font-medium">愿你度过平安宁静的一天。</p>
            </div>

            <div className="px-6 py-4">
                <div className="relative overflow-hidden bg-card-bg dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800 soft-shadow">
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-primary font-bold text-xs tracking-widest">当前状态</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-1">今日已平安</h3>
                            <p className="text-[#6b8080] dark:text-zinc-400 text-sm">您的安全状态已同步给 3 位紧急联系人。</p>
                        </div>
                        <div className="flex items-center gap-2 bg-primary/5 dark:bg-primary/20 self-start px-3 py-1 rounded-full">
                            <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                            <span className="text-primary font-medium text-xs">上次签到：2小时前</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center px-6 text-center pt-6 pb-6">
                <div className="mb-2">
                    <button onClick={handleCheckIn} className="group w-48 h-48 bg-primary text-white rounded-full flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 active:brightness-90 check-in-glow">
                        <span className="material-symbols-outlined text-5xl">touch_app</span>
                        <span className="text-xl font-bold tracking-tight">立即签到</span>
                        <span className="text-[10px] tracking-[0.2em] opacity-80 font-medium">点击确认安全</span>
                    </button>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#6b8080] dark:text-zinc-400">距离下次签到还有</p>
                    <p className="text-2xl font-bold tracking-tight">{timeLeft.hours} 小时 {timeLeft.minutes} 分</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 px-6 mb-32">
                <div className="bg-card-bg dark:bg-zinc-900 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-accent-warm">sunny</span>
                        <span className="text-accent-warm font-bold text-sm">+1</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold">连续签到 12 天</p>
                        <p className="text-[#6b8080] dark:text-zinc-400 text-xs font-medium">坚持就是平安</p>
                    </div>
                </div>
                <div className="bg-card-bg dark:bg-zinc-900 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-primary">notifications_active</span>
                        <span className="text-primary font-bold text-sm">09:00</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold">明日提醒</p>
                        <p className="text-[#6b8080] dark:text-zinc-400 text-xs font-medium">预设警报时间</p>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 z-10">
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-danger font-bold border border-danger/20 hover:bg-danger/5 transition-all duration-150 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm active:bg-danger/10 active:scale-[0.98]">
                    <span className="material-symbols-outlined">sos</span>
                    触发紧急预警
                </button>
            </div>
            <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
};

export default HomeScreen;
