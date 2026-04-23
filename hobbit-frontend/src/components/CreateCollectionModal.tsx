import { useState } from 'react';
import { X } from 'lucide-react';
import { useCollectionStore } from '../stores/useCollectionStore';
import card1Svg from '../assets/card1.svg';

interface CreateCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateCollectionModal({ isOpen, onClose }: CreateCollectionModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const createCollection = useCollectionStore(s => s.createCollection);

    if (!isOpen) return null;

    const handleCreate = () => {
        if (name.trim().length < 2) return;
        createCollection(name.trim(), description.trim());
        setName('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#fffbf4] relative rounded-t-[32px] md:rounded-3xl shadow-2xl w-full max-w-md md:mx-4 animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 md:mt-12 pb-6 md:pb-0">
                <img
                    src={card1Svg}
                    alt="Create Collection"
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 drop-shadow-md pointer-events-none"
                />

                <div className="px-8 pb-8 pt-16">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Create a new collection</h2>
                    <p className="text-sm text-slate-400 text-center mb-8">Give your collection a title and a brief description</p>

                    <div className="space-y-6">
                        <div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Collection title"
                                className="w-full bg-transparent border-b-2 border-[#6d58e0]/30 focus:border-[#6d58e0] outline-none py-3 text-lg font-medium text-slate-900 placeholder:text-slate-400 transition-colors"
                            />
                            {name.length > 0 && name.length < 2 && (
                                <span className="text-xs text-rose-400 mt-1">*Required</span>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Collection description *"
                                className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#6d58e0] outline-none py-3 text-base text-slate-700 placeholder:text-slate-400 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 rounded-full border border-black/10 text-slate-600 font-semibold text-sm hover:bg-black/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={name.trim().length < 2}
                            className="px-8 py-2.5 rounded-full bg-[#6d58e0] text-white font-semibold text-sm hover:bg-[#5a47c4] transition-all disabled:opacity-40 shadow-lg shadow-[#6d58e0]/25"
                        >
                            Create
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
