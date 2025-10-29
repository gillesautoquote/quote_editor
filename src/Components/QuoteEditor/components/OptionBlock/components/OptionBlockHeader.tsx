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
  readonly?: boolean;
  printMode?: boolean;
}

export const OptionBlockHeader: React.FC<OptionBlockHeaderProps> = ({
  block,
  selectDefinitions,
  onTitleUpdate,
  onAddRow,
  onAddRowOfType,
  readonly = false,
  printMode = false
}) => {
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
            className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-text-white tw-bg-primary tw-border tw-border-primary tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-primary-dark hover:tw-shadow-primary"
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
            className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-text-white tw-bg-primary tw-border tw-border-primary tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-primary-dark hover:tw-shadow-primary"
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
            className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-text-white tw-bg-primary tw-border tw-border-primary tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-primary-dark hover:tw-shadow-primary"
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
    <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-p-3 tw-bg-surface-gray-50 tw-border-b tw-border-border">
      <EditableField
        value={block.title}
        onSave={onTitleUpdate}
        disabled={readonly}
        printMode={printMode}
        as="h4"
        className="tw-text-base tw-font-semibold tw-text-primary"
      />
      {!readonly && !printMode && (
        <div className="tw-flex tw-gap-2">
          {block.type === 'list' && allowedLineTypes.map(([typeKey, definition]) => (
            <button
              key={typeKey}
              type="button"
              onClick={() => onAddRowOfType(typeKey)}
              className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-text-white tw-bg-primary tw-border tw-border-primary tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-primary-dark hover:tw-shadow-primary"
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
              className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-text-white tw-bg-primary tw-border tw-border-primary tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-primary-dark hover:tw-shadow-primary"
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
              className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-xs tw-font-medium tw-text-white tw-bg-primary tw-border tw-border-primary tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-primary-dark hover:tw-shadow-primary"
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
