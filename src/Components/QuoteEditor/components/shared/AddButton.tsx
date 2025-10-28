import React from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

interface AddButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  children,
  title,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = size === 'sm'
    ? 'tw-text-[0.65rem] tw-py-[0.2rem] tw-px-[0.4rem]'
    : 'tw-text-[0.7rem] tw-py-[0.25rem] tw-px-2';

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'tw-inline-flex tw-items-center tw-justify-center tw-gap-1.5 tw-font-medium tw-rounded-[5px]',
        'tw-border tw-border-primary tw-bg-gradient-to-br tw-from-white tw-to-gray-50',
        'tw-text-primary tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-out',
        'tw-shadow-primary-sm',
        'hover:tw-bg-gradient-to-br hover:tw-from-primary hover:tw-to-primary-dark hover:tw-text-white',
        'hover:tw-translate-y-[-1px] hover:tw-scale-[1.02] hover:tw-shadow-primary-md',
        'active:tw-translate-y-0 active:tw-scale-[0.98]',
        sizeClasses,
        className
      )}
      title={title}
    >
      <Plus size={size === 'sm' ? 10 : 12} className="tw-flex-shrink-0" />
      {children}
    </button>
  );
};