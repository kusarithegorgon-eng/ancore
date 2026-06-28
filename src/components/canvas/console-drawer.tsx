import { useCanvasStore } from "@/lib/canvas-store";
import { Terminal, X, ChevronDown, Check, CircleAlert as AlertCircle } from "lucide-react";

export function ConsoleDrawer() {
  const { showConsole, setShowConsole, executionLogs, isExecuting } = useCanvasStore();

  if (!showConsole) return null;

  return (
    <div className="shrink-0 h-[280px] bg-[#0a0a0c] border-t border-border-subtle flex flex-col z-30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-9 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-[color:var(--accent)]" />
          <span className="text-[11px] font-semibold text-foreground">Execution Console</span>
          {isExecuting && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[color:var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] animate-pulse" />
              Running...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{executionLogs.length} steps</span>
          <button
            onClick={() => setShowConsole(false)}
            className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[11px]">
        {executionLogs.length === 0 && (
          <div className="text-muted-foreground text-center py-8">
            Click "Run Test" to see execution results
          </div>
        )}
        {executionLogs.map((log, i) => (
          <div key={i} className="rounded-lg border border-border-subtle bg-[#121214]/80 p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-muted-foreground">Step {log.step}</span>
              <span className="text-[10px] font-semibold text-foreground">{log.nodeTitle}</span>
              <span className="text-[10px] text-muted-foreground">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ""}</span>
              <span className="ml-auto">
                {log.status === "success" ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-red-400" />
                )}
              </span>
            </div>
            {log.message && (
              <div className="text-[10px] text-[color:var(--accent)] mb-2">{log.message}</div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Input</span>
                <pre className="mt-1 p-2 rounded-md bg-[#0a0a0c] border border-border-subtle text-[10px] text-muted-foreground overflow-auto max-h-[80px]">
                  {JSON.stringify(log.input, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Output</span>
                <pre className="mt-1 p-2 rounded-md bg-[#0a0a0c] border border-border-subtle text-[10px] text-[color:var(--accent)] overflow-auto max-h-[80px]">
                  {JSON.stringify(log.output, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
