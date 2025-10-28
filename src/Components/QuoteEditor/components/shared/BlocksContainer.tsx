import React from 'react';
import { useState, useCallback, useRef } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { OptionBlock } from '../OptionBlock/OptionBlock';
import type { OptionBlock as OptionBlockType, SignatureFrame, SelectDefinition } from '../../entities/QuoteData';
import clsx from 'clsx';

interface DragState {
  isDragging: boolean;
  dragIndex: number | null;
  dropIndex: number | null;
  dropPosition: 'before' | 'after' | null;
}

interface BlocksContainerProps {
  optionBlocks: OptionBlockType[];
  signatureFrame: SignatureFrame;
  selectDefinitions: Record<string, SelectDefinition>;
  onUpdateOptionBlock: (blockIndex: number, updatedBlock: OptionBlockType) => void;
  onRemoveOptionBlock?: (blockIndex: number) => void;
  onReorderBlocks?: (newBlocks: OptionBlockType[]) => void;
  onUpdateSignatureFrame: (frame: SignatureFrame) => void;
  readonly?: boolean;
  showBlockControls?: boolean;
  allowWidthControl?: boolean;
  companyColor?: string;
}

export const BlocksContainer: React.FC<BlocksContainerProps> = ({
  optionBlocks,
  signatureFrame,
  selectDefinitions,
  onUpdateOptionBlock,
  onRemoveOptionBlock,
  onReorderBlocks,
  onUpdateSignatureFrame,
  readonly = false,
  showBlockControls = false,
  allowWidthControl = true,
  companyColor = '#009955'
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragIndex: null,
    dropIndex: null,
    dropPosition: null
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Protection contre les données vides
  if (!optionBlocks) {
    return <div>Chargement des blocs...</div>;
  }

  // Custom drag handlers pour les blocs
  const handleBlockDragStart = useCallback((e: React.DragEvent, blockIndex: number) => {
    if (readonly) return;
    
    setDragState({
      isDragging: true,
      dragIndex: blockIndex,
      dropIndex: null,
      dropPosition: null
    });
    
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      index: blockIndex, 
      type: 'optionBlock' 
    }));
    e.currentTarget.classList.add('dragging');
  }, [readonly]);

  const handleBlockDragEnd = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDragState({
      isDragging: false,
      dragIndex: null,
      dropIndex: null,
      dropPosition: null
    });
  }, []);

  const handleBlockDragOver = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!dragState.isDragging || dragState.dragIndex === null) return;
    
    // Calculer la position relative de la souris dans l'élément cible
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const elementWidth = rect.width;
    const elementHeight = rect.height;
    
    // Déterminer si on doit insérer avant ou après basé sur la position
    // Si on est dans la première moitié horizontale OU verticale, c'est "before"
    const isBeforeHorizontal = mouseX < elementWidth / 2;
    const isBeforeVertical = mouseY < elementHeight / 2;
    const position = (isBeforeHorizontal || isBeforeVertical) ? 'before' : 'after';
    
    setDragState(prev => ({
      ...prev,
      dropIndex: targetIndex,
      dropPosition: position
    }));
  }, [dragState.isDragging, dragState.dragIndex]);

  const handleBlockDragLeave = useCallback((e: React.DragEvent) => {
    // Ne pas réinitialiser immédiatement pour éviter le clignotement
  }, []);

  const handleBlockDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    if (readonly) return;
    
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (dragData.type !== 'optionBlock') return;
      
      const sourceIndex = dragData.index;
      let finalDropIndex = dropIndex;
      
      // Ajuster l'index de drop selon la position
      if (dragState.dropPosition === 'after') {
        finalDropIndex = dropIndex + 1;
      }
      
      // Ajuster si on déplace vers l'arrière
      if (sourceIndex < finalDropIndex) {
        finalDropIndex -= 1;
      }
      
      if (sourceIndex !== finalDropIndex) {
        handleBlockReorder(sourceIndex, finalDropIndex);
      }
    } catch (error) {
      console.error('Error handling block drop:', error);
    }
    
    setDragState({
      isDragging: false,
      dragIndex: null,
      dropIndex: null,
      dropPosition: null
    });
  }, [readonly, dragState.dropPosition]);

  const handleBlockReorder = (fromIndex: number, toIndex: number): void => {
    if (!onReorderBlocks) return;
    
    const newBlocks = [...optionBlocks];
    const [draggedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, draggedBlock);
    
    onReorderBlocks(newBlocks);
  };

  const handleBlockRemove = (blockIndex: number): void => {
    if (onRemoveOptionBlock) {
      onRemoveOptionBlock(blockIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      className="tw-relative tw-my-4"
    >
      {/* Option Blocks - Pleine largeur */}
      <div className={clsx(
        'tw-flex tw-flex-col tw-gap-4 tw-min-w-0',
        'md:tw-gap-3',
        '[&>*]:tw-flex-shrink-0'
      )}>
        {(optionBlocks || []).map((block, blockIndex) => (
          <React.Fragment key={block.id}>
            {/* Indicateur de drop AVANT le bloc */}
            {dragState.isDragging &&
             dragState.dropIndex === blockIndex &&
             dragState.dropPosition === 'before' && (
              <div className="tw-w-full tw-h-1.5 tw-flex tw-items-center tw-justify-center tw-my-1 tw-opacity-100 tw-transform tw-scale-100 tw-transition-all tw-duration-200 tw-ease-out tw-pointer-events-none tw-z-10 tw-relative">
                <div className="tw-h-1 tw-bg-primary tw-rounded tw-w-full tw-max-w-md tw-relative tw-shadow-primary-lg tw-animate-pulse-drop before:tw-content-[''] before:tw-absolute before:tw-top-[-4px] before:tw-left-[-6px] before:tw-w-3 before:tw-h-3 before:tw-bg-primary before:tw-rounded-full before:tw-shadow-primary-sm after:tw-content-[''] after:tw-absolute after:tw-top-[-4px] after:tw-right-[-6px] after:tw-w-3 after:tw-h-3 after:tw-bg-primary after:tw-rounded-full after:tw-shadow-primary-sm">
                  <span className="tw-absolute tw-top-[-18px] tw-left-1/2 tw--translate-x-1/2 tw-bg-primary tw-text-white tw-text-[0.6rem] tw-py-[3px] tw-px-2 tw-rounded-xl tw-whitespace-nowrap tw-font-medium tw-shadow-primary-md tw-z-[11]">Insérer ici</span>
                </div>
              </div>
            )}

            <OptionBlock
              block={block}
              blockIndex={blockIndex}
              selectDefinitions={selectDefinitions}
              onUpdateBlock={(updatedBlock) => onUpdateOptionBlock(blockIndex, updatedBlock)}
              readonly={readonly}
              showControls={showBlockControls}
              allowWidthControl={allowWidthControl}
              companyColor={companyColor}
              onDragStart={!readonly ? handleBlockDragStart : undefined}
              onDragEnd={!readonly ? handleBlockDragEnd : undefined}
              onDragOver={!readonly ? (e) => handleBlockDragOver(e, blockIndex) : undefined}
              onDragLeave={!readonly ? handleBlockDragLeave : undefined}
              onDrop={!readonly ? (e) => handleBlockDrop(e, blockIndex) : undefined}
              onRemove={!readonly && onRemoveOptionBlock ? () => handleBlockRemove(blockIndex) : undefined}
            />

            {/* Indicateur de drop APRÈS le bloc */}
            {dragState.isDragging &&
             dragState.dropIndex === blockIndex &&
             dragState.dropPosition === 'after' && (
              <div className="tw-w-full tw-h-1.5 tw-flex tw-items-center tw-justify-center tw-my-1 tw-opacity-100 tw-transform tw-scale-100 tw-transition-all tw-duration-200 tw-ease-out tw-pointer-events-none tw-z-10 tw-relative">
                <div className="tw-h-1 tw-bg-primary tw-rounded tw-w-full tw-max-w-md tw-relative tw-shadow-primary-lg tw-animate-pulse-drop before:tw-content-[''] before:tw-absolute before:tw-top-[-4px] before:tw-left-[-6px] before:tw-w-3 before:tw-h-3 before:tw-bg-primary before:tw-rounded-full before:tw-shadow-primary-sm after:tw-content-[''] after:tw-absolute after:tw-top-[-4px] after:tw-right-[-6px] after:tw-w-3 after:tw-h-3 after:tw-bg-primary after:tw-rounded-full after:tw-shadow-primary-sm">
                  <span className="tw-absolute tw-top-[-18px] tw-left-1/2 tw--translate-x-1/2 tw-bg-primary tw-text-white tw-text-[0.6rem] tw-py-[3px] tw-px-2 tw-rounded-xl tw-whitespace-nowrap tw-font-medium tw-shadow-primary-md tw-z-[11]">Insérer ici</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Indicateur de drop à la fin si on fait un drop après le dernier élément */}
        {dragState.isDragging &&
         dragState.dropIndex === optionBlocks.length - 1 &&
         dragState.dropPosition === 'after' && (
          <div className="tw-w-full tw-h-1.5 tw-flex tw-items-center tw-justify-center tw-my-1 tw-opacity-100 tw-transform tw-scale-100 tw-transition-all tw-duration-200 tw-ease-out tw-pointer-events-none tw-z-10 tw-relative">
            <div className="tw-h-1 tw-bg-primary tw-rounded tw-w-full tw-max-w-md tw-relative tw-shadow-primary-lg tw-animate-pulse-drop before:tw-content-[''] before:tw-absolute before:tw-top-[-4px] before:tw-left-[-6px] before:tw-w-3 before:tw-h-3 before:tw-bg-primary before:tw-rounded-full before:tw-shadow-primary-sm after:tw-content-[''] after:tw-absolute after:tw-top-[-4px] after:tw-right-[-6px] after:tw-w-3 after:tw-h-3 after:tw-bg-primary after:tw-rounded-full after:tw-shadow-primary-sm">
              <span className="tw-absolute tw-top-[-18px] tw-left-1/2 tw--translate-x-1/2 tw-bg-primary tw-text-white tw-text-[0.6rem] tw-py-[3px] tw-px-2 tw-rounded-xl tw-whitespace-nowrap tw-font-medium tw-shadow-primary-md tw-z-[11]">Insérer ici</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};