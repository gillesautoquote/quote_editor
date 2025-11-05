import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { MarkdownEditor } from '../../EditableField/MarkdownEditor';
import { StyleSelector } from '../StyleSelector';
import type { NoteItem } from '../../../entities/QuoteData';
import clsx from 'clsx';

interface NoteRowProps {
  note: NoteItem;
  noteIndex: number;
  onNoteUpdate: (noteIndex: number, field: keyof NoteItem, value: string) => void;
  onRemoveRow: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number, type: 'row' | 'note') => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number, type: 'row' | 'note') => void;
  readonly?: boolean;
  printMode?: boolean;
}

export const NoteRow: React.FC<NoteRowProps> = ({
  note,
  noteIndex,
  onNoteUpdate,
  onRemoveRow,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  readonly = false,
  printMode = false,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragStartWrapper = (e: React.DragEvent): void => {
    if (readonly || printMode) return;
    e.stopPropagation();
    setIsDragging(true);
    onDragStart(e, noteIndex, 'note');
  };

  const handleDragEndWrapper = (e: React.DragEvent): void => {
    e.stopPropagation();
    setIsDragging(false);
    onDragEnd(e);
  };

  const handleDragOverWrapper = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeaveWrapper = (e: React.DragEvent): void => {
    e.stopPropagation();
    setIsDragOver(false);
    onDragLeave(e);
  };

  const handleDropWrapper = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(e, noteIndex, 'note');
  };

  return (
    <li
      className={`tw-flex tw-items-center tw-gap-2 page-break-inside-avoid ${
        printMode
          ? 'tw-p-0.5 tw-bg-transparent'
          : 'tw-p-2 tw-border tw-border-border tw-rounded tw-bg-white tw-transition-all tw-duration-200 hover:tw-bg-surface-gray-50'
      } ${isDragging ? 'tw-opacity-40 tw-scale-95' : ''} ${isDragOver ? 'tw-border-primary tw-border-2' : ''} print:tw-border-none print:tw-p-1 print:tw-py-0.5 print:tw-bg-transparent print:tw-rounded-none`}
      onDragOver={!printMode ? handleDragOverWrapper : undefined}
      onDragLeave={!printMode ? handleDragLeaveWrapper : undefined}
      onDrop={!printMode ? handleDropWrapper : undefined}
    >
      {!readonly && !printMode && (
        <div
          draggable={true}
          onDragStart={handleDragStartWrapper}
          onDragEnd={handleDragEndWrapper}
          className="tw-cursor-grab tw-text-text-muted hover:tw-text-primary active:tw-cursor-grabbing print:tw-hidden"
        >
          <GripVertical size={12} />
        </div>
      )}

      <div className="tw-flex tw-items-center tw-gap-2 tw-flex-1">
        <span className="tw-text-text-muted tw-font-bold">•</span>

        <div className="tw-flex-1">
          <MarkdownEditor
            value={note.text}
            onSave={(value) => onNoteUpdate(noteIndex, 'text', value)}
            disabled={readonly}
            printMode={printMode}
            fullWidth={true}
            className={clsx(
              printMode ? 'tw-text-xs' : 'tw-text-sm print:tw-text-xs',
              note.style === 'bold' && 'tw-font-bold',
              note.style === 'italic' && 'tw-italic',
              note.style === 'heading' && (printMode ? 'tw-text-sm tw-font-semibold' : 'tw-text-base tw-font-semibold print:tw-text-sm'),
              note.style === 'danger' && 'tw-text-danger tw-font-medium',
              note.style === 'success' && 'tw-text-success tw-font-medium',
              note.style === 'warning' && 'tw-text-warning tw-font-medium'
            )}
          />
        </div>
      </div>

      {!readonly && !printMode && (
        <div className="tw-flex tw-items-center tw-gap-1.5 print:tw-hidden">
          <StyleSelector
            value={note.style || 'normal'}
            onChange={(style) => onNoteUpdate(noteIndex, 'style', style)}
          />
          <button
            type="button"
            onClick={() => onRemoveRow(noteIndex)}
            className="tw-inline-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-p-0 tw-text-danger tw-transition-all tw-duration-200 hover:tw-text-danger-dark hover:tw-scale-110"
            title="Supprimer cette note"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </li>
  );
};
