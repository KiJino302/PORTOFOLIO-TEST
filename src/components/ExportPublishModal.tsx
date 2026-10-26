import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, FileCode, FileJson } from 'lucide-react';
import { PortfolioConfig } from '../types/portfolio';
import {
  generateStandalonePortfolioHtml,
  parseImportedPortfolioJson,
} from '../utils/portfolioLogic';

interface ExportPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioConfig;
  onImportConfig: (newConfig: PortfolioConfig) => void;
}

export const ExportPublishModal: React.FC<ExportPublishModalProps> = ({
  isOpen,
  onClose,
  config,
  onImportConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadHtml = () => {
    const html = generateStandalonePortfolioHtml(config);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = config.identity.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `${slug || 'portfolio'}-standalone.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = config.identity.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `${slug || 'portfolio'}-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = async () => {
    const json = JSON.stringify(config, null, 2);
    await navigator.clipboard.writeText(json);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyHtml = async () => {
    const html = generateStandalonePortfolioHtml(config);
    await navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleApplyImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    setImportSuccess(false);

    const result = parseImportedPortfolioJson(importText);
    if (result.error || !result.config) {
      setImportError(result.error || 'Invalid configuration JSON.');
      return;
    }

    onImportConfig(result.config);
    setImportSuccess(true);
    setImportText('');
    setTimeout(() => {
      setImportSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white text-zinc-900 border border-zinc-200 p-6 md:p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div>
            <h2 id="export-modal-title" className="text-xl font-bold tracking-tight">
              Export & Manage Portfolio Configuration
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Download a deploy-ready standalone HTML file or back up your JSON schema.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg my-5 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'export'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Export & Download
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'import'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Import JSON Schema
          </button>
        </div>

        {activeTab === 'export' ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileCode className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Standalone HTML Bundle (.html)
                  </h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Self-contained single-file website with embedded theme tokens, responsive grid, and zero external dependencies.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHtml ? 'Copied HTML' : 'Copy HTML'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadHtml}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download HTML</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileJson className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Portfolio Configuration Schema (.json)
                  </h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Save your complete identity, theme settings, projects, and timeline to restore or version-control anytime.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-900 bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleApplyImport} className="space-y-4">
            <div>
              <label
                htmlFor="import-json-textarea"
                className="block text-xs font-semibold text-zinc-700 mb-1.5"
              >
                Paste Portfolio Configuration JSON
              </label>
              <textarea
                id="import-json-textarea"
                rows={7}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"identity": {"fullName": "..."}, "design": {...}, "projects": [...]}'
                className="w-full rounded-xl border border-zinc-300 p-3 text-xs font-mono-jetbrains text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            {importError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium" role="alert">
                {importError}
              </div>
            )}

            {importSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium" role="status">
                Configuration imported and applied to live canvas.
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Apply Configuration</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
