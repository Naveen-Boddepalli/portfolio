// Portfolio data for Naveen Boddepalli
export const PORTFOLIO_DATA = {
  name: 'Naveen Boddepalli',
  role: 'Full-Stack Developer & ML/AI Engineer',
  tagline: 'Year 3 B.Tech CS @ VIT Vellore. I build things that work—from file-sharing systems to in-browser ML tools.',
  github: 'https://github.com/Naveen-Boddepalli',
  linkedin: 'https://www.linkedin.com/in/naveen-boddepalli-689056327/',
  email: '1234naveenboddepalli@gmail.com',
  leetcode: 'https://leetcode.com/u/NAVEEN2007B/',
  twitter: 'https://x.com/N_Boddepalli',

  stats: [
    { num: '300+', label: 'LeetCode Solved' },
    { num: '4', label: 'OSS Repos' },
    { num: '3rd', label: 'Year @ VIT' },
  ],

  projects: [
    {
      id: 'shadow-network',
      title: 'shadow-network',
      desc: 'Decentralized academic file-sharing with FAISS semantic search, transformer summarization (BART/RoBERTa), and a libp2p-inspired frontend across a three-tier cloud stack.',
      tags: ['React', 'FAISS', 'MongoDB', 'FastAPI', 'Transformers'],
      color: '#32ADE6',
      github: 'https://github.com/Naveen-Boddepalli/shadow-network',
      live: null,
    },
    {
      id: 'resume-analyser',
      title: 'Resume-Analyser',
      desc: 'A resume parser that extracts structured data from PDFs. Built with Python and custom NLP pipelines to automatically pull out skills, experience, and contact info without manual entry.',
      tags: ['Python', 'Jupyter', 'NLP', 'ML'],
      color: '#FF9500',
      github: 'https://github.com/Naveen-Boddepalli/Resume-Analyser',
      live: null,
    },
    {
      id: 'claude-desktop-mcp',
      title: 'claude-desktop-mcp',
      desc: 'Token-optimized MCP server tools for Claude Desktop, reducing input token consumption via tool abstraction and Caveman skill for output compression.',
      tags: ['Python', 'Anthropic', 'MCP', 'LLM'],
      color: '#BF5AF2',
      github: 'https://github.com/Naveen-Boddepalli/claude-desktop-mcp',
      live: null,
    },
    {
      id: 'automl',
      title: 'AutoML',
      desc: 'An in-browser AutoML platform for time-series forecasting. It runs entirely on the edge—meaning complete data privacy and zero server costs. Model training and data parsing happen locally via Web Workers, WebAssembly, and WebGL/WebGPU.',
      tags: ['WebAssembly', 'Web Workers', 'WebGL/WebGPU', 'Python'],
      color: '#34C759',
      github: 'https://github.com/Naveen-Boddepalli/time-series-autoML',
      live: null,
    },
  ],

  openSource: [
    {
      repo: 'arnio',
      desc: 'Built custom validator registration system, UUID/IPv4/MAC-address semantic validators, and a redaction-aware HTML export. Extended cast_types() with structured error handling across C++ ↔ Python.',
      stack: ['Python', 'C++', 'pybind11'],
    },
    {
      repo: 'DevTrack',
      desc: 'Patched SSRF vulnerability (incl. IPv6 bypass), integrated Supabase Realtime sync via custom useRealtimeSync hook, and fortified CI for secure fork PR runs.',
      stack: ['TypeScript', 'Supabase', 'GitHub Actions'],
    },
    {
      repo: 'Eventra',
      desc: 'Fixed service worker caching and lifecycle bugs to make the PWA fully functional offline.',
      stack: ['JavaScript', 'PWA', 'Service Workers'],
    },
    {
      repo: 'withfig/autocomplete',
      desc: 'Contributed terminal CLI completion spec for the xattr command, improving DX for macOS power users.',
      stack: ['TypeScript', 'Fig', 'CLI'],
    },
  ],

  skills: [
    {
      category: 'Languages',
      color: '#FF3B30',
      items: ['Python', 'C++', 'TypeScript', 'JavaScript'],
    },
    {
      category: 'Frontend & Frameworks',
      color: '#32ADE6',
      items: ['React', 'Next.js', 'Node.js', 'Express', 'FastAPI', 'HTML/CSS'],
    },
    {
      category: 'Data & Cloud',
      color: '#34C759',
      items: ['MongoDB', 'PostgreSQL', 'Git', 'GitHub Actions', 'Vercel'],
    },
    {
      category: 'AI / ML Arsenal',
      color: '#BF5AF2',
      items: ['LangChain', 'LangGraph', 'FAISS', 'HuggingFace', 'n8n', 'Transformers'],
    },
  ],
}

// Prism phases mapped to scroll sections
export const PRISM_PHASES = [
  { name: 'Hero', shape: 'tetrahedron', scrollPct: 0, color: '#32ADE6' },
  { name: 'About', shape: 'octahedron', scrollPct: 0.2, color: '#FF9500' },
  { name: 'Projects', shape: 'icosahedron', scrollPct: 0.4, color: '#0A84FF' },
  { name: 'Open Source', shape: 'dodecahedron', scrollPct: 0.6, color: '#BF5AF2' },
  { name: 'Skills', shape: 'tetrahedron', scrollPct: 0.75, color: '#34C759' },
  { name: 'Contact', shape: 'torus', scrollPct: 0.9, color: '#FFD60A' },
]

export const SPECTRUM_COLORS = [
  '#FF3B30', '#FF9500', '#FFD60A', '#34C759', '#32ADE6', '#0A84FF', '#BF5AF2'
]
