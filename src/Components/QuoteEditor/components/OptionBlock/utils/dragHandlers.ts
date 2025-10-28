import type { OptionBlock } from '../../../entities/QuoteData';

export const createDragHandlers = (
  block: OptionBlock,
  blockIndex: number,
  onUpdateBlock: (block: OptionBlock) => void,
  readonly: boolean = false
) => {
  const handleDragStart = (e: React.DragEvent, index: number, type: 'row' | 'note'): void => {
    if (readonly) return;
    e.dataTransfer.setData('text/plain', JSON.stringify({ index, type, blockIndex }));
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent): void => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    e.currentTarget.classList.add('dragOver');
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.currentTarget.classList.remove('dragOver');
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number, type: 'row' | 'note'): void => {
    if (readonly) return;
    
    e.preventDefault();
    e.currentTarget.classList.remove('dragOver');
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (dragData.blockIndex !== blockIndex || dragData.type !== type) return;
      
      const sourceIndex = dragData.index;
      if (sourceIndex === dropIndex) return;
      
      if (type === 'row' && block.rows) {
        const newRows = [...block.rows];
        const [draggedItem] = newRows.splice(sourceIndex, 1);
        newRows.splice(dropIndex, 0, draggedItem);
        onUpdateBlock({ ...block, rows: newRows });
      } else if (type === 'note' && block.notes) {
        const newNotes = [...block.notes];
        const [draggedItem] = newNotes.splice(sourceIndex, 1);
        newNotes.splice(dropIndex, 0, draggedItem);
        onUpdateBlock({ ...block, notes: newNotes });
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};