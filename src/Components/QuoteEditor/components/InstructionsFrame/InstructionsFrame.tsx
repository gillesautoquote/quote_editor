import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import type { SignatureFrame, SignatureLineItem, Recipient } from '../../entities/QuoteData';
import { EditableField } from '../EditableField/EditableField';
import { StyleSelector } from '../OptionBlock/StyleSelector';
import { useListManager } from '../../hooks/useListManager';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

interface InstructionsFrameProps {
  signatureFrame: SignatureFrame;
  onUpdateSignatureFrame: (frame: SignatureFrame) => void;
  recipient?: Recipient;
  onUpdateRecipient?: (recipient: Recipient) => void;
  readonly?: boolean;
}

export const InstructionsFrame: React.FC<InstructionsFrameProps> = ({
  signatureFrame,
  onUpdateSignatureFrame,
  recipient,
  onUpdateRecipient,
  readonly = false
}) => {
  const beforeLinesManager = useListManager(signatureFrame.beforeLines, (newLines) => {
    onUpdateSignatureFrame({ ...signatureFrame, beforeLines: newLines });
  });

  const afterLinesManager = useListManager(signatureFrame.afterLines, (newLines) => {
    onUpdateSignatureFrame({ ...signatureFrame, afterLines: newLines });
  });

  const handleBeforeLineUpdate = (index: number, field: keyof SignatureLineItem, value: string): void => {
    const newLines = [...signatureFrame.beforeLines];
    newLines[index] = { ...newLines[index], [field]: value };
    onUpdateSignatureFrame({ ...signatureFrame, beforeLines: newLines });
  };

  const handleAfterLineUpdate = (index: number, field: keyof SignatureLineItem, value: string): void => {
    const newLines = [...signatureFrame.afterLines];
    newLines[index] = { ...newLines[index], [field]: value };
    onUpdateSignatureFrame({ ...signatureFrame, afterLines: newLines });
  };

  const handleAddBeforeLine = (): void => {
    beforeLinesManager.addItem({ text: 'Nouvelle ligne', style: 'normal' });
  };

  const handleAddAfterLine = (): void => {
    afterLinesManager.addItem({ text: 'Nouvelle ligne', style: 'normal' });
  };

  const handleDragStart = (e: React.DragEvent, index: number, type: 'before' | 'after'): void => {
    if (readonly) return;
    e.dataTransfer.setData('text/plain', JSON.stringify({ index, type }));
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

  const handleDrop = (e: React.DragEvent, dropIndex: number, type: 'before' | 'after'): void => {
    if (readonly) return;

    e.preventDefault();
    e.currentTarget.classList.remove('dragOver');

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (dragData.type !== type) return;

      const sourceIndex = dragData.index;
      if (sourceIndex === dropIndex) return;

      if (type === 'before') {
        beforeLinesManager.reorderItems(sourceIndex, dropIndex);
      } else {
        afterLinesManager.reorderItems(sourceIndex, dropIndex);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div className="tw-w-full tw-min-h-[100px] tw-flex tw-flex-col tw-gap-4 tw-mb-4">
      {/* 1. Informations client */}
      {recipient && (
        <div className="tw-w-full">
          <div className="tw-grid tw-grid-cols-2 tw-gap-x-8 tw-gap-y-2 tw-text-[0.85rem]">
            <div className="tw-flex tw-gap-2">
              <span className="tw-font-medium">Nom du client :</span>
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300">
                <EditableField
                  value={recipient.organization || ''}
                  onSave={(value) => onUpdateRecipient?.({ ...recipient, organization: value })}
                  disabled={readonly}
                  placeholder="Nom du client"
                  className="tw-text-[0.85rem]"
                />
              </span>
            </div>
            <div className="tw-flex tw-gap-2">
              <span className="tw-font-medium">Code client :</span>
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300">
                <EditableField
                  value={recipient.clientReference || ''}
                  onSave={(value) => onUpdateRecipient?.({ ...recipient, clientReference: value })}
                  disabled={readonly}
                  placeholder="Code client"
                  className="tw-text-[0.85rem]"
                />
              </span>
            </div>
            <div className="tw-flex tw-gap-2 tw-col-span-2">
              <span className="tw-font-medium">Nom du responsable (lors du voyage) :</span>
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300">
                <EditableField
                  value={recipient.fullName || ''}
                  onSave={(value) => onUpdateRecipient?.({ ...recipient, fullName: value })}
                  disabled={readonly}
                  placeholder="Nom du responsable"
                  className="tw-text-[0.85rem]"
                />
              </span>
            </div>
            <div className="tw-flex tw-gap-2">
              <span className="tw-font-medium">Tél. portable :</span>
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300">
                <EditableField
                  value={recipient.phone || ''}
                  onSave={(value) => onUpdateRecipient?.({ ...recipient, phone: value })}
                  disabled={readonly}
                  placeholder="Téléphone"
                  className="tw-text-[0.85rem]"
                />
              </span>
            </div>
            <div className="tw-flex tw-gap-2">
              <span className="tw-font-medium">Mail :</span>
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300">
                <EditableField
                  value={recipient.email || ''}
                  onSave={(value) => onUpdateRecipient?.({ ...recipient, email: value })}
                  disabled={readonly}
                  placeholder="Email"
                  className="tw-text-[0.85rem]"
                />
              </span>
            </div>
            <div className="tw-flex tw-gap-2 tw-col-span-2">
              <span className="tw-font-medium">Adresse de facturation :</span>
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300">
                <EditableField
                  value={`${recipient.address || ''}${recipient.postalCode ? ', ' + recipient.postalCode : ''}${recipient.city ? ' ' + recipient.city : ''}`}
                  onSave={(value) => {
                    onUpdateRecipient?.({ ...recipient, address: value });
                  }}
                  disabled={readonly}
                  placeholder="Adresse complète"
                  className="tw-text-[0.85rem]"
                />
              </span>
            </div>
            <div className="tw-flex tw-gap-2 tw-col-span-2">
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300 tw-min-h-[1.5rem]"></span>
            </div>
            <div className="tw-flex tw-gap-2">
              <span className="tw-font-medium">SIRET :</span>
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300">
                <EditableField
                  value={signatureFrame.siret || ''}
                  onSave={(value) => onUpdateSignatureFrame({ ...signatureFrame, siret: value })}
                  disabled={readonly}
                  placeholder="SIRET"
                  className="tw-text-[0.85rem]"
                />
              </span>
            </div>
            <div className="tw-flex tw-gap-2">
              <span className="tw-font-medium">N° TVA intracommunautaire :</span>
              <span className="tw-flex-1 tw-border-b tw-border-dotted tw-border-gray-300">
                <EditableField
                  value={signatureFrame.intraCommunityVat || ''}
                  onSave={(value) => onUpdateSignatureFrame({ ...signatureFrame, intraCommunityVat: value })}
                  disabled={readonly}
                  placeholder="TVA"
                  className="tw-text-[0.85rem]"
                />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Acceptation du devis */}
      <div className="tw-w-full tw-mt-4">
        <div className="tw-text-[0.9rem] tw-font-normal">
          Acceptation du devis et des conditions générales de vente
        </div>
      </div>

      {/* 3. Cachet et signature */}
      <div className="tw-w-full">
        <div className="tw-text-[0.9rem] tw-font-bold">
          Cachet et signature avec la mention "lu et accepté"
        </div>
      </div>

      {/* 4. Encart de signature */}
      <div className="tw-w-full tw-border-2 tw-border-dashed tw-border-primary/30 tw-rounded tw-bg-primary/5">
        <div className="tw-h-32 tw-flex tw-items-center tw-justify-center tw-text-primary/40 tw-text-sm tw-font-medium"></div>
      </div>
    </div>
  );
};
