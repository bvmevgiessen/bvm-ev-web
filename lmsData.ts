export interface ModuleContent {
  id: string;
  title: string;
  description: string;
  learningObjectives: string[];
  readingMaterials: { title: string; url: string }[];
  videoId: string | null;
  week: number;
}

export const lmsModules: ModuleContent[] = [
  {
    id: "mod-1",
    week: 1,
    title: "Foundations of Dialogue",
    description: "An introduction to the fundamental principles of intercultural and interreligious dialogue.",
    learningObjectives: ["Understand the definition of dialogue", "Learn the etiquette of communication", "Identify common barriers to dialogue"],
    readingMaterials: [{ title: "Dialogue Principles Guide", url: "#" }],
    videoId: null
  },
  {
    id: "mod-2",
    week: 2,
    title: "Qur’anic Perspectives on Dialogue",
    description: "Exploring the basis of dialogue in the Qur'an.",
    learningObjectives: ["Analyze key Qur'anic verses on diversity", "Understand the concept of 'Ta'aruf' (knowing one another)"],
    readingMaterials: [{ title: "Verses of Dialogue in the Qur'an", url: "#" }],
    videoId: null
  },
  {
    id: "mod-3",
    week: 3,
    title: "Prophetic Perspectives on Dialogue",
    description: "How the Prophet practiced dialogue and coexistence.",
    learningObjectives: ["Review the Constitution of Medina", "Study examples of prophetic diplomacy"],
    readingMaterials: [{ title: "Prophetic Examples of Dialogue", url: "#" }],
    videoId: null
  },
  {
    id: "mod-4",
    week: 4,
    title: "Historical Dialogue Practices",
    description: "Looking back at successful intercultural dialogue in history.",
    learningObjectives: ["Understand the Andalusian Convivencia", "Study historical treaties of peace"],
    readingMaterials: [{ title: "History of Coexistence", url: "#" }],
    videoId: null
  },
  {
    id: "mod-5",
    week: 5,
    title: "Christian Perspectives on Dialogue",
    description: "Understanding dialogue from a Christian theological viewpoint.",
    learningObjectives: ["Learn about Nostra Aetate", "Understand current ecumenical movements"],
    readingMaterials: [{ title: "Nostra Aetate Summary", url: "#" }],
    videoId: null
  },
  {
    id: "mod-6",
    week: 6,
    title: "Jewish Perspectives on Dialogue",
    description: "Understanding dialogue from a Jewish theological viewpoint.",
    learningObjectives: ["Learn about Jewish views on pluralism", "Understand interfaith initiatives in Judaism"],
    readingMaterials: [{ title: "Jewish Texts on Coexistence", url: "#" }],
    videoId: null
  },
  {
    id: "mod-7",
    week: 7,
    title: "Other World Religions",
    description: "Exploring dialogue concepts in Hinduism, Buddhism, and others.",
    learningObjectives: ["Learn basic tenets of Eastern philosophies", "Understand their approaches to peace"],
    readingMaterials: [{ title: "Eastern Philosophies Overview", url: "#" }],
    videoId: null
  },
  {
    id: "mod-8",
    week: 8,
    title: "Mid-term Reflection",
    description: "Reflecting on the perspectives learned so far.",
    learningObjectives: ["Synthesize Abrahamic and Eastern perspectives", "Prepare a personal reflection"],
    readingMaterials: [],
    videoId: null
  },
  {
    id: "mod-9",
    week: 9,
    title: "Social Responsibility",
    description: "The role of dialogue in fostering social cohesion and responsibility.",
    learningObjectives: ["Define civic duties", "Understand the impact of social work"],
    readingMaterials: [{ title: "Social Responsibility Guidelines", url: "#" }],
    videoId: null
  },
  {
    id: "mod-10",
    week: 10,
    title: "Human Rights and Dialogue",
    description: "How dialogue intersects with universal human rights.",
    learningObjectives: ["Analyze the UDHR", "Discuss religious freedom and expression"],
    readingMaterials: [{ title: "UDHR and Religion", url: "#" }],
    videoId: null
  },
  {
    id: "mod-11",
    week: 11,
    title: "Cultural Activities in Dialogue",
    description: "Using arts, music, and food to bridge cultural gaps.",
    learningObjectives: ["Understand the power of cultural exchange", "Plan a mock cultural event"],
    readingMaterials: [{ title: "Art as a Bridge", url: "#" }],
    videoId: null
  },
  {
    id: "mod-12",
    week: 12,
    title: "Effective Dialogue Skills - Part 1",
    description: "Practical skills for managing difficult conversations.",
    learningObjectives: ["Learn active listening techniques", "Understand non-violent communication"],
    readingMaterials: [{ title: "Active Listening Cheat Sheet", url: "#" }],
    videoId: null
  },
  {
    id: "mod-13",
    week: 13,
    title: "Effective Dialogue Skills - Part 2",
    description: "Advanced mediation and conflict resolution.",
    learningObjectives: ["Learn to de-escalate conflicts", "Practice empathy in disagreement"],
    readingMaterials: [{ title: "Conflict Resolution Strategies", url: "#" }],
    videoId: null
  },
  {
    id: "mod-14",
    week: 14,
    title: "FAQ on Islam - Women and Society",
    description: "Addressing common questions regarding women's rights in Islam.",
    learningObjectives: ["Understand the historical context of women in Islam", "Address contemporary misconceptions"],
    readingMaterials: [{ title: "Women in Islam FAQ", url: "#" }],
    videoId: null
  },
  {
    id: "mod-15",
    week: 15,
    title: "FAQ on Islam - State and Democracy",
    description: "Exploring the relationship between Islamic principles and democratic governance.",
    learningObjectives: ["Analyze the concept of Shura", "Discuss faith and modern civic life"],
    readingMaterials: [{ title: "Islam and Democracy", url: "#" }],
    videoId: null
  },
  {
    id: "mod-16",
    week: 16,
    title: "Final Project & Certification",
    description: "Wrapping up the course with a final personal project on dialogue.",
    learningObjectives: ["Demonstrate dialogue skills", "Plan a community initiative"],
    readingMaterials: [{ title: "Final Project Guidelines", url: "#" }],
    videoId: null
  }
];
