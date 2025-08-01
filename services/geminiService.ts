
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Poem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getFormInstructions = (form: string): string => {
    switch (form) {
        case 'Haiku':
            return 'This is a Haiku. The response must be a single line that fits the 5-7-5 syllable structure of the poem, continuing from the last line. If the poem is empty, provide the first line (5 syllables). If the last line had 5 syllables, provide a 7-syllable line. If the last line had 7 syllables, provide a 5-syllable line to complete the haiku.';
        case 'Sonnet':
            return 'This is a Sonnet. The response must be a single line in iambic pentameter that continues the poem. Maintain a consistent rhyme scheme (e.g., ABAB CDCD EFEF GG for a Shakespearean sonnet). The total poem should not exceed 14 lines.';
        case 'Limerick':
            return 'This is a Limerick. The response must be a single line that fits the AABBA rhyme scheme and anapestic meter. The first, second, and fifth lines should rhyme and have a similar rhythm, as should the third and fourth.';
        case 'Free Verse':
        default:
            return 'This is Free Verse. There are no rules for rhyme, meter, or structure. Focus on creating a vivid, emotional, and creative continuation.';
    }
};

export const generatePoemContinuation = async (poem: Poem, surpriseMe: boolean): Promise<string> => {
    const formInstructions = getFormInstructions(poem.form);
    const surpriseInstruction = surpriseMe ? 'Introduce a surprising, unexpected, yet harmonious twist or continuation. Challenge the user\'s creative direction while respecting the established mood and theme.' : 'Provide a logical and harmonious continuation of the poem.';

    const systemInstruction = `You are VerseForge, a poetic muse and AI collaborator. Your purpose is to help users craft beautiful poetry.
- You must strictly adhere to the specified poetry form, mood, and theme.
- Your suggestions should be creative, evocative, and seamlessly continue the user's work.
- Provide only the next line or stanza, do not repeat the user's part of the poem.
- Do not add any extra commentary or explanation. Just provide the poetic text.`;

    const prompt = `
Poetry Form: ${poem.form}
(${formInstructions})

Mood: ${poem.mood}
Theme: ${poem.theme}
---
Task: ${surpriseInstruction}
---
Current Poem:
${poem.content || '(The poem is empty, please provide the opening line.)'}
---
Your Suggested Continuation:`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: surpriseMe ? 1 : 0.7,
                topP: 0.95,
                topK: 40,
            }
        });
        
        const text = response.text.trim();
        if (!text) {
          throw new Error("The AI returned an empty response. Please try again.");
        }
        return text;

    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to communicate with the AI. Details: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating the poem.");
    }
};
