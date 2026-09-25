import React from 'react';

interface CategoryBadgeProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name, color = '#111111', size = 'sm' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium tracking-tight ${
        size === 'sm' ? 'text-xs text-[#666666]' : 'text-sm text-[#111111]'
      }`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span>{name}</span>
    </span>
  );
};
