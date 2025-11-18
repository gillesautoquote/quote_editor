import React from 'react';
import { EditableMarkdownField } from './EditableMarkdownField';
import { useEditingContext } from '../../contexts/EditingContext';

interface EditableMarkdownFieldWithContextProps {
  value: string;
  onSave: (value: string) => void;
  fieldPath: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  markdownToHtml: (text: string) => string;
  printMode?: boolean;
}

export const EditableMarkdownFieldWithContext: React.FC<EditableMarkdownFieldWithContextProps> = ({
  fieldPath,
  ...props
}) => {
  const { startEditing, stopEditing } = useEditingContext();

  const handleEditingStart = () => {
    startEditing(fieldPath, props.value);
  };

  const handleEditingStop = () => {
    stopEditing();
  };

  return (
    <EditableMarkdownField
      {...props}
      onEditingStart={handleEditingStart}
      onEditingStop={handleEditingStop}
    />
  );
};
