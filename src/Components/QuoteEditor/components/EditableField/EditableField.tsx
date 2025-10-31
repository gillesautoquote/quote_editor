import React, { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
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

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  placeholder = "Cliquez pour éditer",
  multiline = false,
  className = '',
  disabled = false,
  as: Component = 'span',
  fullWidth = false,
  onMouseDown,
  onDragStart,
  printMode = false
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  if (printMode) {
    return (
      <Component
        className={clsx(
          'print:tw-border-none print:tw-p-0 print:tw-bg-transparent print:tw-outline-none',
          'tw-text-text',
          fullWidth && 'tw-w-full tw-max-w-full tw-block',
          className
        )}
      >
        {value || placeholder}
      </Component>
    );
  }

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(() => {
    if (!disabled) {
      setIsEditing(true);
    }
  }, [disabled]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) {
      // Empêcher la propagation du drag quand on édite
      e.stopPropagation();
      return;
    }
    onMouseDown?.(e);
  }, [isEditing]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    // TOUJOURS empêcher le drag sur les champs éditables
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  const handleSave = useCallback(() => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  }, [editValue, value, onSave]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel, multiline]);

  const handleBlur = useCallback(() => {
    handleSave();
  }, [handleSave]);

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';

    return (
      <Component
        className={clsx(
          'tw-relative tw-rounded tw-transition-all tw-duration-200 tw-ease-out tw-cursor-text tw-min-h-[1.2em]',
          'tw-outline tw-outline-1 tw-outline-primary tw-bg-white',
          fullWidth ? 'tw-w-full tw-max-w-full tw-block' : 'tw-inline-block tw-min-w-[20px]',
          className
        )}
      >
        <InputComponent
          ref={inputRef as React.RefObject<HTMLInputElement | HTMLTextAreaElement>}
          type={multiline ? undefined : "text"}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          rows={multiline ? 4 : undefined}
          className={clsx(
            'tw-border-none tw-bg-transparent tw-p-2 tw-font-inherit tw-text-inherit',
            'tw-outline-none tw-rounded-sm tw-leading-[1.5] tw-box-border tw-w-full tw-max-w-full',
            'focus:tw-bg-white focus:tw-shadow-[0_0_0_0.5px_var(--tw-shadow-color)] focus:tw-shadow-primary',
            'placeholder:tw-text-text-muted placeholder:tw-text-[0.9em]',
            multiline && 'tw-resize-y tw-min-h-[80px]',
            fullWidth && 'tw-w-full tw-max-w-full'
          )}
          style={{ WebkitUserDrag: 'none', userSelect: 'text' }}
          placeholder={placeholder}
          draggable={false}
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
      </Component>
    );
  }

  return (
    <Component
      className={clsx(
        'tw-relative tw-rounded tw-min-h-[1.2em] tw-inline-block tw-min-w-[20px] tw-text-text',
        'tw-outline tw-outline-1 tw-outline-transparent',
        'tw-transition-colors tw-duration-150 tw-ease-in-out',
        !disabled && 'tw-cursor-pointer hover:tw-bg-primary/5 hover:tw-outline-primary hover:tw-outline-2',
        disabled && 'tw-cursor-default tw-opacity-100 !tw-text-text',
        fullWidth && 'tw-w-full tw-max-w-full tw-block',
        className
      )}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onDragStart={handleDragStart}
      draggable={isEditing ? false : undefined}
      title={disabled ? undefined : "Double-cliquez pour éditer"}
    >
      {value || <span className="tw-text-text-muted tw-italic">{placeholder}</span>}
    </Component>
  );
};