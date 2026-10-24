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
    <div className="w-full rounded-2xl border border-line bg-surface/90 p-6 md:p-8 backdrop-blur-xl  relative overflow-hidden">


      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent animate-pulse " />
            <h3 className="text-lg md:text-xl font-semibold font-sans tracking-tight text-ink flex items-center gap-2">
              Inside an agent workflow
              <Sparkles className="w-4 h-4 text-accent" />
            </h3>
          </div>
          <p className="text-xs md:text-sm text-muted">
            An interactive simulation of retrieval, synthesis, and review. Timings and outputs are illustrative.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-mono font-semibold bg-accent text-accent-contrast font-bold transition-all  active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Processing Pipeline…' : 'Run Agent Simulation'}
          </button>

          <button
            onClick={resetSimulation}
            disabled={isRunning && currentStep < 4}
            title="Reset Pipeline"
            className="p-2 rounded-xl text-muted hover:text-ink bg-raised hover:bg-raised border border-line transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="mb-8 p-3 rounded-xl bg-surface border border-line flex items-center gap-3">
        <span className="text-xs font-mono text-accent font-bold px-2 py-1 rounded bg-accent-soft border border-accent/40">
          PROMPT
        </span>
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          disabled={isRunning}
          className="flex-1 bg-transparent text-xs md:text-sm font-mono text-ink focus:outline-none placeholder-subtle"
          aria-label="Pipeline task"
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
                  ? 'border-accent bg-accent-soft  scale-[1.02]'
                  : isSuccess
                  ? 'border-accent/60 bg-accent-soft'
                  : 'border-line bg-surface/60 opacity-70'
              }`}
            >
              {/* Connector dot */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-muted">STAGE 0{idx + 1}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-accent-soft text-accent font-bold animate-pulse'
                      : isSuccess
                      ? 'bg-accent-soft text-accent'
                      : 'bg-raised text-subtle'
                  }`}
                >
                  {stage.latency}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                {idx === 0 && <Cpu className="w-4 h-4 text-accent" />}
                {idx === 1 && <Database className="w-4 h-4 text-accent" />}
                {idx === 2 && <Sparkles className="w-4 h-4 text-accent" />}
                {idx === 3 && <ShieldCheck className="w-4 h-4 text-accent" />}
                {idx === 4 && <CheckCircle2 className="w-4 h-4 text-accent" />}
                <h4 className="text-xs md:text-sm font-bold text-ink font-mono">{stage.name}</h4>
              </div>

              <p className="text-[11px] text-muted mb-2 leading-tight">{stage.role}</p>

              <div className="pt-2 border-t border-line flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted">{stage.tech}</span>
                {isSuccess && <span className="text-accent">✓ OK</span>}
                {isActive && <span className="text-accent animate-spin">◐</span>}
              </div>

              {stage.outputPreview && (isActive || isSuccess) && (
                <div className="mt-2 text-[10px] font-mono text-muted bg-surface p-1.5 rounded border border-line truncate">
                  {stage.outputPreview}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Trace Logs */}
      <div className="rounded-xl bg-surface p-4 border border-line font-mono text-xs text-muted">
        <div className="flex items-center justify-between mb-2 text-subtle text-[11px] pb-2 border-b border-line">
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            SIMULATED WORKFLOW TRACE
          </span>
          <span className="text-accent/80">DEMO / LANGGRAPH</span>
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
          {logs.map((log, i) => (
            <div key={i} className="text-muted leading-relaxed font-mono flex items-start gap-2">
              <span className="text-accent select-none">›</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
