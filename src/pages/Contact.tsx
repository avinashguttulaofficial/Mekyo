import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, Building, Sparkles } from 'lucide-react';
import * as api from '../lib/api';
import { useMarketplace } from '../context/MarketplaceContext';

export const Contact: React.FC = () => {
  const { showToast } = useMarketplace();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('Custom Prompt Licensing');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    await api.submitContactMessage({
      name,
      email,
      company,
      project_type: projectType,
      message,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Message sent! Our editorial director will contact you soon.', 'success');
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 pb-24">
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Agency & Enterprise
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
          Let's build something together.
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Need custom commercial prompt pipelines, dedicated AI model calibrations, or enterprise studio licenses? Reach out directly.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-[#E7E7E3] rounded-3xl p-6 sm:p-10 shadow-xs">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Message Received</h3>
            <p className="text-xs text-[#666666] max-w-sm mx-auto leading-relaxed">
              Thank you for reaching out, {name}. Your inquiry has been routed to our admin inbox. We will get back to you at {email}.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setCompany('');
                setMessage('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#111111] bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                  Company / Agency
                </label>
                <input
                  type="text"
                  placeholder="Studio or Organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  <option>Custom Prompt Licensing</option>
                  <option>Enterprise Team Seat</option>
                  <option>Private AI Model Tuning</option>
                  <option>Commercial Advertising Campaign</option>
                  <option>General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                Project Details / Message *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tell us about the assets, models, or scale you are aiming to deploy..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isSubmitting ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
