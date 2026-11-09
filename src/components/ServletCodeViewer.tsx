import React, { useState } from 'react';
import { sourceFiles, SourceFile } from '../data/sourceCode';
import { Code2, Copy, Check, Download, FileCode, Server, FileText, Database } from 'lucide-react';

export const ServletCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SourceFile>(sourceFiles[0]);
  const [copied, setCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Servlet', 'JSP', 'HTML', 'SQL', 'Config'];

  const filteredFiles = sourceFiles.filter(f => 
    categoryFilter === 'All' || f.category === categoryFilter
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Servlet': return Server;
      case 'JSP': return FileCode;
      case 'HTML': return FileText;
      case 'SQL': return Database;
      default: return Code2;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded font-semibold">
              Lab Submission Artifacts
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Java EE 8 / Jakarta Servlet 3.1 & JSP 2.3
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 mt-1">
            <Code2 className="w-6 h-6 text-purple-400" />
            Lab Source Code Inspector
          </h1>
          <p className="text-slate-400 text-xs">
            Review complete production-ready source code for every Servlet, JSP, HTML form, and MySQL schema specified in the lab assignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownloadFile}
            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download {selectedFile.name}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Explorer */}
        <div className="lg:col-span-4 space-y-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl space-y-1 max-h-[620px] overflow-y-auto">
            {filteredFiles.map((file) => {
              const Icon = getCategoryIcon(file.category);
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold truncate">{file.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400">
                        {file.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {file.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Editor Preview */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          {/* File Tab Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="font-mono text-slate-300 ml-2 font-semibold">
                {selectedFile.path}
              </span>
            </div>
            <span className="font-mono text-purple-400 text-[11px]">
              {selectedFile.category} Code
            </span>
          </div>

          {/* Description banner */}
          <div className="bg-purple-950/20 px-4 py-2 border-b border-slate-800/80 text-[11px] text-purple-200">
            <strong>Lab Objective: </strong>{selectedFile.description}
          </div>

          {/* Code Body */}
          <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
