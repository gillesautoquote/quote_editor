import { useCallback } from 'react';

export interface ListManagerHandlers<T> {
  addItem: (newItem: T) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updatedItem: T) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
}

/**
 * Hook réutilisable pour la gestion des listes (add/remove/update/reorder)
 */
export const useListManager = <T>(
  items: T[],
  onUpdate: (newItems: T[]) => void
): ListManagerHandlers<T> => {
  const addItem = useCallback((newItem: T) => {
    const newItems = [...items, newItem];
    onUpdate(newItems);
  }, [items, onUpdate]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  }, [items, onUpdate]);

  const updateItem = useCallback((index: number, updatedItem: T) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onUpdate(newItems);
  }, [items, onUpdate]);

  const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [draggedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, draggedItem);
    onUpdate(newItems);
  }, [items, onUpdate]);

  return {
    addItem,
    removeItem,
    updateItem,
    reorderItems
  };
};