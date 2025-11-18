import React from 'react';
import { EditableField } from './EditableField';
import { useEditingContext } from '../../contexts/EditingContext';

interface EditableFieldWithContextProps {
  value: string;
  onSave: (value: string) => void;
  fieldPath: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  disabled?: boolean;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  fullWidth?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
  printMode?: boolean;
}

export const EditableFieldWithContext: React.FC<EditableFieldWithContextProps> = ({
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
    <EditableField
      {...props}
      onEditingStart={handleEditingStart}
      onEditingStop={handleEditingStop}
    />
  );
};
