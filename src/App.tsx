/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sliders, Download } from 'lucide-react';
import { PortfolioConfig } from './types/portfolio';
import {
  getDefaultPortfolioConfig,
  parseImportedPortfolioJson,
} from './utils/portfolioLogic';
import { StudioConfigurator } from './components/StudioConfigurator';
import { PortfolioPreview } from './components/PortfolioPreview';
import { ExportPublishModal } from './components/ExportPublishModal';

const STORAGE_KEY = 'atelier_folio_config_v2';

export default function App() {
  const [config, setConfig] = useState<PortfolioConfig>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseImportedPortfolioJson(saved);
        if (parsed.config) {
          return parsed.config;
        }
      }
    } catch {
      // Fallback to default config if localStorage is unavailable
    }
    return getDefaultPortfolioConfig();
  });

  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage quota errors
    }
  }, [config]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-zinc-100 relative">
      {/* Left Studio Configurator Panel */}
      {isStudioOpen && (
        <StudioConfigurator
          config={config}
          onChange={setConfig}
          onOpenExport={() => setIsExportModalOpen(true)}
          onCollapse={() => setIsStudioOpen(false)}
        />
      )}

      {/* Floating Re-Open Studio Control when in Fullscreen Preview Mode */}
      {!isStudioOpen && (
        <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-lg hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Customize Portfolio</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white text-zinc-900 border border-zinc-200 text-xs font-semibold shadow-lg hover:bg-zinc-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export HTML</span>
          </button>
        </div>
      )}

      {/* Live Portfolio Canvas */}
      <PortfolioPreview config={config} />

      {/* Export & JSON Schema Modal */}
      <ExportPublishModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        config={config}
        onImportConfig={setConfig}
      />
    </div>
  );
}
