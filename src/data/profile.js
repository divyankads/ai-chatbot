// ============================================================
// DIVYANKA DAS — Personal Profile Data
// Update your real contact details, social links & projects here
// ============================================================

export const profile = {
  name: "Divyanka Das",
  title: "Computer Science Student & Creator",
  tagline: "Not perfect. Not finished. But always becoming. ✨",
  location: "Bhubaneswar, India 🇮🇳",
  email: "divyankads1234@gmail.com",
  phone: "+91 XXXXXXXXXX",

  // ── The real story ────────────────────────────────────────
  bio: `Once, I wrote words for a living — weaving stories as a freelance content writer, crafting copy that connected brands to people. I was expressive, empathetic, deeply creative. But words weren't enough. I wanted to *build* things.

So I traded my pen for a keyboard and walked into KIIT University to pursue B.Tech in Computer Science — and I haven't looked back since.

Growing up, I was the kind of person who felt everything a little too deeply. Soft. Sensitive. The world has a way of calling that a weakness. But over the years, I chose to transmute every sharp edge life threw at me into fuel — into resilience, into clarity, into code.

Today I build AI-powered web experiences, design interfaces people love, and write systems that think. My writing background gives me something most engineers don't have: the ability to tell a story through every product I create. And my engineering training gives me what words alone could never offer — the power to bring ideas to life.

I'm still sensitive. I'm just also unstoppable.`,

  social: {
    github: "https://github.com/divyankads",
    linkedin: "https://www.linkedin.com/in/divyanka-das-4a0625214",
    twitter: "https://twitter.com/divyankadas",      // ← update
    instagram: "",
  },

  skills: [
    {
      category: "Languages",
      icon: "💻",
      items: ["Java", "C", "HTML", "CSS", "JavaScript", "SQL"],
    },
    {
      category: "Web & Frontend",
      icon: "🎨",
      items: ["React", "Next.js", "Tailwind CSS", "Vite", "React Hook Form"],
    },
    {
      category: "AI / ML",
      icon: "🤖",
      items: ["Gemini API", "Prompt Engineering", "OpenAI API", "LangChain", "TypeScript"],
    },
    {
      category: "Developer Tools",
      icon: "🛠️",
      items: ["VS Code", "IntelliJ", "Git", "Figma"],
    },
    {
      category: "Coursework",
      icon: "📚",
      items: ["Data Structures", "Object-Oriented Programming", "DBMS", "Operating Systems"],
    },
    {
      category: "Soft Skills",
      icon: "✍️",
      items: ["Content Writing", "Leadership", "Public Speaking", "Communication"],
    },
  ],

  experience: [
    {
      company: "Freelance",
      role: "Content Writer & Copywriter",
      duration: "2021 – 2022",
      location: "Remote",
      description:
        "Created compelling content for brands across industries — from SEO blog posts and product descriptions to social media copy and website content. Worked independently with multiple clients, managing briefs, deadlines, and revisions. Built a keen eye for tone, storytelling, and audience connection.",
      tech: ["Content Strategy", "SEO Writing", "Copywriting", "Social Media"],
      current: false,
    },
    {
      company: "KIIT University",
      role: "B.Tech Student & Developer",
      duration: "2022 – Present",
      location: "Bhubaneswar, India",
      description:
        "Pursuing B.Tech in Computer Science & Engineering. Actively building projects, exploring AI/ML, and developing full-stack web applications. Combined creative writing instincts with technical problem-solving to build products that are both functional and beautifully crafted.",
      tech: ["React", "Python", "Node.js", "Gemini API", "SQL"],
      current: true,
    },
  ],

  education: [
    {
      institution: "KIIT University",
      degree: "B.Tech — Computer Science & Engineering",
      duration: "2022 – 2026",
      grade: "Currently Pursuing",
      highlights: ["Data Structures & Algorithms", "Machine Learning", "Web Development", "DBMS", "Operating Systems"],
    },
    {
      institution: "Modern Public School, Balasore",
      degree: "Class XII — CBSE Board (PCM + Computer Science)",
      duration: "2020 – 2022",
      grade: "Completed",
      highlights: [],
    },
    {
      institution: "Modern Public School, Balasore",
      degree: "Class X — CBSE Board",
      duration: "Completed 2020",
      grade: "Completed",
      highlights: [],
    },
  ],

  projects: [
    {
      name: "AI Portfolio Chatbot",
      description:
        "A personal portfolio website with an integrated AI chatbot powered by Google's Gemini API. Visitors can ask anything about me — skills, projects, personal journey — and receive instant, context-aware responses. Features emotional & professional mode switching.",
      tech: ["React", "Vite", "Gemini API", "CSS Animations"],
      github: "https://github.com/divyankadas/ai-chatbot-portfolio",
      live: "#",
      featured: true,
    },
    {
      name: "Bhagavad Gita Verse Explainer",
      description:
        "A full-stack web application that generates simplified AI-powered explanations of sacred Bhagavad Gita verses. Built a custom API endpoint (/api/explain) integrating the Gemini API to interpret complex texts and deliver user-friendly insights across all 700+ verses.",
      tech: ["Next.js 15", "TypeScript", "Gemini API", "Tailwind CSS", "React Hook Form"],
      github: "https://github.com/divyankadas",
      live: "#",
      featured: true,
    },
    {
      name: "To-Do List Web Application",
      description:
        "A task manager allowing users to add, manage, and delete daily tasks through a simple and interactive interface. Implemented dynamic task updates and DOM manipulation to enhance usability and user interaction.",
      tech: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/divyankadas",
      live: "#",
      featured: false,
    },
  ],

  interests: [
    "AI & Generative Tech",
    "Creative Writing",
    "Web Design",
    "Building in Public",
    "Music",
    "Journaling",
  ],

  achievements: [
    "Transitioned from freelance content writing to B.Tech CSE at KIIT",
    "Built a Gemini-powered AI portfolio from scratch",
    "Active member of college tech communities",
    "Strong believer in learning by building",
  ],

  // Personality tags shown on the About section
  personalityTags: [
    "✍️ Ex-Content Writer",
    "💻 Engineer",
    "🎨 Creative Thinker",
    "🌱 Always Growing",
    "💪 Resilient",
    "🤖 AI Enthusiast",
    "🎵 Music Lover",
    "📖 Storyteller",
  ],
};
