import React, { useState } from 'react';
import { User, Mail, Calendar, Sparkles, Check, Camera, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';

export const Profile: React.FC = () => {
  const { user, updateProfile, isPro } = useAuth();
  const { showToast, purchases, favorites } = useMarketplace();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
    });
    setIsSaving(false);
    showToast('Profile details updated successfully', 'success');
  };

  const handleAvatarRoll = () => {
    const seeds = ['Aero', 'Luna', 'Vesper', 'Sora', 'Felix', 'Nova', 'Kai'];
    const random = seeds[Math.floor(Math.random() * seeds.length)];
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${random}_${Date.now()}`;
    setAvatarUrl(newAvatar);
  };

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'February 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Heading */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Account Settings
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111111]">
          Personal Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#666666]">
          Manage your personal details, avatar, and active subscription tier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: Avatar & Badge */}
        <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 text-center space-y-4 shadow-xs">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
              alt={fullName}
              className="w-full h-full rounded-full bg-neutral-100 object-cover border-2 border-[#E7E7E3]"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={handleAvatarRoll}
              title="Generate new avatar"
              className="absolute bottom-0 right-0 p-2 bg-[#111111] text-white rounded-full hover:bg-black transition-colors cursor-pointer shadow-md"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h3 className="font-bold text-base text-[#111111]">{fullName || 'Creator'}</h3>
            <p className="text-xs text-[#8A8A8A] font-mono">{user?.email}</p>
          </div>

          <div className="pt-2 border-t border-[#E7E7E3] flex items-center justify-center gap-2">
            <span className="text-xs text-[#666666]">Plan:</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold capitalize bg-neutral-100 text-[#111111] px-2.5 py-0.5 rounded">
              {user?.plan || 'Free'}
              {isPro && <Sparkles className="w-3 h-3 text-[#B8FF3D] fill-current" />}
            </span>
          </div>

          <div className="text-[11px] text-[#8A8A8A] flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {/* Right Col: Edit Form */}
        <div className="md:col-span-2 bg-white border border-[#E7E7E3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-100 border border-[#E7E7E3] rounded-xl text-[#8A8A8A] cursor-not-allowed"
              />
              <span className="text-[11px] text-[#8A8A8A] mt-1 block">
                Email address is managed by Supabase authentication.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                Custom Avatar Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-5 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Account Overview Summary */}
          <div className="pt-6 border-t border-[#E7E7E3] grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60">
              <span className="text-[11px] text-[#8A8A8A] uppercase font-mono">Licenses Owned</span>
              <span className="text-xl font-bold tabular-nums text-[#111111] block mt-1">
                {purchases.length}
              </span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60">
              <span className="text-[11px] text-[#8A8A8A] uppercase font-mono">Bookmarked</span>
              <span className="text-xl font-bold tabular-nums text-[#111111] block mt-1">
                {favorites.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
