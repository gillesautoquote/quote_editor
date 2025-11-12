import React, { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';

interface EditableMarkdownFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  markdownToHtml: (text: string) => string;
  printMode?: boolean;
}

export const EditableMarkdownField: React.FC<EditableMarkdownFieldProps> = ({
  value,
  onSave,
  placeholder = "Cliquez pour éditer",
  className = '',
  disabled = false,
  markdownToHtml,
  printMode = false
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (printMode) {
    return (
      <div
        className={clsx(
          'print:tw-border-none print:tw-p-0 print:tw-bg-transparent print:tw-outline-none',
          'qe-text-text tw-w-full',
          className
        )}
      >
        {value ? (
          <div
            className="tw-text-[0.9rem] tw-leading-[1.4] [&_ul]:tw-pl-5 [&_ol]:tw-pl-5 [&_ul]:tw-my-0 [&_ol]:tw-my-0 [&_p]:tw-my-0"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
          />
        ) : (
          <span className="qe-text-text-muted">{placeholder}</span>
        )}
      </div>
    );
  }

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      adjustTextareaHeight();
    }
  }, [isEditing]);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (!disabled) {
      setIsEditing(true);
    }
  }, [disabled]);

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
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  const handleBlur = useCallback(() => {
    handleSave();
  }, [handleSave]);

  if (isEditing) {
    return (
      <div
        className={clsx(
          'tw-relative tw-rounded tw-transition-all tw-duration-200 tw-ease-out tw-cursor-text',
          'tw-outline tw-outline-1 tw-outline-primary tw-bg-white',
          'tw-w-full tw-max-w-full tw-block',
          className
        )}
      >
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={clsx(
            'tw-border-none tw-bg-transparent tw-p-0 tw-font-inherit tw-text-inherit',
            'tw-outline-none tw-resize-none tw-rounded-sm tw-leading-[1.4] tw-box-border tw-w-full tw-max-w-full',
            'focus:tw-bg-white focus:tw-shadow-[0_0_0_0.5px_var(--tw-shadow-color)] focus:tw-shadow-primary',
            'placeholder:qe-text-text-muted placeholder:tw-text-[0.9em]',
            'tw-min-h-[100px] tw-text-[0.9rem]'
          )}
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
        <div className="tw-text-xs qe-text-text-muted tw-mt-1 tw-px-1">
          Ctrl+Entrée pour sauvegarder, Échap pour annuler
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'tw-relative tw-rounded tw-min-h-[1.2em] qe-text-text tw-w-full',
        'tw-outline tw-outline-1 tw-outline-transparent',
        'tw-transition-colors tw-duration-150 tw-ease-in-out',
        !disabled && 'tw-cursor-pointer hover:qe-bg-primary/5 hover:tw-outline-primary hover:tw-outline-2',
        disabled && 'tw-cursor-default tw-opacity-100 !qe-text-text',
        className
      )}
      onDoubleClick={handleDoubleClick}
      title={disabled ? undefined : "Double-cliquez pour éditer"}
    >
      {value ? (
        <div
          className="tw-text-[0.9rem] tw-leading-[1.6] [&_ul]:tw-pl-5 [&_ol]:tw-pl-5 [&_ul]:tw-my-0 [&_ol]:tw-my-0 [&_p]:tw-my-0"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
        />
      ) : (
        <span className="qe-text-text-muted tw-italic">{placeholder}</span>
      )}
    </div>
  );
};
