import Editor from "@monaco-editor/react";
import { ChevronDownIcon, Settings2Icon, SparklesIcon } from "lucide-react";

function CodeEditorPanel({ selectedLanguage, code, onLanguageChange, onCodeChange }) {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Editor Header */}
      <div className="h-12 bg-[#252525] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
            <span className="text-xs font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase">
              {selectedLanguage}
            </span>
            <select
              className="bg-transparent text-xs font-bold text-white/70 outline-none cursor-pointer hover:text-white transition-colors"
              value={selectedLanguage}
              onChange={onLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <ChevronDownIcon className="size-3 text-white/30" />
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2 text-white/40">
            <Settings2Icon className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Auto-Save On</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <SparklesIcon className="size-3 text-violet-400" />
            <span className="text-[10px] font-black text-violet-300 uppercase tracking-tighter">AI Assistant Active</span>
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden relative group">
        <Editor
          height="100%"
          language={selectedLanguage === "python" ? "python" : selectedLanguage}
          value={code}
          theme="vs-dark"
          onChange={onCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            fontLigatures: true,
            suggest: {
              showMethods: true,
              showFunctions: true,
              showVariables: true,
              showConstants: true,
              showModules: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            parameterHints: {
              enabled: true,
            },
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 20 },
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            automaticLayout: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            contextmenu: true,
            renderLineHighlight: "all",
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditorPanel;
