import React, { useState } from 'react';
import { Copy, Check, Info, Sliders, AlertCircle, Sparkles } from 'lucide-react';
import { Prompt } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';

interface PromptViewerProps {
  prompt: Prompt;
}

export const PromptViewer: React.FC<PromptViewerProps> = ({ prompt }) => {
  const { showToast } = useMarketplace();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.full_prompt);
      setCopiedPrompt(true);
      showToast('Prompt copied to clipboard!', 'success');
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      showToast('Failed to copy prompt', 'error');
    }
  };

  const handleCopyNegative = async () => {
    if (!prompt.negative_prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.negative_prompt);
      setCopiedNegative(true);
      showToast('Negative prompt copied!', 'success');
      setTimeout(() => setCopiedNegative(false), 2000);
    } catch {
      showToast('Failed to copy negative prompt', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Full Prompt Box */}
      <div className="bg-white border border-[#E7E7E3] rounded-xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-50/80 border-b border-[#E7E7E3]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]">
            <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
            <span>Master Prompt</span>
          </div>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#111111] hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#B8FF3D]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
        <div className="p-5 font-mono text-sm leading-relaxed text-neutral-900 bg-white select-all overflow-x-auto whitespace-pre-wrap">
          {prompt.full_prompt}
        </div>
      </div>

      {/* Negative Prompt (if exists) */}
      {prompt.negative_prompt && (
        <div className="bg-white border border-[#E7E7E3] rounded-xl overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-5 py-3 bg-neutral-50/80 border-b border-[#E7E7E3]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#666666]">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />
              <span>Negative Prompt / Exclusions</span>
            </div>
            <button
              type="button"
              onClick={handleCopyNegative}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              {copiedNegative ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 font-mono text-xs leading-relaxed text-[#666666] bg-white select-all whitespace-pre-wrap">
            {prompt.negative_prompt}
          </div>
        </div>
      )}

      {/* Recommended Settings Grid */}
      {prompt.recommended_settings && (
        <div className="bg-white border border-[#E7E7E3] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] mb-4">
            <Sliders className="w-3.5 h-3.5 text-neutral-800" />
            <span>Recommended Parameters</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60">
              <span className="text-[#8A8A8A] block mb-1">Target Engine</span>
              <span className="font-semibold text-[#111111]">{prompt.model}</span>
            </div>
            {prompt.recommended_settings.aspect_ratio && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60">
                <span className="text-[#8A8A8A] block mb-1">Aspect Ratio</span>
                <span className="font-semibold text-[#111111]">
                  {prompt.recommended_settings.aspect_ratio}
                </span>
              </div>
            )}
            {prompt.recommended_settings.stylize && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60">
                <span className="text-[#8A8A8A] block mb-1">Stylize / Mode</span>
                <span className="font-semibold text-[#111111]">
                  {prompt.recommended_settings.stylize}
                </span>
              </div>
            )}
            {prompt.recommended_settings.sampling_steps && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60">
                <span className="text-[#8A8A8A] block mb-1">Sampling Steps</span>
                <span className="font-semibold tabular-nums text-[#111111]">
                  {prompt.recommended_settings.sampling_steps}
                </span>
              </div>
            )}
            {prompt.recommended_settings.cfg_scale && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60">
                <span className="text-[#8A8A8A] block mb-1">CFG Scale</span>
                <span className="font-semibold tabular-nums text-[#111111]">
                  {prompt.recommended_settings.cfg_scale}
                </span>
              </div>
            )}
            {prompt.recommended_settings.camera && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60 col-span-2">
                <span className="text-[#8A8A8A] block mb-1">Camera & Lens</span>
                <span className="font-semibold text-[#111111]">
                  {prompt.recommended_settings.camera}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      {prompt.instructions && (
        <div className="bg-white border border-[#E7E7E3] rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] mb-3">
            <Info className="w-3.5 h-3.5 text-neutral-800" />
            <span>Usage & Variable Substitution</span>
          </div>
          <div className="text-xs sm:text-sm text-[#444444] whitespace-pre-line leading-relaxed">
            {prompt.instructions}
          </div>
        </div>
      )}
    </div>
  );
};
