import React from 'react';
import { OptionRow } from './OptionRow';
import { NoteRow } from './NoteRow';
import { TripProgramBlock } from './TripProgramBlock';
import type { OptionBlock, OptionRow as OptionRowType, NoteItem, SelectDefinition, TripProgramStep, TripProgramFilters } from '../../../entities/QuoteData';

interface OptionBlockContentProps {
  block: OptionBlock;
  selectDefinitions: Record<string, SelectDefinition>;
  onRowUpdate: (rowIndex: number, field: keyof OptionRowType, value: string) => void;
  onNoteUpdate: (noteIndex: number, field: keyof NoteItem, value: string) => void;
  onRemoveRow: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number, type: 'row' | 'note') => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number, type: 'row' | 'note') => void;
  readonly?: boolean;
  printMode?: boolean;
  onUpdateBlock?: (block: OptionBlock) => void;
  blockColor?: string;
}

export const OptionBlockContent: React.FC<OptionBlockContentProps> = ({
  block,
  selectDefinitions,
  onRowUpdate,
  onNoteUpdate,
  onRemoveRow,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  readonly = false,
  printMode = false,
  onUpdateBlock,
  blockColor = '#009955'
}) => {
  const handleUpdateTripSteps = (steps: TripProgramStep[]) => {
    if (onUpdateBlock) {
      onUpdateBlock({ ...block, tripSteps: steps });
    }
  };

  const handleUpdateTripFilters = (filters: TripProgramFilters) => {
    if (onUpdateBlock) {
      onUpdateBlock({ ...block, tripFilters: filters });
    }
  };

  return (
    <div className={block.type === 'programme-voyage' ? '' : 'tw-p-3 print:tw-p-0 print:tw-pt-1'}>
      {block.type === 'list' && block.rows && (
        <ul className="tw-list-none tw-m-0 tw-p-0 tw-space-y-2 print:tw-space-y-0.5">
          {block.rows.map((row, rowIndex) => (
            <OptionRow
              key={row.id}
              row={row}
              rowIndex={rowIndex}
              selectDefinitions={selectDefinitions}
              onRowUpdate={onRowUpdate}
              onRemoveRow={onRemoveRow}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              readonly={readonly}
              printMode={printMode}
            />
          ))}
        </ul>
      )}

      {block.type === 'notes' && block.notes && (
        <ul className="tw-list-none tw-m-0 tw-p-0 tw-space-y-2 print:tw-space-y-0.5">
          {block.notes.map((note, noteIndex) => (
            <NoteRow
              key={noteIndex}
              note={note}
              noteIndex={noteIndex}
              onNoteUpdate={onNoteUpdate}
              onRemoveRow={onRemoveRow}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              readonly={readonly}
              printMode={printMode}
            />
          ))}
        </ul>
      )}

      {block.type === 'programme-voyage' && (
        <TripProgramBlock
          steps={block.tripSteps || []}
          filters={block.tripFilters || {
            depart: true,
            arrivee: true,
            mise_en_place: true,
            retour: false,
            excludeDepot: true
          }}
          onUpdateSteps={handleUpdateTripSteps}
          onUpdateFilters={handleUpdateTripFilters}
          readonly={readonly}
          printMode={printMode}
          blockColor={blockColor}
        />
      )}
    </div>
  );
};
