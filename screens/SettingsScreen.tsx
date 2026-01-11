
import React, { useState } from 'react';
import { Screen } from '../types';

interface SettingsScreenProps {
    navigateTo: (screen: Screen) => void;
    userName: string;
    setUserName: (name: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigateTo, userName, setUserName }) => {
    const [localName, setLocalName] = useState(userName);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [threshold, setThreshold] = useState(3);
    const [message, setMessage] = useState('我没有在规定时间内进行签到，请通过电话或前往我的住处确认我的安全。我的最后已知位置已附在下方链接中。');
    const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle');

    // Update local state when prop changes (e.g. after initial fetch)
    React.useEffect(() => {
        setLocalName(userName);
    }, [userName]);

    const handleSave = () => {
        if (saveState === 'saved') return;
        
        // Save changes
        setUserName(localName);
        
        setSaveState('saved');
        setTimeout(() => {
            setSaveState('idle');
        }, 2000);
    };
    
    return (
        <div className="flex flex-col min-h-screen text-[#131616] dark:text-gray-100">
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 justify-between">
                    <button onClick={() => navigateTo(Screen.Home)} className="text-[#131616] dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-[#131616] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">设置</h2>
                </div>
            </header>

            <div className="flex-1 px-4">
                <div className="mt-4">
                    <h3 className="text-[#131616] dark:text-white text-lg font-bold leading-tight pb-2">个人资料</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-500 dark:text-gray-400">显示名称</label>
                        <input
                            id="username"
                            type="text"
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-200 dark:border-zinc-600 bg-surface-light dark:bg-zinc-700/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                            placeholder="你的名字"
                        />
                    </div>
                </div>

                <div className="mt-8">
                     <h3 className="text-[#131616] dark:text-white text-xl font-bold leading-tight">预警机制</h3>
                     <p className="text-[#6b8080] dark:text-gray-400 text-sm leading-relaxed mt-1">
                        配置当您未按时完成签到时，系统通知紧急联系人的方式和时间。
                    </p>
                </div>

                <div className="mt-4">
                    <h3 className="text-[#131616] dark:text-white text-lg font-bold leading-tight pb-2">通知渠道</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 bg-white dark:bg-surface-dark rounded-xl px-4 min-h-[80px] py-3 justify-between shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[#131616] dark:text-white text-base font-bold leading-normal">启用邮件通知</p>
                                    <p className="text-[#6b8080] dark:text-gray-400 text-xs font-normal leading-normal">通过安全邮件链接通知联系人</p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#dee3e3] dark:bg-gray-700 p-0.5 has-[:checked]:bg-primary transition-all">
                                    <div className={`transition-transform duration-300 ease-in-out h-full w-[27px] rounded-full bg-white shadow-md ${emailEnabled ? 'translate-x-[20px]' : 'translate-x-0'}`}></div>
                                    <input checked={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} className="invisible absolute" type="checkbox" />
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 dark:bg-surface-dark/50 rounded-xl px-4 min-h-[80px] py-3 justify-between border border-dashed border-gray-200 dark:border-gray-700 opacity-60">
                            <div className="flex items-center gap-4">
                                <div className="text-gray-400 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 size-12">
                                    <span className="material-symbols-outlined">sms</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[#131616] dark:text-white text-base font-bold leading-normal">短信通知</p>
                                    <p className="text-[#6b8080] dark:text-gray-400 text-xs font-normal leading-normal">高级功能：全球短信预警</p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">升级</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8">
                    <div className="flex items-center justify-between px-0 pb-2">
                        <h3 className="text-[#131616] dark:text-white text-lg font-bold leading-tight">触发阈值 (连续未签到天数)</h3>
                        <span className="material-symbols-outlined text-gray-400 text-sm cursor-help">info</span>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex w-full items-center justify-between mb-4">
                            <p className="text-[#131616] dark:text-white text-sm font-medium">触发预警前的未签到天数</p>
                            <p className="text-primary text-xl font-bold">{threshold}</p>
                        </div>
                        <input type="range" min="1" max="12" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full" />
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest">立即触发</span>
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest">12天</span>
                        </div>
                        <p className="mt-4 text-[13px] text-accent-amber font-medium flex items-center gap-1.5 bg-accent-amber/5 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-base">warning</span>
                            较低的阈值会减少误报时的反应时间。
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-[#131616] dark:text-white text-lg font-bold leading-tight pb-2">自定义紧急消息</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                        <textarea 
                            className="w-full h-32 bg-surface-light dark:bg-background-dark/50 border-none rounded-lg p-3 text-sm text-[#131616] dark:text-white focus:ring-1 focus:ring-primary resize-none placeholder:text-gray-400 font-sans" 
                            placeholder="这是我的紧急求助信息..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-3">
                            <button className="text-primary text-xs font-bold tracking-widest flex items-center gap-1 hover:opacity-80 transition-opacity">
                                <span className="material-symbols-outlined text-sm">send</span>
                                发送测试预警
                            </button>
                            <span className="text-[10px] text-gray-400 font-medium">{message.length} / 500</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 mb-8">
                    <button
                        onClick={handleSave}
                        disabled={saveState === 'saved'}
                        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                            saveState === 'saved'
                                ? 'bg-emerald-500 shadow-emerald-500/20 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90 shadow-primary/20 active:scale-95'
                        }`}
                    >
                        {saveState === 'saved' ? (
                            <>
                                <span className="material-symbols-outlined">check</span>
                                更改已保存！
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">check_circle</span>
                                保存所有更改
                            </>
                        )}
                    </button>
                    <p className="text-center text-[11px] text-gray-400 mt-4 tracking-[0.2em]">Still Here v2.4.0</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
