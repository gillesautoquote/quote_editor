import React from 'react';
import { Plus } from 'lucide-react';
import { EditableField } from '../../EditableField/EditableField';
import type { OptionBlock, SelectDefinition } from '../../../entities/QuoteData';

interface OptionBlockHeaderProps {
  block: OptionBlock;
  selectDefinitions: Record<string, SelectDefinition>;
  onTitleUpdate: (title: string) => void;
  onAddRow: () => void;
  onAddRowOfType: (lineType: string) => void;
  mainColor?: string;
  readonly?: boolean;
  printMode?: boolean;
}

export const OptionBlockHeader: React.FC<OptionBlockHeaderProps> = ({
  block,
  selectDefinitions,
  onTitleUpdate,
  onAddRow,
  onAddRowOfType,
  mainColor = '#0066cc',
  readonly = false,
  printMode = false
}) => {
  const textColor = getContrastColor(mainColor);
  const darkerColor = getDarkerVariant(mainColor, 0.8);
  const allowedLineTypes = Object.entries(selectDefinitions).filter(([_, definition]) =>
    definition.allowedBlocks.includes(block.id)
  );

  if (block.showTitle === false) {
    if (readonly || printMode) return null;

    return (
      <div className="tw-flex tw-gap-2 tw-p-3 tw-bg-surface-gray-50 tw-border-b tw-border-border print:tw-hidden">
        {block.type === 'list' && allowedLineTypes.map(([typeKey, definition]) => (
          <button
            key={typeKey}
            type="button"
            onClick={() => onAddRowOfType(typeKey)}
            className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200"
            style={{ backgroundColor: mainColor, color: textColor, borderColor: mainColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkerColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = mainColor;
            }}
            title={`Ajouter une ligne ${definition.title.toLowerCase()}`}
          >
            <Plus size={12} />
            {definition.title}
          </button>
        ))}

        {block.type === 'list' && (
          <button
            type="button"
            onClick={onAddRow}
            className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200"
            style={{ backgroundColor: mainColor, color: textColor, borderColor: mainColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkerColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = mainColor;
            }}
            title="Ajouter une ligne simple"
          >
            <Plus size={12} />
            Ligne
          </button>
        )}

        {block.type === 'notes' && (
          <button
            type="button"
            onClick={onAddRow}
            className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200"
            style={{ backgroundColor: mainColor, color: textColor, borderColor: mainColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkerColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = mainColor;
            }}
            title="Ajouter une note"
          >
            <Plus size={12} />
            Note
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={printMode ? 'tw-pb-1' : 'tw-flex tw-items-center tw-justify-between tw-gap-3 tw-p-3 tw-bg-surface-gray-50 tw-border-b tw-border-border print:tw-bg-transparent print:tw-border-none print:tw-p-0 print:tw-pb-1'}>
      <EditableField
        value={block.title}
        onSave={onTitleUpdate}
        disabled={readonly}
        printMode={printMode}
        as="h4"
        className={printMode ? 'tw-text-sm tw-font-semibold' : 'tw-text-base tw-font-semibold print:tw-text-sm print:tw-font-semibold'}
        style={{ color: mainColor }}
      />
      {!readonly && !printMode && (
        <div className="tw-flex tw-gap-2">
          {block.type === 'list' && allowedLineTypes.map(([typeKey, definition]) => (
            <button
              key={typeKey}
              type="button"
              onClick={() => onAddRowOfType(typeKey)}
              className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200"
            style={{ backgroundColor: mainColor, color: textColor, borderColor: mainColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkerColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = mainColor;
            }}
              title={`Ajouter une ligne ${definition.title.toLowerCase()}`}
            >
              <Plus size={12} />
              {definition.title}
            </button>
          ))}

          {block.type === 'list' && (
            <button
              type="button"
              onClick={onAddRow}
              className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200"
            style={{ backgroundColor: mainColor, color: textColor, borderColor: mainColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkerColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = mainColor;
            }}
              title="Ajouter une ligne simple"
            >
              <Plus size={12} />
              Ligne
            </button>
          )}

          {block.type === 'notes' && (
            <button
              type="button"
              onClick={onAddRow}
              className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200"
            style={{ backgroundColor: mainColor, color: textColor, borderColor: mainColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkerColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = mainColor;
            }}
              title="Ajouter une note"
            >
              <Plus size={12} />
              Note
            </button>
          )}
        </div>
      )}
    </div>
  );
};

function getContrastColor(backgroundColor: string): 'white' | 'black' {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return 'white';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

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
