
import React, { useState, useEffect } from 'react';
import { Screen, Contact } from '../types';
import { api } from '../services/api';

interface ContactsScreenProps {
    navigateTo: (screen: Screen) => void;
}

const initialContacts: Contact[] = [
    { id: 1, name: '陈静怡', relation: '姐妹', email: 'jingyi.chen@email.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4UxPZQUjY-ULXDqoMfEf7d346uFjpyA6RNy-tSXgMgch69rpnOvofU9Si3degZjfiNBIJ3ybJsqPA_RF2mcuxkaz75N5ps38-fiZXahy45KWsrqqKYO5jw6dELAZM762BEq74jVf8VaeGg-lDsC4UKj6AGqH_Re2Av8zSkGpJRzodW7lpGGMw1bmCvfi2O3Az5ACf7O8PotAufrEk0NhYWoflQzY-_mBVX7qPsEBJrl61XBz8d_IG8U5XqiDbrOge0sSWIVIDE1FI', isPrimary: true },
    { id: 2, name: '王志强', relation: '邻居', email: 'wzq_home@provider.net', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVwjJNZn-Se_nG3tptzDHZMvll38cc4YN8lKJ_-HbvOOvSgUGg6hN1hKAce-BGhDURU-oGp8Aut2UFpWk1b8B6Nlfb2eQSFqU-3zW632EN0zNcbJ6b0c540G7G5JdENtgg9bP1IE5d_LIJ8VjWDwl7Q4szkZmGz2-zqBpSgZorWguK7QevJ_VVXnCqdXHSa_M3uK0mvnUuxyGXazd3UCUM-s6zlwM4gu0DlLoRSKI7Q7SIlP4jpb6j7Z_2lruColpSzAePDajxzhTP', isPrimary: false },
    { id: 3, name: '张美玲', relation: '好友', email: 'meiling_z@webmail.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdX1BuuozFZ1Qhs3Ni0a1spnah2CWw2tQuK3fSBsS3sVzvdvZjJJfgLmUXXtFGOldkLgtgEurEyotLXvdw93cMl5_mQkGcO2d6cyqI-nG6bDdd_zANs-p5Sx6GfO4UUrezO9_mXYR7hSsVuG2VqgV3vRpxu7OctHx8c-yJvYe5YqjhuCHxCNiP6ofLU4FNSqMvurWspeEVudgPj5BSJdySwfRhsyD2SC1i8yTvLCBo7UjF6zwr3CEiwKLhlwbe5hrZp2-sJ8PuYCDq', isPrimary: false },
];

const AddEditContactModal: React.FC<{
    contact: Contact | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (contactData: { id?: number; name: string; relation: string; email: string; }) => void;
}> = ({ contact, isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (contact) {
                setName(contact.name);
                setRelation(contact.relation);
                setEmail(contact.email);
            } else {
                setName('');
                setRelation('');
                setEmail('');
            }
        }
    }, [contact, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name && relation && email) {
            onSave({ id: contact?.id, name, relation, email });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-sm p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6 text-center">{contact ? '编辑联系人' : '添加新联系人'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">姓名</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-lg border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3" placeholder="请输入姓名"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">关系</label>
                            <input type="text" value={relation} onChange={e => setRelation(e.target.value)} required className="mt-1 block w-full rounded-lg border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3" placeholder="例如：家人、朋友" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">电子邮箱</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full rounded-lg border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3" placeholder="contact@example.com" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="py-2.5 px-5 bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors">取消</button>
                        <button type="submit" className="py-2.5 px-5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">保存</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ContactsScreen: React.FC<ContactsScreenProps> = ({ navigateTo }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    useEffect(() => {
        console.log('API Module loaded:', api);
        const fetchContacts = async () => {
            try {
                const data = await api.getContacts();
                setContacts(data);
            } catch (error) {
                console.error('Failed to fetch contacts', error);
            }
        };
        fetchContacts();
    }, []);

    const handleOpenAddModal = () => {
        setEditingContact(null);
        setActiveMenu(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (contact: Contact) => {
        setEditingContact(contact);
        setActiveMenu(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingContact(null);
    };

    const handleSaveContact = async (contactData: { id?: number; name: string; relation: string; email: string; }) => {
        try {
            if (contactData.id) {
                // Update existing contact
                const updatedContact = await api.updateContact({
                    ...contactData,
                    id: contactData.id,
                    avatar: contacts.find(c => c.id === contactData.id)?.avatar || '', // Preserve avatar
                    isPrimary: contacts.find(c => c.id === contactData.id)?.isPrimary || false // Preserve primary status
                });
                setContacts(contacts.map(c => c.id === contactData.id ? updatedContact : c));
            } else {
                // Add new contact
                const newContact = await api.addContact({
                    name: contactData.name,
                    relation: contactData.relation,
                    email: contactData.email,
                    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
                    isPrimary: false,
                });
                setContacts([...contacts, newContact]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save contact', error);
            alert('保存联系人失败，请重试');
        }
    };

    const handleDeleteContact = async (id: number) => {
        if (window.confirm('您确定要移除这位联系人吗？此操作无法撤销。')) {
            try {
                await api.deleteContact(id);
                setContacts(contacts.filter(contact => contact.id !== id));
                setActiveMenu(null);
            } catch (error) {
                console.error('Failed to delete contact', error);
                alert('删除联系人失败，请重试');
            }
        }
    };
    
    return (
        <div className="relative flex min-h-screen w-full flex-col font-display text-[#131616] dark:text-[#f0f0f0]">
            <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-8 pb-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigateTo(Screen.Home)} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">紧急联系人列表</h2>
                    <div className="size-10"></div>
                </div>
            </header>
            <div className="flex-1 px-5 pb-32">
                <div className="mt-4 mb-8">
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                            <p className="text-sm font-medium leading-relaxed text-[#131616]/80 dark:text-[#f0f0f0]/80">
                                如果您未能按时完成安全确认，系统将自动通过短信和电子邮件通知以下联系人。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary px-1">主要联系人</h3>
                    {contacts.map(contact => (
                        contact.isPrimary ? (
                             <div key={contact.id} className="group relative flex flex-col gap-4 bg-white dark:bg-[#262626] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 transition-all hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-[64px] w-[64px] border-2 border-primary/20" style={{ backgroundImage: `url("${contact.avatar}")` }}></div>
                                    <div className="flex flex-1 flex-col justify-center">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-bold leading-none mb-1">姓名: {contact.name}</p>
                                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">首选</span>
                                        </div>
                                        <p className="text-primary text-xs font-semibold mb-1">关系: {contact.relation}</p>
                                        <p className="text-[#6b8080] dark:text-[#a0a0a0] text-sm font-normal truncate">电子邮箱: {contact.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button onClick={() => handleOpenEditModal(contact)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-white/5 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-200 dark:hover:bg-white/10">
                                        <span className="material-symbols-outlined text-sm">edit</span> 编辑
                                    </button>
                                    <button onClick={() => handleDeleteContact(contact.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-white/5 rounded-lg text-sm font-semibold text-danger/80 transition-colors hover:bg-danger/10">
                                        <span className="material-symbols-outlined text-sm">delete</span> 移除
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div key={contact.id} className="group flex items-center gap-4 bg-white dark:bg-[#262626] p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-[56px] w-[56px] opacity-90" style={{ backgroundImage: `url("${contact.avatar}")` }}></div>
                                <div className="flex flex-1 flex-col justify-center">
                                    <p className="text-base font-bold leading-tight">姓名: {contact.name}</p>
                                    <p className="text-primary/70 text-xs font-semibold">关系: {contact.relation}</p>
                                    <p className="text-[#6b8080] dark:text-[#a0a0a0] text-xs font-normal">电子邮箱: {contact.email}</p>
                                </div>
                                 {activeMenu === contact.id ? (
                                    <div className="flex items-center gap-0">
                                        <button onClick={() => handleOpenEditModal(contact)} className="size-10 flex items-center justify-center rounded-full hover:bg-primary/10 text-primary transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                                        <button onClick={() => handleDeleteContact(contact.id)} className="size-10 flex items-center justify-center rounded-full hover:bg-danger/10 text-danger transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                                    </div>
                                ) : (
                                    <button onClick={() => setActiveMenu(contact.id)} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-[#131616] dark:text-white">more_vert</span>
                                    </button>
                                )}
                            </div>
                        )
                    ))}
                     <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2">
                        <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-primary/40">group_add</span>
                        </div>
                        <p className="text-sm font-semibold opacity-40">最多可添加 5 位联系人</p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent z-10">
                <button onClick={handleOpenAddModal} className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] active:brightness-90">
                    <span className="material-symbols-outlined">person_add</span>
                    <span className="font-bold text-base">添加联系人</span>
                </button>
            </div>
            <AddEditContactModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveContact}
                contact={editingContact}
            />
        </div>
    );
};

export default ContactsScreen;
