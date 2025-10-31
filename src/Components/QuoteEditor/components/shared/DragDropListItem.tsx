import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import clsx from 'clsx';

interface DragDropListItemProps {
  index: number;
  type: string;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (index: number) => void;
  readonly?: boolean;
  children: React.ReactNode;
  className?: string;
  printMode?: boolean;
}

export const DragDropListItem: React.FC<DragDropListItemProps> = ({
  index,
  type,
  onReorder,
  onRemove,
  readonly = false,
  children,
  className = '',
  printMode = false
}) => {
  const { handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop(!readonly);

  if (printMode) {
    return (
      <div className={clsx('tw-flex tw-items-center tw-py-[0.4rem] tw-min-h-[1.5rem] print:tw-py-2', className)}>
        <div className="tw-flex-1">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'tw-flex tw-items-center tw-gap-2 tw-py-[0.4rem] tw-px-1 tw-rounded tw-transition-all tw-duration-150 tw-ease-out tw-min-h-[2.2rem]',
        'hover:tw-bg-hover hover:tw--mx-[0.4rem] hover:tw-px-[0.4rem] hover:tw-translate-x-[2px]',
        'hover:[&>button]:tw-opacity-100 hover:[&>button]:tw-scale-100',
        '[&.dragOver]:tw-bg-primary/10 [&.dragOver]:tw-border-primary [&.dragOver]:tw-scale-[1.01] [&.dragOver]:tw-shadow-primary-lg',
        '[&.dragging]:tw-opacity-60 [&.dragging]:tw-rotate-1 [&.dragging]:tw-scale-[0.98] [&.dragging]:tw-shadow-xl',
        'max-md:tw-flex-wrap max-md:tw-min-h-[2rem] max-md:tw-py-[0.3rem] max-md:tw-px-[0.2rem]',
        'print:tw-hidden',
        className
      )}
      draggable={!readonly}
      onDragStart={(e) => handleDragStart(e, index, type)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, index, onReorder)}
    >
      {!readonly && (
        <div className="tw-cursor-grab tw-text-slate-300 tw-p-[0.15rem] tw-transition-all tw-duration-200 tw-ease-out tw-rounded tw-flex tw-items-center tw-justify-center hover:tw-text-primary hover:tw-bg-primary/10 hover:tw-scale-110 active:tw-cursor-grabbing max-md:tw-order-[-1] max-md:tw-p-[0.1rem]">
          <GripVertical size={14} className="tw-flex-shrink-0 max-md:tw-w-3 max-md:tw-h-3" />
        </div>
      )}

      <div className="tw-flex-1 tw-min-h-[1.5rem] tw-flex tw-items-center">
        {children}
      </div>

      {!readonly && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="tw-inline-flex tw-items-center tw-justify-center tw-w-7 tw-h-7 tw-p-0 tw-border tw-border-danger-light tw-rounded-md tw-bg-gradient-to-br tw-from-danger-lighter tw-to-danger-light tw-text-danger tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-out tw-opacity-70 tw-scale-[0.92] tw-shadow-danger-sm hover:tw-opacity-100 hover:tw-scale-105 hover:tw-bg-gradient-to-br hover:tw-from-danger hover:tw-to-danger-dark hover:tw-border-danger-dark hover:tw-text-white hover:tw-shadow-danger-md active:tw-scale-[0.98] active:tw-shadow-sm max-md:tw-w-6 max-md:tw-h-6"
          title="Supprimer"
        >
          <Trash2 size={14} className="tw-flex-shrink-0 max-md:tw-w-3 max-md:tw-h-3" />
        </button>
      )}
    </div>
  );
};