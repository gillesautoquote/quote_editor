import React from 'react';
import type { OptionBlock, NoteItem, OptionRow } from '../../entities/QuoteData';
import { EditableMarkdownField } from '../EditableField/EditableMarkdownField';

interface CompactConditionsProps {
  blocks: OptionBlock[];
  readonly?: boolean;
  onUpdateBlock?: (blockIndex: number, updatedBlock: OptionBlock) => void;
}

export const CompactConditions: React.FC<CompactConditionsProps> = ({
  blocks,
  readonly = false,
  onUpdateBlock
}) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="tw-space-y-3 print:tw-space-y-2">
      {blocks.map((block, blockIndex) => (
        <div key={block.id} className="tw-group">
          {block.showTitle !== false && (
            <h3 className="tw-text-base tw-font-semibold tw-mb-2 tw-text-gray-800 print:tw-text-sm print:tw-mb-1">
              {block.title}
            </h3>
          )}

          {block.type === 'notes' && block.notes && (
            <div className="tw-space-y-1.5 print:tw-space-y-1">
              {block.notes.map((note: NoteItem, noteIndex: number) => (
                <div
                  key={noteIndex}
                  className="tw-flex tw-items-start tw-gap-2 tw-text-sm tw-text-gray-700 print:tw-text-xs"
                >
                  <span className="tw-text-primary tw-font-bold tw-select-none tw-flex-shrink-0">•</span>
                  <div className="tw-flex-1 tw-leading-relaxed print:tw-leading-snug">
                    {readonly ? (
                      <div
                        className="tw-whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: note.text.replace(/\n/g, '<br />')
                        }}
                      />
                    ) : (
                      <EditableMarkdownField
                        value={note.text}
                        onChange={(value) => {
                          if (onUpdateBlock) {
                            const updatedNotes = [...(block.notes || [])];
                            updatedNotes[noteIndex] = { ...note, text: value };
                            onUpdateBlock(blockIndex, { ...block, notes: updatedNotes });
                          }
                        }}
                        placeholder="Note..."
                        className="tw-text-sm tw-text-gray-700 print:tw-text-xs"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {block.type === 'list' && block.rows && (
            <div className="tw-space-y-1.5 print:tw-space-y-1">
              {block.rows.map((row: OptionRow, rowIndex: number) => (
                <div
                  key={rowIndex}
                  className="tw-flex tw-items-start tw-gap-2 tw-text-sm tw-text-gray-700 print:tw-text-xs"
                >
                  <span className="tw-text-primary tw-font-bold tw-select-none tw-flex-shrink-0">•</span>
                  <div className="tw-flex-1 tw-leading-relaxed print:tw-leading-snug">
                    {readonly ? (
                      <div
                        className="tw-whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: row.label.replace(/\n/g, '<br />')
                        }}
                      />
                    ) : (
                      <EditableMarkdownField
                        value={row.label}
                        onChange={(value) => {
                          if (onUpdateBlock) {
                            const updatedRows = [...(block.rows || [])];
                            updatedRows[rowIndex] = { ...row, label: value };
                            onUpdateBlock(blockIndex, { ...block, rows: updatedRows });
                          }
                        }}
                        placeholder="Condition..."
                        className="tw-text-sm tw-text-gray-700 print:tw-text-xs"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
