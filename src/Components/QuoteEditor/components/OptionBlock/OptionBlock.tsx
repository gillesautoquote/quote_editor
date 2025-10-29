import React from 'react';
import { useEffect } from 'react';
import type { OptionBlock as OptionBlockType, SelectDefinition } from '../../entities/QuoteData';
import { ColumnControls } from './ColumnControls';
import { OptionBlockHeader } from './components/OptionBlockHeader';
import { OptionBlockContent } from './components/OptionBlockContent';
import { createBlockHandlers } from './utils/blockHandlers';
import { createDragHandlers } from './utils/dragHandlers';
import { getBlockType } from '../../utils/blockUtils';
import { generateColorVariables } from '../../utils/colorUtils';

interface OptionBlockProps {
  block: OptionBlockType;
  blockIndex: number;
  onUpdateBlock: (block: OptionBlockType) => void;
  selectDefinitions: Record<string, SelectDefinition>;
  readonly?: boolean;
  showControls?: boolean;
  allowWidthControl?: boolean;
  companyColor?: string;
  printMode?: boolean;
  onDragStart?: (e: React.DragEvent, blockIndex: number) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, dropIndex: number) => void;
  onRemove?: () => void;
}

export const OptionBlock: React.FC<OptionBlockProps> = ({
  block,
  blockIndex,
  onUpdateBlock,
  selectDefinitions,
  readonly = false,
  showControls = false,
  allowWidthControl = true,
  companyColor = '#009955',
  printMode = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove
}) => {
  const blockType = getBlockType(block.title);
  const blockColor = block.color || companyColor;

  useEffect(() => {
    const blockElement = document.querySelector(`[data-block-id="${block.id}"]`) as HTMLElement;
    if (blockElement) {
      const colorVariables = generateColorVariables(blockColor);

      const isGrayColor = blockColor.toLowerCase() === '#f8f9fa' ||
                         blockColor.toLowerCase() === '#e9ecef' ||
                         blockColor.toLowerCase() === '#dee2e6';

      Object.entries(colorVariables).forEach(([property, value]) => {
        blockElement.style.setProperty(property.replace('dynamic', 'block'), value);
      });

      if (isGrayColor) {
        blockElement.style.setProperty('--block-header-bg', blockColor);
        blockElement.style.setProperty('--block-title-color', '#212529');
        blockElement.style.setProperty('--block-button-color', companyColor);
        blockElement.style.setProperty('--block-button-border', companyColor);
        blockElement.style.setProperty('--block-button-hover-bg', companyColor);
        blockElement.style.setProperty('--block-button-hover-color', 'white');
      } else {
        blockElement.style.setProperty('--block-header-bg', `linear-gradient(135deg, ${blockColor}15 0%, ${blockColor}25 100%)`);
        blockElement.style.setProperty('--block-title-color', blockColor);
        blockElement.style.setProperty('--block-button-color', blockColor);
        blockElement.style.setProperty('--block-button-border', blockColor);
        blockElement.style.setProperty('--block-button-hover-bg', blockColor);
        blockElement.style.setProperty('--block-button-hover-color', 'white');
      }

      if (isGrayColor) {
        blockElement.style.setProperty('--block-border-color', '#d1d5db');
        blockElement.style.setProperty('--block-border-width', '2px');
        blockElement.style.setProperty('--block-left-border-color', '#6b7280');
        blockElement.style.setProperty('--block-shadow', '0 2px 8px rgba(0, 0, 0, 0.08)');
      }
    }
  }, [block.id, blockColor]);

  const blockHandlers = createBlockHandlers(block, onUpdateBlock, selectDefinitions, readonly);
  const dragHandlers = createDragHandlers(block, blockIndex, onUpdateBlock, readonly);

  const handleRemoveBlock = (): void => {
    if (readonly || !onRemove) return;
    onRemove();
  };

  return (
    <div
      className="tw-mb-4 tw-border tw-border-border tw-rounded-lg tw-overflow-hidden tw-bg-white tw-shadow-sm tw-transition-all tw-duration-200 page-break-inside-avoid print:tw-shadow-none print:tw-border-none print:tw-rounded-none print:tw-mb-2 print:tw-bg-transparent"
      data-columns={block.columns || 1}
      data-type={blockType}
      data-block-id={block.id}
      data-color={blockColor}
      draggable={!readonly && !printMode && !!onDragStart}
      onDragStart={!printMode && onDragStart ? (e) => onDragStart(e, blockIndex) : undefined}
      onDragEnd={!printMode ? onDragEnd : undefined}
      onDragOver={!printMode ? onDragOver : undefined}
      onDragLeave={!printMode ? onDragLeave : undefined}
      onDrop={!printMode && onDrop ? (e) => onDrop(e, blockIndex) : undefined}
      onMouseDown={(e) => {
        if (printMode) return;
        const target = e.target as HTMLElement;
        if (target.closest('[contenteditable]') || target.closest('input') || target.closest('textarea')) {
          e.stopPropagation();
        }
      }}
    >
      <OptionBlockHeader
        block={block}
        selectDefinitions={selectDefinitions}
        onTitleUpdate={blockHandlers.handleTitleUpdate}
        onAddRow={blockHandlers.handleAddRow}
        onAddRowOfType={blockHandlers.handleAddRowOfType}
        readonly={readonly}
        printMode={printMode}
      />

      <OptionBlockContent
        block={block}
        selectDefinitions={selectDefinitions}
        onRowUpdate={blockHandlers.handleRowUpdate}
        onNoteUpdate={blockHandlers.handleNoteUpdate}
        onRemoveRow={blockHandlers.handleRemoveRow}
        onDragStart={dragHandlers.handleDragStart}
        onDragEnd={dragHandlers.handleDragEnd}
        onDragOver={dragHandlers.handleDragOver}
        onDragLeave={dragHandlers.handleDragLeave}
        onDrop={dragHandlers.handleDrop}
        readonly={readonly}
        printMode={printMode}
        onUpdateBlock={onUpdateBlock}
        blockColor={blockColor}
      />

      {!readonly && !printMode && showControls && allowWidthControl && (block.allowWidthControl !== false) && (
        <div className="print:tw-hidden">
          <ColumnControls
            columns={block.columns || 1}
            onChange={(columns) => onUpdateBlock({ ...block, columns })}
            color={blockColor}
            onColorChange={(color) => onUpdateBlock({ ...block, color })}
            onRemoveBlock={onRemove ? handleRemoveBlock : undefined}
            isDraggable={!!onDragStart}
          />
        </div>
      )}
    </div>
  );
};
