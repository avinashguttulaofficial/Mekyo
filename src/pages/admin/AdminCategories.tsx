import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import * as api from '../../lib/api';
import { Category } from '../../types';
import { CategoryBadge } from '../../components/marketplace/CategoryBadge';

export const AdminCategories: React.FC = () => {
  const { categories, prompts, refreshData, showToast } = useMarketplace();

  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#B8FF3D');
  const [icon, setIcon] = useState('Sparkles');

  const handleOpenNew = () => {
    setEditingCat({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      accent_color: '#B8FF3D',
      icon: 'Sparkles',
      order: categories.length + 1,
      status: 'active',
      created_at: new Date().toISOString(),
    });
    setName('');
    setSlug('');
    setDescription('');
    setAccentColor('#B8FF3D');
    setIcon('Sparkles');
  };

  const handleEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setAccentColor(cat.accent_color || '#B8FF3D');
    setIcon(cat.icon || 'Sparkles');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    const record: Category = {
      id: editingCat?.id || `cat-${Date.now()}`,
      name,
      slug,
      description,
      accent_color: accentColor,
      icon,
      order: editingCat?.order || categories.length + 1,
      status: 'active',
      created_at: editingCat?.created_at || new Date().toISOString(),
    };

    api.saveCategory(record);
    refreshData();
    showToast(`Saved category "${name}"`, 'success');
    setEditingCat(null);
  };

  const handleDelete = (cat: Category) => {
    const associated = prompts.filter((p) => p.category_id === cat.id);
    if (associated.length > 0) {
      alert(
        `Cannot delete "${cat.name}" because it currently has ${associated.length} prompts assigned to it. Reassign those prompts first.`
      );
      return;
    }
    if (confirm(`Delete category "${cat.name}"?`)) {
      api.deleteCategory(cat.id);
      refreshData();
      showToast(`Deleted category "${cat.name}"`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Taxonomy Architecture
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Categories ({categories.length})
          </h1>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Category</span>
        </button>
      </div>

      {editingCat && (
        <form
          onSubmit={handleSave}
          className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl"
        >
          <h3 className="font-bold text-sm text-[#111111]">
            {editingCat.name ? `Edit Category: ${editingCat.name}` : 'New Category'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCat.slug) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#666666] mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border border-[#E7E7E3] cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Preview Badge</label>
              <div className="pt-2">
                <CategoryBadge name={name || 'Category'} color={accentColor} size="md" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingCat(null)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-lg cursor-pointer shadow-xs"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-[#E7E7E3] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#8A8A8A] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-3 font-semibold">Slug</th>
              <th className="py-3 px-3 font-semibold">Description</th>
              <th className="py-3 px-3 font-semibold">Linked Prompts</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E7E3]">
            {categories.map((cat) => {
              const count = prompts.filter((p) => p.category_id === cat.id).length;
              return (
                <tr key={cat.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <CategoryBadge name={cat.name} color={cat.accent_color} />
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-500">{cat.slug}</td>
                  <td className="py-3 px-3 text-neutral-600 max-w-sm truncate">
                    {cat.description || '-'}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold tabular-nums text-neutral-900">
                    {count} {count === 1 ? 'prompt' : 'prompts'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
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
  );
};
