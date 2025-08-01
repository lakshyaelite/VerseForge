
export type PoemForm = "Free Verse" | "Haiku" | "Sonnet" | "Limerick";

export type Mood = "Melancholy" | "Euphoric" | "Nostalgic" | "Romantic" | "Mysterious" | "Peaceful";

export type Theme = "Nature" | "Love" | "Loss" | "Adventure" | "Time" | "Dreams";

export interface Poem {
  id: string;
  title: string;
  content: string;
  form: PoemForm;
  mood: Mood;
  theme: Theme;
  aiSuggestion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewPoemParams {
  form: PoemForm;
  mood: Mood;
  theme: Theme;
  openingLine: string;
}
