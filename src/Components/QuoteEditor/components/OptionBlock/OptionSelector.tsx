import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface OptionSelectorProps {
  options: string[];
  onSelect: (option: string) => void;
  className?: string;
  placeholder?: string;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  onSelect,
  className = '',
  placeholder = 'Autre valeur'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const calculateOptimalWidth = useCallback(() => {
    if (!options.length) return 200;

    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.style.whiteSpace = 'nowrap';
    tempElement.style.fontSize = '0.75rem';
    tempElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    tempElement.style.padding = '0 1rem';
    document.body.appendChild(tempElement);

    let maxWidth = 200;

    options.forEach(option => {
      tempElement.textContent = option;
      const width = tempElement.offsetWidth + 40;
      maxWidth = Math.max(maxWidth, width);
    });

    document.body.removeChild(tempElement);

    return Math.min(maxWidth, 400);
  }, [options]);

  const calculatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const optimalWidth = calculateOptimalWidth();

      setDropdownPosition({
        top: rect.bottom + scrollY + 2,
        left: rect.left + scrollX,
        width: optimalWidth
      });
    }
  }, [calculateOptimalWidth]);

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  }, [isOpen, calculatePosition]);

  const handleSelect = useCallback((option: string) => {
    onSelect(option);
    setIsOpen(false);
  }, [onSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const dropdown = document.getElementById('option-dropdown-portal');
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

    const handleResize = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
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
          'tw-inline-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-p-0 tw-border qe-border-primary/30 tw-rounded tw-bg-white qe-text-primary tw-cursor-pointer tw-transition-all tw-duration-200 tw-ease-out',
          'hover:qe-bg-primary/10 hover:qe-border-primary hover:tw-scale-105',
          isOpen && 'qe-bg-primary/10 qe-border-primary tw-scale-105',
          className
        )}
        title="Sélectionner une autre valeur"
      >
        <ChevronDown size={12} className={clsx('tw-transition-transform tw-duration-200', isOpen && 'tw-rotate-180')} />
      </button>

      {isOpen && createPortal(
        <div
          id="option-dropdown-portal"
          className="tw-animate-slide-down"
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 9999
          }}
        >
          <div className="tw-bg-white tw-border qe-border-primary/30 tw-rounded-md tw-shadow-lg tw-overflow-hidden tw-max-h-[300px] tw-overflow-y-auto">
            <div className="tw-p-1">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="tw-w-full tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-left tw-text-[0.75rem] tw-rounded tw-transition-all tw-duration-150 tw-cursor-pointer hover:qe-bg-primary/10 qe-text-text"
                  title={option}
                >
                  <span className="tw-flex-1 tw-truncate">{option}</span>
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
