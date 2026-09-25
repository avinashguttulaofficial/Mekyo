import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#111111] text-[#8A8A8A] pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Col 1: Brand Wordmark & Concept */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xl font-bold tracking-tight text-white">MEKYO</span>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Premium marketplace for verified AI prompts. Watch real video demonstrations of what each prompt produces, access free prompts, and acquire commercial production licenses.
            </p>
            <p className="text-[11px] text-neutral-500">
              Curated and verified exclusively by Mekyo Editorial.
            </p>
          </div>

          {/* Col 2: Marketplace */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
              Marketplace
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Prompts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/categories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/explore?price=free')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Free Prompts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pro Membership
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Engines */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
              Supported Engines
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/explore?tool=Flux')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Flux 1.1 Pro
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/explore?tool=Midjourney')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Midjourney v6.1
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/explore?tool=Sora')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  OpenAI Sora Video
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/explore?tool=Claude')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Claude 3.5 Sonnet
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
              Legal & Support
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Licensing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <span>&copy; {new Date().getFullYear()} Mekyo. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span className="tabular-nums">Curated Prompt Library</span>
            <span>·</span>
            <span>Razorpay Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
