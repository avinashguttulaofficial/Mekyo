import React, { useState } from 'react';
import { Save, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import * as api from '../../lib/api';
import { SiteSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSettings, showToast } = useMarketplace();

  const [siteName, setSiteName] = useState(siteSettings.site_name);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [proPrice, setProPrice] = useState(siteSettings.pro_monthly_price);
  const [currency, setCurrency] = useState(siteSettings.currency);
  const [razorpayKey, setRazorpayKey] = useState(siteSettings.razorpay_key_id);
  const [contactEmail, setContactEmail] = useState(siteSettings.contact_email);
  const [twitterUrl, setTwitterUrl] = useState(siteSettings.twitter_url || '');
  const [githubUrl, setGithubUrl] = useState(siteSettings.github_url || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings({
      site_name: siteName,
      tagline: tagline,
      pro_monthly_price: Number(proPrice),
      currency: currency,
      razorpay_key_id: razorpayKey,
      contact_email: contactEmail,
      twitter_url: twitterUrl,
      github_url: githubUrl,
    });
    setIsSaving(false);
    showToast('Platform settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Configuration
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          System Settings & Monetization
        </h1>
        <p className="text-xs text-[#666666]">
          Configure subscription pricing, payment keys, branding, and platform metadata.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding */}
        <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
            Platform Branding & Copy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Site Brand Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Monetization */}
        <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Pro Tier Pricing & Currency
            </h2>
            <span className="text-[11px] font-mono text-[#8A8A8A]">No hardcoded prices</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Mekyo Pro Monthly Price ($ USD)
              </label>
              <input
                type="number"
                step="1"
                value={proPrice}
                onChange={(e) => setProPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
              <span className="text-[11px] text-[#8A8A8A] mt-1 block">
                Directly sets the price billed on the pricing card and Razorpay subscription.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Store Base Currency
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* Payment Integration */}
        <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
            Razorpay Integration Keys
          </h2>
          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1">
              Razorpay Public Key ID
            </label>
            <input
              type="text"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
            />
            <span className="text-[11px] text-[#8A8A8A] mt-1 block">
              Used to initiate checkout orders and verify server-side cryptographic payment signatures.
            </span>
          </div>
        </div>

        {/* Support & Social Links */}
        <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
            Contact & Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Twitter / X URL
              </label>
              <input
                type="text"
                placeholder="https://x.com/..."
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </form>
    </div>
  );
};
