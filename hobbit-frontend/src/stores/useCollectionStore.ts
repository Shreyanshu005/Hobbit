import { create } from 'zustand';
import { storage } from '../utils/storage';

export interface Collection {
    id: string;
    name: string;
    description: string;
    hobbyIds: string[];
    createdAt: string;
}

interface CollectionState {
    collections: Collection[];
    createCollection: (name: string, description: string) => void;
    deleteCollection: (id: string) => void;
    addHobbyToCollection: (collectionId: string, hobbyId: string) => void;
    removeHobbyFromCollection: (collectionId: string, hobbyId: string) => void;
}

const STORAGE_KEY = 'hobbit_collections';

const defaultCollections: Collection[] = [
    {
        id: 'general',
        name: 'General Collection',
        description: 'Save all relevant conversations in a single collection.',
        hobbyIds: [],
        createdAt: new Date().toISOString(),
    }
];

export const useCollectionStore = create<CollectionState>((set) => ({
    collections: storage.get<Collection[]>(STORAGE_KEY) || defaultCollections,

    createCollection: (name, description) => set((state) => {
        const newCollection: Collection = {
            id: `col-${Date.now()}`,
            name,
            description,
            hobbyIds: [],
            createdAt: new Date().toISOString(),
        };
        const updated = [...state.collections, newCollection];
        storage.set(STORAGE_KEY, updated);
        return { collections: updated };
    }),

    deleteCollection: (id) => set((state) => {
        if (id === 'general') return state; // Can't delete default
        const updated = state.collections.filter(c => c.id !== id);
        storage.set(STORAGE_KEY, updated);
        return { collections: updated };
    }),

    addHobbyToCollection: (collectionId, hobbyId) => set((state) => {
        const updated = state.collections.map(c => {
            if (c.id === collectionId && !c.hobbyIds.includes(hobbyId)) {
                return { ...c, hobbyIds: [...c.hobbyIds, hobbyId] };
            }
            return c;
        });
        storage.set(STORAGE_KEY, updated);
        return { collections: updated };
    }),

    removeHobbyFromCollection: (collectionId, hobbyId) => set((state) => {
        const updated = state.collections.map(c => {
            if (c.id === collectionId) {
                return { ...c, hobbyIds: c.hobbyIds.filter(id => id !== hobbyId) };
            }
            return c;
        });
        storage.set(STORAGE_KEY, updated);
        return { collections: updated };
    }),
}));
