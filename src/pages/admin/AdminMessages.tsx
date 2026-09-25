import React, { useState } from 'react';
import { Mail, Check, Archive, MessageSquare } from 'lucide-react';
import * as api from '../../lib/api';
import { ContactMessage } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AdminMessages: React.FC = () => {
  const { showToast } = useMarketplace();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeStatus, setActiveStatus] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await api.fetchMessages();
        setMessages(data || []);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, []);

  const handleUpdateStatus = (msg: ContactMessage, newStatus: any) => {
    api.updateMessageStatus(msg.id, newStatus);
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, status: newStatus } : m)));
    showToast(`Inquiry marked as ${newStatus}`, 'info');
  };

  const filtered = messages.filter((m) => {
    if (activeStatus === 'all') return true;
    return m.status === activeStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Inbound Communications
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Agency & Custom Licensing Inquiries ({messages.length})
          </h1>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1 bg-white border border-[#E7E7E3] p-1 rounded-xl text-xs">
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                activeStatus === st ? 'bg-[#111111] text-white' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E7E3] pb-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-[#111111]">{msg.name}</span>
                <span className="text-xs text-[#8A8A8A] font-mono">{msg.email}</span>
                {msg.company && (
                  <span className="text-[11px] bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-medium">
                    {msg.company}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#8A8A8A]">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    msg.status === 'new'
                      ? 'bg-blue-100 text-blue-800'
                      : msg.status === 'replied'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {msg.status}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#8A8A8A]">
              Project: <strong className="text-neutral-800">{msg.project_type}</strong>
            </div>

            <p className="text-xs sm:text-sm text-[#444444] whitespace-pre-wrap leading-relaxed">
              {msg.message}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E7E7E3]">
              {msg.status !== 'read' && (
                <button
                  onClick={() => handleUpdateStatus(msg, 'read')}
                  className="px-2.5 py-1 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer"
                >
                  Mark Read
                </button>
              )}
              {msg.status !== 'replied' && (
                <button
                  onClick={() => handleUpdateStatus(msg, 'replied')}
                  className="px-2.5 py-1 text-xs text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg cursor-pointer font-medium"
                >
                  Mark Replied
                </button>
              )}
              {msg.status !== 'archived' && (
                <button
                  onClick={() => handleUpdateStatus(msg, 'archived')}
                  className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  Archive
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white border border-[#E7E7E3] rounded-2xl text-xs text-[#8A8A8A]">
            No messages found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
