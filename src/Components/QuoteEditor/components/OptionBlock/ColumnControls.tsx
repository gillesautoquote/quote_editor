import React from 'react';
import { ArrowLeftRight, Minus, Plus, GripVertical, X, Palette } from 'lucide-react';
import clsx from 'clsx';

interface ColumnControlsProps {
  columns: number;
  onChange: (columns: number) => void;
  onRemoveBlock?: () => void;
  color?: string;
  onColorChange?: (color: string) => void;
  readonly?: boolean;
  isDraggable?: boolean;
}

export const ColumnControls: React.FC<ColumnControlsProps> = ({
  columns,
  onChange,
  onRemoveBlock,
  color,
  onColorChange,
  readonly = false,
  isDraggable = false
}) => {
  if (readonly) return null;

  const allowedModes = [2, 3, 4, 6];
  const currentIndex = allowedModes.indexOf(columns);

  const handleDecrease = () => {
    if (currentIndex > 0) {
      onChange(allowedModes[currentIndex - 1]);
    }
  };

  const handleIncrease = () => {
    if (currentIndex < allowedModes.length - 1) {
      onChange(allowedModes[currentIndex + 1]);
    }
  };

  const getWidthLabel = (cols: number): string => {
    switch (cols) {
      case 2: return 'Tiers';
      case 3: return 'Demie';
      case 4: return 'Deux tiers';
      case 6: return 'Pleine largeur';
      default: return 'Tiers';
    }
  };

  const handleColorClick = () => {
    if (!onColorChange) return;

    const colors = [
      'var(--color-primary)',
      '#28a745',
      '#dc3545',
      '#ffc107',
      '#6f42c1',
      '#fd7e14',
      '#20c997',
      '#e83e8c',
      '#6c757d',
      '#343a40'
    ];

    const currentIndex = colors.indexOf(color);
    const nextIndex = (currentIndex + 1) % colors.length;
    onColorChange(colors[nextIndex]);
  };

  return (
    <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-py-1 tw-px-2 qe-bg-surface-gray-50 tw-border qe-border-border-light tw-rounded tw-mb-2">
      {/* Zone gauche: Drag handle */}
      <div className="tw-flex tw-items-center">
        {isDraggable && (
          <div className="tw-cursor-grab qe-text-text-muted tw-transition-colors hover:qe-text-primary active:tw-cursor-grabbing" title="Glisser pour réorganiser">
            <GripVertical size={12} />
          </div>
        )}
      </div>

      {/* Zone centre: Contrôles de largeur */}
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-flex tw-items-center tw-gap-1.5 qe-button-text-md qe-text-text-muted">
          <ArrowLeftRight size={12} />
          <span className="tw-font-medium">{getWidthLabel(columns)}</span>
        </div>

        <div className="tw-flex tw-items-center tw-gap-1.5">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={currentIndex <= 0}
            className={clsx(
              'tw-inline-flex tw-items-center tw-justify-center tw-w-7 tw-h-7 tw-p-0 tw-border qe-border-primary/30 tw-rounded tw-bg-white qe-text-primary tw-cursor-pointer tw-transition-all tw-duration-200',
              'hover:qe-bg-primary/10 hover:qe-border-primary hover:tw-scale-105',
              'disabled:tw-opacity-30 disabled:tw-cursor-not-allowed disabled:hover:tw-bg-white disabled:hover:qe-border-primary/30 disabled:hover:tw-scale-100'
            )}
            title="Réduire la largeur"
          >
            <Minus size={14} />
          </button>

          <span className="tw-flex tw-items-center tw-gap-[2px]">
            {allowedModes.map((mode) => (
              <span
                key={mode}
                className={clsx(
                  'tw-w-[3px] tw-h-3 tw-rounded-full tw-transition-all tw-duration-200',
                  mode === columns ? 'qe-bg-primary' : 'tw-bg-border'
                )}
              />
            ))}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={currentIndex >= allowedModes.length - 1}
            className={clsx(
              'tw-inline-flex tw-items-center tw-justify-center tw-w-7 tw-h-7 tw-p-0 tw-border qe-border-primary/30 tw-rounded tw-bg-white qe-text-primary tw-cursor-pointer tw-transition-all tw-duration-200',
              'hover:qe-bg-primary/10 hover:qe-border-primary hover:tw-scale-105',
              'disabled:tw-opacity-30 disabled:tw-cursor-not-allowed disabled:hover:tw-bg-white disabled:hover:qe-border-primary/30 disabled:hover:tw-scale-100'
            )}
            title="Augmenter la largeur"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Zone droite: Suppression */}
      <div className="tw-flex tw-items-center tw-gap-1.5">
        {onColorChange && (
          <button
            type="button"
            onClick={handleColorClick}
            className="tw-inline-flex tw-items-center tw-justify-center tw-w-7 tw-h-7 tw-p-0 tw-border qe-border-border tw-rounded tw-bg-white tw-cursor-pointer tw-transition-all tw-duration-200 hover:qe-border-primary hover:tw-scale-105"
            title="Changer la couleur du bloc"
          >
            <div
              className="tw-w-3.5 tw-h-3.5 tw-rounded-full tw-border tw-border-white"
              style={{ backgroundColor: color }}
            />
          </button>
        )}
        {onRemoveBlock && (
          <button
            type="button"
            onClick={onRemoveBlock}
            className="tw-inline-flex tw-items-center tw-justify-center tw-w-7 tw-h-7 tw-p-0 tw-border qe-border-danger-light tw-rounded tw-bg-white qe-text-danger tw-cursor-pointer tw-transition-all tw-duration-200 hover:qe-bg-danger/10 hover:qe-border-danger hover:tw-scale-105"
            title="Supprimer ce bloc"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
