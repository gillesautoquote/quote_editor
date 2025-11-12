import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface StyleSelectorProps {
  value: 'normal' | 'bold' | 'italic' | 'underline';
  onChange: (style: 'normal' | 'bold' | 'italic' | 'underline') => void;
  className?: string;
}

const STYLE_OPTIONS = [
  { value: 'normal', label: 'Normal', display: 'N', className: 'normal' },
  { value: 'bold', label: 'Gras', display: 'G', className: 'bold' },
  { value: 'italic', label: 'Italique', display: 'I', className: 'italic' },
  { value: 'underline', label: 'Souligné', display: 'S', className: 'underline' }
] as const;

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentStyle = STYLE_OPTIONS.find(option => option.value === value) || STYLE_OPTIONS[0];

  const calculatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      setDropdownPosition({
        top: rect.bottom + scrollY + 2,
        left: rect.left + scrollX
      });
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  }, [isOpen, calculatePosition]);

  const handleSelect = useCallback((styleValue: 'normal' | 'bold' | 'italic' | 'underline') => {
    onChange(styleValue);
    setIsOpen(false);
  }, [onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const dropdown = document.getElementById('style-dropdown-portal');
        if (!dropdown || !dropdown.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={clsx(
          'tw-inline-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-p-0 tw-border qe-border-primary/30 tw-rounded tw-bg-white qe-text-primary tw-text-[0.7rem] tw-font-medium tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-out',
          'hover:qe-bg-primary/10 hover:qe-border-primary hover:tw-scale-105',
          isOpen && 'qe-bg-primary/10 qe-border-primary tw-scale-105',
          currentStyle.className === 'bold' && 'tw-font-bold',
          currentStyle.className === 'italic' && 'tw-italic',
          currentStyle.className === 'underline' && 'tw-underline',
          className
        )}
        title={`Style actuel: ${currentStyle.label}`}
      >
        {currentStyle.display}
      </button>

      {isOpen && createPortal(
        <div
          id="style-dropdown-portal"
          className="tw-animate-slide-down"
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 9999
          }}
        >
          <div className="tw-bg-white tw-border qe-border-primary/30 tw-rounded-md tw-shadow-lg tw-overflow-hidden tw-min-w-[120px]">
            <div className="tw-p-1">
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={clsx(
                    'tw-w-full tw-flex tw-items-center tw-gap-2 tw-px-2 tw-py-1.5 tw-text-left tw-text-[0.75rem] tw-rounded tw-transition-all tw-duration-150 tw-cursor-pointer',
                    'hover:qe-bg-primary/10',
                    value === option.value && 'qe-bg-primary/20 qe-text-primary tw-font-medium',
                    option.className === 'bold' && '[&>span:first-child]:tw-font-bold',
                    option.className === 'italic' && '[&>span:first-child]:tw-italic',
                    option.className === 'underline' && '[&>span:first-child]:tw-underline'
                  )}
                  title={option.label}
                >
                  <span className="tw-inline-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-text-[0.7rem] tw-font-medium">{option.display}</span>
                  <span className="tw-flex-1">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
