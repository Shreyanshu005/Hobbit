import { buildPlanPrompt } from '../services/prompt.builder'

describe('buildPlanPrompt', () => {
    it('includes the hobby name', () => {
        const prompt = buildPlanPrompt('guitar', 'beginner', 'just-for-fun')
        expect(prompt).toContain('guitar')
    })

    it('includes correct level context', () => {
        const prompt = buildPlanPrompt('chess', 'beginner', 'compete')
        expect(prompt).toContain('complete beginner')
    })

    it('includes correct goal context', () => {
        const prompt = buildPlanPrompt('poker', 'casual', 'social')
        expect(prompt).toContain('socially')
    })

    it('requests JSON only output', () => {
        const prompt = buildPlanPrompt('cooking', 'intermediate', 'perform')
        expect(prompt).toContain('Return ONLY raw valid JSON')
    })

    it('requests 5 to 8 techniques', () => {
        const prompt = buildPlanPrompt('drawing', 'beginner', 'just-for-fun')
        expect(prompt).toContain('5 to 8 techniques')
    })
})