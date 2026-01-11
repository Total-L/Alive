import React, { useState, useEffect } from 'react';
import { Screen, CheckinRecord } from '../types';
import { api } from '../services/api';

interface HistoryScreenProps {
    navigateTo: (screen: Screen) => void;
}

const HistoryItem: React.FC<{ record: CheckinRecord }> = ({ record }) => {
    const getIcon = () => {
        switch (record.type) {
            case 'safe': return { icon: 'check_circle', color: 'text-primary', bg: 'bg-success-muted dark:bg-primary/20' };
            case 'delayed': return { icon: 'timer', color: 'text-[#D4A05D]', bg: 'bg-warning-muted dark:bg-[#D4A05D]/20' };
            case 'missed': return { icon: 'emergency', color: 'text-danger', bg: 'bg-danger-muted dark:bg-danger/20' };
        }
    };
    const { icon, color, bg } = getIcon();

    const getTitle = () => {
        switch (record.type) {
            case 'safe': return '状态确认：安全';
            case 'delayed': return '延迟签到';
            case 'missed': return '未签到 - 已通知联系人';
        }
    };

    return (
        <div className="group flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-[#dee3e3] dark:border-white/10 transition-all hover:border-primary/50">
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${bg} ${color}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[#131616] dark:text-white text-base font-bold">{getTitle()}</p>
                <p className="text-[#6b8080] dark:text-zinc-400 text-sm">{record.date} {record.type !== 'safe' ? record.details : '· ' + record.details}</p>
            </div>
            <div className="text-[#6b8080] dark:text-zinc-400">
                <span className="material-symbols-outlined">chevron_right</span>
            </div>
        </div>
    );
};

const CalendarView: React.FC<{ records: CheckinRecord[] }> = ({ records }) => {
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    
    // Get current date info
    const now = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month to fill the first row
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 is Sunday
    
    const calendarDays = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        calendarDays.push({
            day: daysInPrevMonth - i,
            inMonth: false,
            date: new Date(year, month - 1, daysInPrevMonth - i)
        });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        // Find record for this day
        // Note: records usually have full ISO strings, we need to compare dates
        const record = records.find(r => {
            const rDate = new Date(r.date);
            return rDate.getDate() === i && rDate.getMonth() === month && rDate.getFullYear() === year;
        });
        
        calendarDays.push({
            day: i,
            inMonth: true,
            date: date,
            isToday: i === now.getDate() && month === now.getMonth() && year === now.getFullYear(),
            checkedIn: !!record,
            missed: record?.type === 'missed' || record?.type === 'delayed', // Logic for red dot
            type: record?.type
        });
    }
    
    // Next month days to fill grid (assuming 6 rows max = 42 cells)
    const remainingCells = 42 - calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays.push({
            day: i,
            inMonth: false,
            date: new Date(year, month + 1, i)
        });
    }

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-[#dee3e3] dark:border-white/10 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-primary">chevron_left</span>
                </button>
                <p className="text-[#131616] dark:text-white text-base font-bold">{year}年{month + 1}月</p>
                <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-primary">chevron_right</span>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {daysOfWeek.map(day => <div key={day} className="text-[#6b8080] text-[11px] font-bold text-center py-2">{day}</div>)}
                {calendarDays.map((d, i) => (
                    <div key={i} className={`h-14 flex flex-col items-center justify-center relative ${!d.inMonth ? 'opacity-20' : ''}`}>
                        {d.isToday && <div className="absolute inset-1 bg-primary/20 rounded-lg -z-0"></div>}
                        <span className={`text-sm font-bold z-10 ${d.isToday ? 'text-primary' : !d.inMonth ? '' : 'text-inherit'} ${!d.inMonth && d.day > 9 ? 'text-zinc-300' : ''}`}>{d.day}</span>
                        {d.checkedIn && <span className="text-[9px] text-primary font-bold z-10">{d.type === 'safe' ? '已签到' : (d.type === 'missed' ? '未签到' : '延迟')}</span>}
                        {d.checkedIn && <div className={`calendar-dot z-10 ${d.type === 'safe' ? 'safe-dot' : 'missed-dot'}`}></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};


const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigateTo }) => {
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const [historyRecords, setHistoryRecords] = useState<CheckinRecord[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.getHistory();
                // Store raw data, formatting happens in components
                setHistoryRecords(data);
            } catch (error) {
                console.error('Failed to fetch history', error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen">
             <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <button onClick={() => navigateTo(Screen.Home)} className="text-[#131616] dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-[#131616] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">签到历史记录</h2>
                    <div className="size-12 flex items-center justify-center">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </div>
                </div>
            </header>

            <div className="px-4 py-2">
                <h3 className="text-[#131616] dark:text-white text-base font-bold mb-3">本月记录</h3>
                <div className="flex gap-3">
                    <div className="flex flex-1 flex-col gap-1 rounded-xl p-5 border border-[#dee3e3] dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm">
                        <p className="text-[#6b8080] dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">连续签到</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-primary tracking-tight text-3xl font-black">14</p>
                            <p className="text-primary/70 text-sm font-medium">天</p>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 rounded-xl p-5 border border-[#dee3e3] dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm">
                        <p className="text-[#6b8080] dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">安全总天数</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-[#131616] dark:text-white tracking-tight text-3xl font-black">128</p>
                            <p className="text-[#6b8080] dark:text-zinc-400 text-sm font-medium">天</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-2">
                <div className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#f1f3f3] dark:bg-zinc-800 p-1">
                    <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-bold transition-all ${view === 'calendar' ? 'bg-white dark:bg-zinc-700 shadow-sm text-[#131616] dark:text-white' : 'text-[#6b8080]'}`}>
                        <span className="truncate">日历视图</span>
                        <input checked={view === 'calendar'} onChange={() => setView('calendar')} className="hidden" name="view-toggle" type="radio" value="Calendar" />
                    </label>
                    <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-bold transition-all ${view === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm text-[#131616] dark:text-white' : 'text-[#6b8080]'}`}>
                        <span className="truncate">列表视图</span>
                        <input checked={view === 'list'} onChange={() => setView('list')} className="hidden" name="view-toggle" type="radio" value="List" />
                    </label>
                </div>
            </div>
            
            <div className="p-4 pt-2">
                {view === 'calendar' && <CalendarView records={historyRecords} />}
            </div>

            <div className="px-4 pb-24">
                <h3 className="text-[#131616] dark:text-white text-lg font-bold leading-tight pt-2 pb-3">最近记录</h3>
                <div className="flex flex-col gap-3">
                    {historyRecords.map(record => <HistoryItem key={record.id} record={record} />)}
                </div>
            </div>
             <div className="absolute -top-24 -right-24 size-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="absolute -bottom-24 -left-24 size-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
};

export default HistoryScreen;
