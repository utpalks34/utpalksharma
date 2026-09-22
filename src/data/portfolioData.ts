export interface Project {
  id: string;
  title: string;
  iconLetter: string;
  subtitle: string;
  description: string;
  chips: string[];
  image: string;
  githubUrl: string;
  metrics?: { label: string; value: string }[];
  accentColor: string;
}

export interface SkillItem {
  name: string;
  level: number;
  category: 'AI & Agentic' | 'Backend & DB' | 'DevOps & Tooling';
  color?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  when: string;
  type: 'Internship' | 'Education' | 'Certification';
  title: string;
  org: string;
  location?: string;
  credentialId?: string;
  bullets?: string[];
  text?: string;
  metrics?: { label: string; value: string }[];
}

export const PORTFOLIO_DATA = {
  personal: {
    name: 'Utpal Kant Sharma',
    handle: '[uks]',
    role: 'AI & Backend Engineer',
    bio: 'An AI and backend engineer building agentic systems — LangGraph pipelines, retrieval-augmented assistants and Django/FastAPI services. Graduate Computer Science engineer in Guwahati, turning research-grade tooling into products people can actually use.',
    location: 'Guwahati, Assam',
    coordinates: '26.1445° N, 91.7362° E',
    phone: '+91 6000 592 864',
    email: 'utpalksharma156@gmail.com',
    cvPath: 'Utpal_Kant_Sharma_Resume.pdf',
    socials: {
      linkedin: 'https://linkedin.com/in/utpal-kant-sharma',
      github: 'https://github.com/utpalks34',
      email: 'mailto:utpalksharma156@gmail.com',
    },
    status: 'AVAILABLE FOR ROLES & CONTRACTS',
  },
  about: {
    whoIAm: "I'm Utpal Kant Sharma, a graduate B.Tech Computer Science engineer from The Assam Kaziranga University (CGPA 8.08/10), based in Guwahati, Assam. My work sits where language models meet real backend engineering: agent orchestration, retrieval systems and the APIs and data layers that keep them honest. I learn by shipping — every project below started as a question I couldn't answer from documentation alone.",
    whatIDo: "I design agentic AI systems with LangChain and LangGraph — planner/retriever/responder graphs, guardrails, vector search and evaluation suites — and build the backends around them in Django REST Framework and FastAPI with PostgreSQL, PostGIS and JWT auth. Alongside that: SQL performance work, ML pipelines in Python, and deployment with Docker on AWS.",
    highlights: [
      { label: 'CGPA', value: '8.08 / 10', detail: 'The Assam Kaziranga University' },
      { label: 'Architecture', value: 'LangGraph + DRF', detail: 'Agent graphs & resilient APIs' },
      { label: 'Vector Systems', value: 'Qdrant & Chroma', detail: 'Semantic caching & RAG' },
      { label: 'Latency Optimization', value: '67% Faster', detail: 'SQL & Cache tuning at Amtron' },
    ],
  },
  skills: [
    { name: 'PYTHON', level: 90, category: 'AI & Agentic', color: '#ff1e42' },
    { name: 'LANGCHAIN, LANGGRAPH', level: 84, category: 'AI & Agentic', color: '#ef4444' },
    { name: 'RAG, LLMs', level: 78, category: 'AI & Agentic', color: '#f43f5e' },
    { name: 'DJANGO, DRF', level: 72, category: 'Backend & DB', color: '#dc2626' },
    { name: 'FASTAPI', level: 64, category: 'Backend & DB', color: '#e11d48' },
    { name: 'SQL, POSTGRESQL, POSTGIS', level: 58, category: 'Backend & DB', color: '#b91c1c' },
    { name: 'QDRANT, CHROMA', level: 46, category: 'AI & Agentic', color: '#fb7185' },
    { name: 'DOCKER, AWS', level: 36, category: 'DevOps & Tooling', color: '#ea580c' },
  ] as SkillItem[],
  additionalSkills: {
    heading: 'Agentic AI & backend',
    list: 'Also: MCP · prompt engineering · fine-tuning · OpenAI, Gemini, Groq, Hugging Face · NumPy, Pandas, Matplotlib, scikit-learn · Git, Cursor, Claude Code',
    badges: [
      'MCP', 'Prompt Engineering', 'Fine-tuning', 'OpenAI', 'Gemini', 'Groq',
      'Hugging Face', 'NumPy', 'Pandas', 'Matplotlib', 'scikit-learn',
      'Git', 'Cursor', 'Claude Code', 'PostGIS', 'JWT Auth', 'Streamlit'
    ]
  },
  experience: [
    {
      id: 'xp-1',
      when: 'Dec 2024 — Jan 2025',
      type: 'Internship',
      title: 'Data Science Intern · Amtron',
      org: 'Assam Electronics Development Corporation Ltd · Assam, India',
      bullets: [
        'Optimized complex SQL queries — JOINs, aggregations and composite indexing across 10,000+ record relational databases — cutting execution time from 45 s to under 15 s.',
        'Built end-to-end ML pipelines in Python, Pandas and NumPy, applying classification and regression models to extract business insights from live operational data.',
        'Designed Matplotlib dashboards for quarterly revenue and operational KPI trends, turning query output into executive-ready reports.',
      ],
      metrics: [
        { label: 'Query Latency', value: '45s → <15s' },
        { label: 'Database Records', value: '10,000+' },
        { label: 'Speedup', value: '67% Reduction' },
      ]
    },
    {
      id: 'xp-2',
      when: 'Aug 2022 — May 2026',
      type: 'Education',
      title: 'B.Tech, Computer Science & Engineering',
      org: 'The Assam Kaziranga University · Guwahati, Assam',
      text: 'CGPA 8.08/10. Coursework: data structures & algorithms, machine learning, database management systems, operating systems, computer networks.',
      metrics: [
        { label: 'CGPA', value: '8.08 / 10' },
        { label: 'Graduation', value: 'May 2026' },
      ]
    },
    {
      id: 'xp-3',
      when: 'Credential YB15NDMCH302',
      type: 'Certification',
      title: 'IBM RAG and Agentic AI Professional Certificate',
      org: 'Coursera',
      credentialId: 'YB15NDMCH302',
      text: 'Nine-course specialization covering RAG architectures, agentic workflows, LangChain, LangGraph, CrewAI, AutoGen and MCP.',
      metrics: [
        { label: 'Specialization', value: '9 Courses' },
        { label: 'Credential ID', value: 'YB15NDMCH302' },
      ]
    },
  ] as ExperienceItem[],
  projects: [
    {
      id: 'seva',
      title: 'SEVA',
      iconLetter: 'S',
      subtitle: 'Smart city feedback management system',
      description: 'A full-stack civic engagement platform on Django REST Framework, PostgreSQL and JWT auth. Gemini API and Hugging Face transformers classify incoming complaints automatically — 87% severity and 92% category accuracy, cutting manual triage effort by 65%.',
      chips: ['Django · DRF', 'PostgreSQL · PostGIS', 'Gemini API', 'FastAPI · JWT'],
      image: 'images/seva.webp',
      githubUrl: 'https://github.com/utpalks34',
      accentColor: '#ef4444',
      metrics: [
        { label: 'Category Accuracy', value: '92%' },
        { label: 'Severity Accuracy', value: '87%' },
        { label: 'Manual Triage Cut', value: '65%' },
      ],
    },
    {
      id: 'b2b-sales',
      title: 'B2B Sales Intelligence',
      iconLetter: 'B',
      subtitle: 'Research · Extraction · Drafting · Self-critique',
      description: "A LangGraph pipeline with research, structured extraction, drafting and self-critique stages, including a conditional revision loop where an LLM-as-judge critic scores the output and routes back to regeneration until a quality threshold is met. Defensive structured-output parsing handles malformed or non-JSON LLM responses without crashing, and a production issue where a reasoning model silently burned its token budget on chain-of-thought was diagnosed and fixed through the provider's reasoning_effort API parameter.",
      chips: ['LangGraph', 'LLM-as-judge', 'Structured output', 'reasoning_effort'],
      image: 'images/b2b-sales.webp',
      githubUrl: 'https://github.com/utpalks34',
      accentColor: '#ff1e42',
      metrics: [
        { label: 'Architecture', value: 'LangGraph Loop' },
        { label: 'Evaluation', value: 'LLM-as-Judge' },
        { label: 'Token Efficiency', value: 'Optimized' },
      ],
    },
    {
      id: 'multi-agent-researcher',
      title: 'Multi-Agent Research Assistant',
      iconLetter: 'M',
      subtitle: 'Search · Reader · Writer · Critic',
      description: "A four-stage agent pipeline that gathers web sources through the Tavily API and extracts content with a three-tier fallback scraping strategy (trafilatura, readability, BeautifulSoup). A self-critique loop lets the Critic agent review and score the Writer's report before it ships, all exposed through a custom Streamlit UI with live status tracking.",
      chips: ['LangChain', 'Tavily API', 'Streamlit'],
      image: 'images/multi-agent-researcher.webp',
      githubUrl: 'https://github.com/utpalks34',
      accentColor: '#f43f5e',
      metrics: [
        { label: 'Pipeline Stages', value: '4 Agents' },
        { label: 'Scraping Fallbacks', value: '3 Tiers' },
        { label: 'Interface', value: 'Streamlit Realtime' },
      ],
    },
    {
      id: 'tracegate',
      title: 'TraceGate',
      iconLetter: 'T',
      subtitle: 'Self-hosted LLM gateway with observability & evals',
      description: 'A multi-provider LLM gateway with an OpenAI-compatible API and automatic failover across three backends (Ollama, Groq, Gemini). Semantic caching with sentence-transformers cuts redundant calls and reduces latency by 10–40x on cache hits.',
      chips: ['FastAPI · SQLAlchemy', 'Streamlit', 'Ollama · Groq · Gemini', 'sentence-transformers'],
      image: 'images/tracegate.webp',
      githubUrl: 'https://github.com/utpalks34',
      accentColor: '#dc2626',
      metrics: [
        { label: 'Latency Reduction', value: '10–40x' },
        { label: 'Backends', value: 'Ollama/Groq/Gemini' },
        { label: 'Caching Engine', value: 'Semantic Vector' },
      ],
    },
  ] as Project[],
  legal: {
    terms: 'By using this website you agree to these terms. The content here, including text, design and project descriptions, is owned by Utpal Kant Sharma and may not be copied or reused without permission. This portfolio is provided as is, without warranties of any kind, and I am not liable for any loss arising from its use. Links to third-party sites are for convenience only and I do not control their content. These terms may be updated at any time.',
    privacy: 'I only collect the details you choose to send through the contact form, such as your name, email and message, and use them solely to reply to you. I do not sell or share your information with third parties. This site may use basic, anonymous analytics to understand how it is used. To have your data removed, contact me and I will delete it.',
  }
};
