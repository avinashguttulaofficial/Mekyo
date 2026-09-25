import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import * as api from '../../lib/api';
import { Prompt } from '../../types';

interface AdminPromptsProps {
  onEditPrompt: (prompt: Prompt) => void;
  onCreateNew: () => void;
  onViewPrompt: (prompt: Prompt) => void;
}

export const AdminPrompts: React.FC<AdminPromptsProps> = ({
  onEditPrompt,
  onCreateNew,
  onViewPrompt,
}) => {
  const { prompts, categories, refreshData, showToast } = useMarketplace();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.ai_tool.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (typeFilter !== 'all' && p.access_type !== typeFilter) return false;
      return true;
    });
  }, [prompts, search, statusFilter, typeFilter]);

  const handleTogglePublish = (p: Prompt) => {
    const nextStatus = p.status === 'published' ? 'draft' : 'published';
    api.savePrompt({ ...p, status: nextStatus });
    refreshData();
    showToast(
      nextStatus === 'published' ? `Published "${p.title}"` : `Unpublished "${p.title}" to draft`,
      'info'
    );
  };

  const handleDuplicate = (p: Prompt) => {
    const duplicated: Prompt = {
      ...p,
      id: `p-${Date.now()}`,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      views: 0,
      sales_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    api.savePrompt(duplicated);
    refreshData();
    showToast(`Duplicated prompt into drafts`, 'success');
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete prompt "${title}"?`)) {
      api.deletePrompt(id);
      refreshData();
      showToast('Prompt deleted from catalog', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Catalog Management
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            All Prompts ({prompts.length})
          </h1>
        </div>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Prompt</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-xl border border-[#E7E7E3]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prompt title, engine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-[#111111] focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-[#111111] focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="pro">Pro</option>
          </select>
        </div>
      </div>

      {/* Prompts Table */}
      <div className="bg-white border border-[#E7E7E3] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#8A8A8A] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Title & Engine</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-3 font-semibold">Price</th>
                <th className="py-3 px-3 font-semibold">Views</th>
                <th className="py-3 px-3 font-semibold">Sales</th>
                <th className="py-3 px-3 font-semibold">Rating</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7E3]">
              {filtered.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                return (
                  <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Title + Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        <img
                          src={p.cover_image_url}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0 border border-[#E7E7E3]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <p className="font-semibold text-neutral-900 truncate">{p.title}</p>
                          <span className="text-[11px] text-[#8A8A8A] font-mono">{p.model}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-neutral-700 whitespace-nowrap">
                      {cat?.name || 'Unassigned'}
                    </td>

                    {/* Access Type */}
                    <td className="py-3 px-3 uppercase font-mono text-[10px] whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          p.access_type === 'free'
                            ? 'bg-neutral-100 text-neutral-800'
                            : p.access_type === 'pro'
                            ? 'bg-[#111111] text-white'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {p.access_type}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 font-bold tabular-nums text-neutral-900 whitespace-nowrap">
                      {p.price === 0 ? 'Free' : `$${p.price.toFixed(2)}`}
                    </td>

                    {/* Views */}
                    <td className="py-3 px-3 tabular-nums text-neutral-600 font-mono">
                      {p.views || 0}
                    </td>

                    {/* Sales */}
                    <td className="py-3 px-3 tabular-nums font-semibold text-neutral-900 font-mono">
                      {p.sales_count || 0}
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-3 tabular-nums text-amber-600 font-semibold font-mono">
                      ★ {p.rating > 0 ? p.rating.toFixed(1) : '-'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onViewPrompt(p)}
                          title="View live page"
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditPrompt(p)}
                          title="Edit prompt"
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(p)}
                          title={p.status === 'published' ? 'Unpublish to draft' : 'Publish live'}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          {p.status === 'published' ? (
                            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDuplicate(p)}
                          title="Duplicate prompt"
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          title="Delete prompt"
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
