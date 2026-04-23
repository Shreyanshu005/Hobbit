const API_BASE_URL = import.meta.env.VITE_API_URL || 'http:

export const fetchHobbyFacts = async (hobby: string): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/validate/hobby/facts?hobby=${encodeURIComponent(hobby)}`);
        const result = await response.json();
        if (result.success && result.data?.facts) {
            return result.data.facts;
        }
        return [`${hobby} is a wonderful skill to learn!`];
    } catch {
        return [
            `${hobby} is a wonderful skill to learn!`,
            `Many people around the world enjoy ${hobby}.`,
            `Learning ${hobby} can boost creativity and focus.`,
        ];
    }
};
