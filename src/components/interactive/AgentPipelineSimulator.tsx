import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, ShieldCheck, Cpu, Database, Sparkles, Terminal } from 'lucide-react';
import { sound } from '../../utils/audio';

interface NodeStage {
  id: string;
  name: string;
  role: string;
  tech: string;
  status: 'idle' | 'active' | 'success' | 'revised';
  latency: string;
  outputPreview?: string;
}

export const AgentPipelineSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [queryInput, setQueryInput] = useState('Analyze multi-agent reasoning latency & optimize vector retrieval');
  const [logs, setLogs] = useState<string[]>([
    'System ready. Select a pipeline and run agent simulation.',
  ]);

  const stages: NodeStage[] = [
    {
      id: 'router',
      name: 'Query Router',
      role: 'Intent & Complexity Gate',
      tech: 'FastAPI + Pydantic',
      status: currentStep === 0 ? 'active' : currentStep > 0 ? 'success' : 'idle',
      latency: currentStep >= 0 ? '12ms' : '--',
      outputPreview: 'Intent: Deep Analysis · Schema: Verified',
    },
    {
      id: 'retriever',
      name: 'Hybrid Retriever',
      role: 'Dense + Sparse Vector Search',
      tech: 'Qdrant + PostGIS',
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'success' : 'idle',
      latency: currentStep >= 1 ? '48ms' : '--',
      outputPreview: 'Fetched top 8 semantic chunks (cos_sim: 0.89)',
    },
    {
      id: 'drafter',
      name: 'LangGraph Drafter',
      role: 'Structured Synthesis',
      tech: 'LangChain + Groq/Gemini',
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'success' : 'idle',
      latency: currentStep >= 2 ? '110ms' : '--',
      outputPreview: 'Generated draft report with citation anchors',
    },
    {
      id: 'critic',
      name: 'LLM-as-Judge Critic',
      role: 'Self-Critique & Hallucination Guard',
      tech: 'LangGraph Revision Loop',
      status: currentStep === 3 ? 'active' : currentStep > 3 ? 'success' : 'idle',
      latency: currentStep >= 3 ? '64ms' : '--',
      outputPreview: 'Score: 9.4/10 · Guardrails: PASSED',
    },
    {
      id: 'response',
      name: 'Verified Output',
      role: 'Streaming Delivery',
      tech: 'DRF / FastAPI Response',
      status: currentStep === 4 ? 'active' : currentStep > 4 ? 'success' : 'idle',
      latency: currentStep >= 4 ? '234ms Total' : '--',
      outputPreview: 'Deterministic JSON validated & dispatched',
    },
  ];

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(0);
    sound.playClick();
    setLogs([`[0ms] ➔ User Request: "${queryInput}"`]);

    const stepTimings = [
      { step: 0, delay: 500, log: '[12ms] [Router] Classifying query intent... Routing to RAG + Critic Graph.' },
      { step: 1, delay: 1300, log: '[60ms] [Retriever] Qdrant HNSW vector search completed. 8 chunks retrieved.' },
      { step: 2, delay: 2300, log: '[170ms] [Drafter] LangGraph node synthesizing structured findings via Gemini.' },
      { step: 3, delay: 3300, log: '[234ms] [Critic Loop] LLM-as-Judge verified accuracy (9.4/10). No revision needed.' },
      { step: 4, delay: 4200, log: '[245ms] [Gateway] Response rendered and sent via REST endpoint with JWT validation.' },
    ];

    stepTimings.forEach(({ step, delay, log }) => {
      setTimeout(() => {
        setCurrentStep(step);
        sound.playWhoosh();
        setLogs((prev) => [...prev, log]);
        if (step === 4) {
          setIsRunning(false);
          sound.playChime();
        }
      }, delay);
    });
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    sound.playClick();
    setLogs(['Pipeline reset. Ready for next simulation.']);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#101014]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background Matte Red Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
            <h3 className="text-lg md:text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              LangGraph Agent Pipeline Visualizer
              <Sparkles className="w-4 h-4 text-red-400" />
            </h3>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Interactive live trace of an agentic RAG workflow with self-critique loops and vector retrieval.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-mono font-semibold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-bold transition-all shadow-glow-red active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Processing Pipeline…' : 'Run Agent Simulation'}
          </button>

          <button
            onClick={resetSimulation}
            disabled={isRunning && currentStep < 4}
            title="Reset Pipeline"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="mb-8 p-3 rounded-xl bg-[#08080a] border border-white/10 flex items-center gap-3">
        <span className="text-xs font-mono text-red-400 font-bold px-2 py-1 rounded bg-red-950/80 border border-red-800/40">
          PROMPT
        </span>
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          disabled={isRunning}
          className="flex-1 bg-transparent text-xs md:text-sm font-mono text-slate-200 focus:outline-none placeholder-slate-500"
          placeholder="Enter a task to run through the agent graph..."
        />
      </div>

      {/* Pipeline Node Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative mb-8">
        {stages.map((stage, idx) => {
          const isActive = stage.status === 'active';
          const isSuccess = stage.status === 'success';

          return (
            <div
              key={stage.id}
              className={`relative rounded-xl p-4 transition-all duration-300 border ${
                isActive
                  ? 'border-red-500 bg-red-950/40 shadow-glow-red scale-[1.02]'
                  : isSuccess
                  ? 'border-red-900/60 bg-red-950/20'
                  : 'border-white/5 bg-[#08080a]/60 opacity-70'
              }`}
            >
              {/* Connector dot */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400">STAGE 0{idx + 1}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-red-500/20 text-red-300 font-bold animate-pulse'
                      : isSuccess
                      ? 'bg-red-900/40 text-red-300'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {stage.latency}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                {idx === 0 && <Cpu className="w-4 h-4 text-red-400" />}
                {idx === 1 && <Database className="w-4 h-4 text-rose-400" />}
                {idx === 2 && <Sparkles className="w-4 h-4 text-red-400" />}
                {idx === 3 && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                {idx === 4 && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                <h4 className="text-xs md:text-sm font-bold text-white font-mono">{stage.name}</h4>
              </div>

              <p className="text-[11px] text-slate-400 mb-2 leading-tight">{stage.role}</p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">{stage.tech}</span>
                {isSuccess && <span className="text-red-400">✓ OK</span>}
                {isActive && <span className="text-red-400 animate-spin">◐</span>}
              </div>

              {stage.outputPreview && (isActive || isSuccess) && (
                <div className="mt-2 text-[10px] font-mono text-slate-300 bg-[#08080a] p-1.5 rounded border border-white/5 truncate">
                  {stage.outputPreview}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Trace Logs */}
      <div className="rounded-xl bg-[#08080a] p-4 border border-white/10 font-mono text-xs text-slate-300">
        <div className="flex items-center justify-between mb-2 text-slate-500 text-[11px] pb-2 border-b border-white/5">
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-red-400" />
            LIVE TELEMETRY TRACE
          </span>
          <span className="text-red-400/80">EST. SAVED TOKEN OVERHEAD: ~68%</span>
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
          {logs.map((log, i) => (
            <div key={i} className="text-slate-300 leading-relaxed font-mono flex items-start gap-2">
              <span className="text-red-500 select-none">›</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
