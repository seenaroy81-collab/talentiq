import { TerminalIcon, CheckCircle2Icon, XCircleIcon, InfoIcon, ShieldAlertIcon, SparklesIcon } from "lucide-react";

function OutputPanel({ output }) {
  const isSuccess = output?.success && output?.status === "Accepted";
  const isRuntimeError = output?.success === false;
  const isWrongAnswer = output?.success && output?.status === "Wrong Answer";

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="size-4 text-white/40" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Terminal Console</span>
        </div>

        {output && (
          <div className={`flex items-center gap-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${isSuccess ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            isWrongAnswer ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
            {isSuccess && <CheckCircle2Icon className="size-3" />}
            {isWrongAnswer && <ShieldAlertIcon className="size-3" />}
            {isRuntimeError && <XCircleIcon className="size-3" />}
            {output.status || "Error"}
          </div>
        )}
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed custom-scrollbar">
        {!output ? (
          <div className="h-full flex flex-col items-center justify-center text-white/20 gap-3">
            <InfoIcon className="size-10 stroke-[1px]" />
            <p className="text-xs font-medium uppercase tracking-widest">Execute code to see results</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Header */}
            <div className="pb-4 border-b border-white/5">
              <h3 className={`text-lg font-black ${isSuccess ? 'text-emerald-400' : isWrongAnswer ? 'text-yellow-400' : 'text-rose-400'}`}>
                {output.status || "Runtime Error"}
              </h3>
              {output.error && (
                <div className="mt-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs">
                  {output.error}
                </div>
              )}
            </div>

            {/* Test Case Results */}
            {output.results && (
              <div className="space-y-4">
                {output.results.map((res, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                    <div className={`px-4 py-2 border-b border-white/5 flex items-center justify-between ${res.passed ? 'bg-emerald-500/5' : 'bg-rose-500/5'}`}>
                      <span className="text-xs font-bold text-white/40">TEST CASE {idx + 1}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${res.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {res.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/20 mb-1 tracking-tighter">Input</p>
                        <code className="text-sm text-sky-300 bg-black/30 px-2 py-1 rounded block">{res.input}</code>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/20 mb-1 tracking-tighter">Expected</p>
                          <code className="text-sm text-emerald-400 bg-black/30 px-2 py-1 rounded block">{res.expected}</code>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/20 mb-1 tracking-tighter">Actual</p>
                          <code className={`text-sm bg-black/30 px-2 py-1 rounded block ${res.passed ? 'text-emerald-400' : 'text-rose-400 font-bold underline'}`}>
                            {res.actual}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Raw Output for Debugging / AI Support */}
            {output.output && !output.results && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2">
                  {output.status === "AI Suggestion" ? (
                    <>
                      <SparklesIcon className="size-3 text-violet-400" />
                      AI Assistant Advice
                    </>
                  ) : (
                    "Logs / Standard Output"
                  )}
                </p>
                <pre className={`p-4 rounded-xl border whitespace-pre-wrap break-all shadow-inner text-sm ${output.status === "AI Suggestion"
                  ? "bg-violet-500/5 border-violet-500/20 text-violet-100 font-sans"
                  : "bg-black/50 border-white/5 text-white/80 font-mono"
                  }`}>
                  {output.output}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
