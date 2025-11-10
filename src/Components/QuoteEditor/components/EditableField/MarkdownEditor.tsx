import React, { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  printMode?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onSave,
  placeholder = "Cliquez pour éditer",
  className = '',
  disabled = false,
  printMode = false
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const markdownToHtml = (text: string): string => {
    if (!text) return '';

    let html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');

    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      if (match.includes('<li>')) {
        const firstItem = match.match(/^- /) || match.match(/^\d+\./);
        if (text.match(/^\d+\./m)) {
          return '<ol class="tw-list-decimal tw-pl-6 tw-my-1">' + match.replace(/^- /gm, '').replace(/^\d+\. /gm, '') + '</ol>';
        }
        return '<ul class="tw-list-disc tw-pl-6 tw-my-1">' + match.replace(/^- /gm, '') + '</ul>';
      }
      return match;
    });

    html = html.replace(/\n/g, '<br />');

    return html;
  };

  if (printMode) {
    return (
      <div
        className={clsx(
          'print:tw-border-none print:tw-p-0 print:tw-bg-transparent print:tw-outline-none',
          'tw-text-text tw-w-full',
          className
        )}
      >
        {value ? (
          <div
            className="tw-text-sm tw-leading-relaxed"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
          />
        ) : (
          <span className="tw-text-text-muted">{placeholder}</span>
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
    setTimeout(() => {
      handleSave();
    }, 200);
  }, [handleSave]);

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editValue.substring(start, end);
    const newText = editValue.substring(0, start) + before + selectedText + after + editValue.substring(end);

    setEditValue(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = start + before.length + selectedText.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
        adjustTextareaHeight();
      }
    }, 0);
  }, [editValue, adjustTextareaHeight]);

  const handleBold = useCallback(() => {
    insertMarkdown('**', '**');
  }, [insertMarkdown]);

  const handleItalic = useCallback(() => {
    insertMarkdown('*', '*');
  }, [insertMarkdown]);

  const handleBulletList = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const lineStart = editValue.lastIndexOf('\n', start - 1) + 1;
    const newText = editValue.substring(0, lineStart) + '- ' + editValue.substring(lineStart);

    setEditValue(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(start + 2, start + 2);
        textareaRef.current.focus();
        adjustTextareaHeight();
      }
    }, 0);
  }, [editValue, adjustTextareaHeight]);

  const handleNumberedList = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const lineStart = editValue.lastIndexOf('\n', start - 1) + 1;
    const newText = editValue.substring(0, lineStart) + '1. ' + editValue.substring(lineStart);

    setEditValue(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(start + 3, start + 3);
        textareaRef.current.focus();
        adjustTextareaHeight();
      }
    }, 0);
  }, [editValue, adjustTextareaHeight]);

  if (isEditing) {
    return (
      <div
        className={clsx(
          'tw-relative tw-rounded tw-transition-all tw-duration-200 tw-ease-out',
          'tw-border tw-border-primary tw-bg-white',
          'tw-w-full tw-max-w-full tw-block',
          className
        )}
      >
        <div className="tw-flex tw-gap-1 tw-p-2 tw-border-b tw-border-gray-200 tw-bg-gray-50">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleBold();
            }}
            className="tw-p-1.5 tw-rounded tw-transition-colors hover:tw-bg-gray-200 tw-text-gray-700"
            title="Gras (Ctrl+B)"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleItalic();
            }}
            className="tw-p-1.5 tw-rounded tw-transition-colors hover:tw-bg-gray-200 tw-text-gray-700"
            title="Italique (Ctrl+I)"
          >
            <Italic size={16} />
          </button>
          <div className="tw-w-px tw-bg-gray-300 tw-mx-1"></div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleBulletList();
            }}
            className="tw-p-1.5 tw-rounded tw-transition-colors hover:tw-bg-gray-200 tw-text-gray-700"
            title="Liste à puces"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleNumberedList();
            }}
            className="tw-p-1.5 tw-rounded tw-transition-colors hover:tw-bg-gray-200 tw-text-gray-700"
            title="Liste numérotée"
          >
            <ListOrdered size={16} />
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={clsx(
            'tw-border-none tw-bg-transparent tw-p-3 tw-font-inherit tw-text-inherit',
            'tw-outline-none tw-resize-none tw-leading-relaxed tw-box-border tw-w-full tw-max-w-full',
            'placeholder:tw-text-text-muted placeholder:tw-text-sm',
            'tw-min-h-[100px] tw-text-sm'
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
        <div className="tw-flex tw-justify-between tw-items-center tw-text-xs tw-text-text-muted tw-px-3 tw-py-2 tw-border-t tw-border-gray-200 tw-bg-gray-50">
          <span>Ctrl+Entrée pour sauvegarder, Échap pour annuler</span>
          <div className="tw-flex tw-gap-2">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              className="tw-px-2 tw-py-1 tw-rounded tw-text-gray-600 hover:tw-bg-gray-200 tw-transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="tw-px-2 tw-py-1 tw-rounded tw-bg-primary tw-text-white hover:tw-bg-primary-dark tw-transition-colors"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'tw-relative tw-rounded tw-min-h-[1.2em] tw-text-text tw-w-full',
        'tw-border tw-border-transparent',
        'tw-transition-colors tw-duration-150 tw-ease-in-out',
        !disabled && 'tw-cursor-pointer hover:tw-bg-primary/5 hover:tw-border-primary',
        disabled && 'tw-cursor-default tw-opacity-100 !tw-text-text',
        className
      )}
      onDoubleClick={handleDoubleClick}
      title={disabled ? undefined : "Double-cliquez pour éditer"}
    >
      {value ? (
        <div
          className="tw-text-sm tw-leading-relaxed"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
        />
      ) : (
        <span className="tw-text-text-muted tw-italic">{placeholder}</span>
      )}
    </div>
  );
};
