export interface LearningTarget {
  id: string;
  text: string;
}

export interface ReadingMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  description: string;
}

export interface VideoMaterial {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
}

export interface ModuleContent {
  id: string;
  week: number;
  title: string;
  description: string;
  learningTargets: LearningTarget[];
  readingMaterials: ReadingMaterial[];
  bookRecommendations: BookRecommendation[];
  videos: VideoMaterial[];
}

export const lmsModules: ModuleContent[] = [
  {
    id: "mod-1",
    week: 1,
    title: "Foundations of Dialogue",
    description: "An introduction to the fundamental principles of intercultural and interreligious dialogue.",
    learningTargets: [
      { id: "mod1-t1", text: "Understand the definition of dialogue" },
      { id: "mod1-t2", text: "Learn the etiquette of communication" },
      { id: "mod1-t3", text: "Identify common barriers to dialogue" },
      { id: "mod1-t4", text: "Recognize the importance of active listening" }
    ],
    readingMaterials: [
      { id: "mod1-r1", title: "Dialogue Principles Guide", description: "Comprehensive guide on Dialogue principles", url: "#" }
    ],
    bookRecommendations: [
      { id: "mod1-b1", title: "The Art of Communicating", author: "Thich Nhat Hanh", description: "A simple guide to mindful communication." }
    ],
    videos: [
      { id: "mod1-v1", title: "Introduction to Intercultural Dialogue", description: "A brief overview of intercultural dialogue principles.", youtubeId: "dQw4w9WgXcQ" }
    ]
  },
  {
    id: "mod-2",
    week: 2,
    title: "Qur’anic Perspectives on Dialogue",
    description: "Exploring the basis of dialogue in the Qur'an.",
    learningTargets: [
      { id: "mod2-t1", text: "Analyze key Qur'anic verses on diversity" },
      { id: "mod2-t2", text: "Understand the concept of 'Ta'aruf' (knowing one another)" },
      { id: "mod2-t3", text: "Identify the principles of religious freedom in Islam" },
      { id: "mod2-t4", text: "Examine the concept of justice and equity in dialogue" }
    ],
    readingMaterials: [
      { id: "mod2-r1", title: "Verses of Dialogue in the Qur'an", description: "Selected verses translated", url: "#" }
    ],
    bookRecommendations: [],
    videos: []
  }
];

