import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { EditableField } from '../../EditableField/EditableField';
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
  return (
    <li
      className="tw-flex tw-items-center tw-gap-2 tw-p-2 tw-border tw-border-border tw-rounded tw-bg-white tw-transition-all tw-duration-200 hover:tw-bg-surface-gray-50"
      draggable={!readonly}
      onDragStart={(e) => onDragStart(e, noteIndex, 'note')}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, noteIndex, 'note')}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.editableField') || target.closest('input') || target.closest('textarea')) {
          e.stopPropagation();
        }
      }}
    >
      {!readonly && (
        <div className="tw-cursor-grab tw-text-text-muted hover:tw-text-primary active:tw-cursor-grabbing">
          <GripVertical size={12} />
        </div>
      )}

      <div className="tw-flex tw-items-center tw-gap-2 tw-flex-1">
        <span className="tw-text-text-muted tw-font-bold">•</span>

        <div className="tw-flex-1">
          <EditableField
            value={note.text}
            onSave={(value) => onNoteUpdate(noteIndex, 'text', value)}
            disabled={readonly}
            fullWidth={true}
            className={clsx(
              'tw-text-sm',
              note.style === 'bold' && 'tw-font-bold',
              note.style === 'italic' && 'tw-italic',
              note.style === 'heading' && 'tw-text-base tw-font-semibold',
              note.style === 'danger' && 'tw-text-danger tw-font-medium',
              note.style === 'success' && 'tw-text-success tw-font-medium',
              note.style === 'warning' && 'tw-text-warning tw-font-medium'
            )}
            onMouseDown={(e: React.MouseEvent) => {
              e.stopPropagation();
            }}
            onDragStart={(e: React.DragEvent) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
          />
        </div>
      </div>

      {!readonly && (
        <div className="tw-flex tw-items-center tw-gap-1.5">
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
