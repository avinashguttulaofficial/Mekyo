import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-24">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Legal Framework
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] mt-2">
          Last updated: February 2026
        </p>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-[#444444] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">1. License Grant & Commercial Usage</h2>
          <p>
            Upon purchasing a prompt on Mekyo or acquiring it via an active Mekyo Pro subscription, you are granted a perpetual, worldwide, non-exclusive license to utilize the prompt syntax, camera parameters, and negative exclusion tokens to generate digital or print media for personal, commercial, and agency projects.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">2. Restrictions on Prompt Resale</h2>
          <p>
            You may not sub-license, resell, distribute as a raw prompt bundle, or publish verbatim prompt text on public repositories or competing prompt marketplace platforms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">3. Payments & Verification</h2>
          <p>
            All digital transactions are processed securely through Razorpay. Access to prompt syntax is verified on server-side cryptographic signatures. Given the instant accessibility of digital goods, sales are final once syntax is unlocked.
          </p>
        </section>
      </div>
    </div>
  );
};

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-24">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Data Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] mt-2">
          Last updated: February 2026
        </p>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-[#444444] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">1. Information We Collect</h2>
          <p>
            We collect your email address and profile name during authentication. When transactions occur, order references and payment identifiers are securely stored in our Supabase PostgreSQL database. We do not store raw credit card numbers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#111111]">2. How We Use Data</h2>
          <p>
            Your information is used strictly to grant authorized access to purchased digital licenses, maintain your favorites list, and notify you regarding subscription renewals.
          </p>
        </section>
      </div>
    </div>
  );
};
