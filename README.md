# Utpal Kant Sharma — Next-Gen 3D Portfolio

Next-generation, high-animation portfolio for **Utpal Kant Sharma**, an AI & Backend Engineer based in Guwahati, Assam, specializing in agentic systems (LangGraph pipelines, RAG assistants, LLM-as-judge critic loops) and resilient Django/FastAPI services.

---

## Next-Gen Features & Visual Tech Stack

- **3D Neural Core & Agent Constellation (`Three.js`)**: Real-time WebGL particle cosmos with 1,800+ dynamic synaptic lines, mouse-reactive gravity, and real-time morphing between 3 distinct 3D states (*Neural Sphere*, *Torus Pipeline*, *Agent Grid*).
- **Interactive LangGraph Agent Pipeline Simulator**: Live interactive visualizer tracing multi-stage agent workflows (Query Router → Hybrid Vector Search → LangGraph Drafter → LLM-as-Judge Critic Loop → Gateway Delivery) with real-time latency and token metrics.
- **Kinetic Typography & Cyber Decryption**: Dynamic alphanumeric glyph scrambling and decryption on scroll and hover.
- **3D Hologram Cards with Specular Glare**: Realistic 3D perspective transforms (`rotateX`, `rotateY`) responding to cursor coordinates with dynamic spotlight borders.
- **Developer Command Center (`Ctrl+K` / `⌘K`)**: Instant search and navigation palette with keyboard shortcuts for sections, resume download, socials, and theme toggling.
- **Interactive Developer CLI Terminal**: Hybrid terminal and contact form supporting CLI commands (`help`, `about`, `skills`, `projects`, `cv`, `clear`, `matrix`, `ping`) and client-side validated message dispatch with confetti celebrations.
- **Procedural Web Audio FX**: High-tech sci-fi clicks, whooshes, and chimes synthesized natively via the browser's Web Audio API (zero external sound files, muted by default with a glowing header toggle).
- **Dual Themes & Butter-Smooth Scrolling**: Cyber Dark theme and Crisp Light theme, unified with Lenis smooth momentum scrolling.

---

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **3D Engine**: Three.js (WebGL)
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Icons**: Lucide React
- **Smooth Scroll**: Lenis
- **Effects**: Canvas-Confetti, Web Audio API Synthesizer

---

## Project Structure

```
├── .github/workflows/
│   └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── dist/                   # Production-ready compiled bundle
├── public/                 # Static assets (images, fonts, resume PDF)
│   ├── fonts/              # Self-hosted Manrope and DM Mono WOFF2 fonts
│   ├── images/             # High-res WebP project previews
│   └── Utpal_Kant_Sharma_Resume.pdf
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   └── NeuralCore.tsx               # Three.js 3D WebGL centerpiece
│   │   ├── interactive/
│   │   │   ├── AgentPipelineSimulator.tsx   # LangGraph visualizer
│   │   │   ├── CommandPalette.tsx           # Ctrl+K HUD
│   │   │   └── TerminalContact.tsx          # CLI shell & validated form
│   │   ├── ui/
│   │   │   ├── DecryptedText.tsx            # Matrix text decryption
│   │   │   └── HoloCard.tsx                 # 3D tilt perspective card
│   │   ├── About.tsx                        # Profile narrative & stats
│   │   ├── Contact.tsx                      # Transmission station
│   │   ├── Experience.tsx                   # Laser timeline & credentials
│   │   ├── Footer.tsx                       # Legal popups & copyright
│   │   ├── Hero.tsx                         # Hero with 3D Core & Memoji
│   │   ├── Navbar.tsx                       # Glassmorphism header & controls
│   │   ├── Projects.tsx                     # 3D Project showcases
│   │   └── Skills.tsx                       # Capability gauges & chips
│   ├── data/
│   │   └── portfolioData.ts                 # 100% centralized data store
│   ├── utils/
│   │   └── audio.ts                         # Procedural Web Audio synthesizer
│   ├── App.tsx                              # Main layout & Lenis scroll
│   ├── index.css                            # Tailwind & font definitions
│   └── main.tsx                             # Entry point
├── backup/
│   └── legacy-static-v1/   # Preserved original static files
├── index.html              # Vite entry point
├── package.json            # Scripts & dependencies
├── tailwind.config.js      # Cyber visual tokens
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build setup
```

---

## Getting Started

### 1. Run Locally (Development)
```bash
npm run dev
# Then open http://localhost:5173
```

### 2. Build for Production
```bash
npm run build
```

### 3. Preview Production Build
```bash
npm run preview
# Then open http://localhost:4173
```

### 4. Run Static Server without Node
```bash
python -m http.server 8000 --directory dist
# Then open http://localhost:8000
```

---

## Deployment

Pushes to the `main` branch automatically build and publish to GitHub Pages using the configured `.github/workflows/deploy.yml` workflow.

---

## License

See [LICENSE](LICENSE).
