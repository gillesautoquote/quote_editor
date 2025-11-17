import React from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

interface AddButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  size?: 'sm' | 'md';
  mainColor?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  children,
  title,
  className = '',
  size = 'md',
  mainColor = '#0066cc'
}) => {
  const sizeClasses = size === 'sm' ? 'qe-btn-sm' : 'qe-btn-md';
  const iconSize = size === 'sm' ? 5 : 6;

  const darkerColor = getDarkerVariant(mainColor, 0.8);

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'tw-inline-flex tw-items-center tw-justify-center tw-gap-1.5 tw-font-medium tw-rounded-[5px]',
        'tw-border tw-bg-gradient-to-br tw-from-white tw-to-gray-50',
        'tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-out',
        'tw-shadow-primary-sm',
        'hover:tw-bg-gradient-to-br hover:tw-text-white',
        'hover:tw-translate-y-[-1px] hover:tw-scale-[1.02] hover:tw-shadow-primary-md',
        'active:tw-translate-y-0 active:tw-scale-[0.98]',
        sizeClasses,
        className
      )}
      style={{
        borderColor: mainColor,
        color: mainColor,
        ['--hover-bg' as string]: `linear-gradient(to bottom right, ${mainColor}, ${darkerColor})`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `linear-gradient(to bottom right, ${mainColor}, ${darkerColor})`;
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(to bottom right, white, rgb(249, 250, 251))';
        e.currentTarget.style.color = mainColor;
      }}
      title={title}
    >
      <Plus size={iconSize} className="tw-flex-shrink-0" />
      {children}
    </button>
  );
};

function getDarkerVariant(hex: string, factor: number = 0.8): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#004499';

  const darker = {
    r: Math.round(rgb.r * factor),
    g: Math.round(rgb.g * factor),
    b: Math.round(rgb.b * factor)
  };

  return `#${darker.r.toString(16).padStart(2, '0')}${darker.g.toString(16).padStart(2, '0')}${darker.b.toString(16).padStart(2, '0')}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}