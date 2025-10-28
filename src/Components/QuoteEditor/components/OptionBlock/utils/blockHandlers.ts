import type { OptionBlock, OptionRow, NoteItem, SelectDefinition } from '../../../entities/QuoteData';

export const createBlockHandlers = (
  block: OptionBlock,
  onUpdateBlock: (block: OptionBlock) => void,
  selectDefinitions: Record<string, SelectDefinition>,
  readonly: boolean = false
) => {
  const handleTitleUpdate = (newTitle: string): void => {
    if (readonly) return;
    onUpdateBlock({ ...block, title: newTitle });
  };

  const handleRowUpdate = (rowIndex: number, field: keyof OptionRow, value: string): void => {
    if (readonly || !block.rows) return;
    
    const newRows = [...block.rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
    onUpdateBlock({ ...block, rows: newRows });
  };

  const handleNoteUpdate = (noteIndex: number, field: keyof NoteItem, value: string): void => {
    if (readonly || !block.notes) return;
    
    const newNotes = [...block.notes];
    newNotes[noteIndex] = { ...newNotes[noteIndex], [field]: value };
    onUpdateBlock({ ...block, notes: newNotes });
  };

  const handleAddRow = (): void => {
    if (readonly) return;
    
    if (block.type === 'list') {
      const newRow: OptionRow = {
        id: `row_${Date.now()}`,
        label: 'Nouvelle ligne',
        style: 'normal'
      };
      const newRows = [...(block.rows || []), newRow];
      onUpdateBlock({ ...block, rows: newRows });
    } else if (block.type === 'notes') {
      const newNotes = [...(block.notes || []), { text: 'Nouvelle note', style: 'normal' as any }];
      onUpdateBlock({ ...block, notes: newNotes });
    }
  };

  const handleAddRowOfType = (lineType: string): void => {
    if (readonly) return;
    
    const definition = selectDefinitions[lineType];
    if (!definition) return;
    
    if (block.type === 'list') {
      const newRow: OptionRow = {
        id: `row_${Date.now()}`,
        label: definition.values[0] || `Nouvelle ligne ${definition.title.toLowerCase()}`,
        type: lineType,
        style: 'normal'
      };
      const newRows = [...(block.rows || []), newRow];
      onUpdateBlock({ ...block, rows: newRows });
    }
  };

  const handleRemoveRow = (index: number): void => {
    if (readonly) return;
    
    if (block.type === 'list' && block.rows) {
      const newRows = block.rows.filter((_, i) => i !== index);
      onUpdateBlock({ ...block, rows: newRows });
    } else if (block.type === 'notes' && block.notes) {
      const newNotes = block.notes.filter((_, i) => i !== index);
      onUpdateBlock({ ...block, notes: newNotes });
    }
  };

  return {
    handleTitleUpdate,
    handleRowUpdate,
    handleNoteUpdate,
    handleAddRow,
    handleAddRowOfType,
    handleRemoveRow
  };
};