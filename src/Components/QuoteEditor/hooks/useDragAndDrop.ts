import { useCallback } from 'react';

export interface DragDropItem {
  index: number;
  type: string;
  data?: any;
}

export interface DragDropHandlers {
  handleDragStart: (e: React.DragEvent, index: number, type: string, data?: any) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, dropIndex: number, onReorder: (fromIndex: number, toIndex: number) => void) => void;
}

/**
 * Hook réutilisable pour la gestion du drag & drop
 */
export const useDragAndDrop = (enabled: boolean = true): DragDropHandlers => {
  const handleDragStart = useCallback((e: React.DragEvent, index: number, type: string, data?: any) => {
    if (!enabled) return;
    
    const dragData: DragDropItem = { index, type, data };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.currentTarget.classList.add('dragging');
  }, [enabled]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!enabled) return;
    e.preventDefault();
    e.currentTarget.classList.add('dragOver');
  }, [enabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragOver');
  }, []);

  const handleDrop = useCallback((
    e: React.DragEvent, 
    dropIndex: number, 
    onReorder: (fromIndex: number, toIndex: number) => void
  ) => {
    if (!enabled) return;
    
    e.preventDefault();
    e.currentTarget.classList.remove('dragOver');
    
    try {
      const dragData: DragDropItem = JSON.parse(e.dataTransfer.getData('text/plain'));
      const sourceIndex = dragData.index;
      
      if (sourceIndex !== dropIndex) {
        onReorder(sourceIndex, dropIndex);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [enabled]);

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};