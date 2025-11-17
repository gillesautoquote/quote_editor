import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { QuoteLine } from '../../../entities/QuoteData';

interface SectionActionsProps {
  onAddLine: () => void;
  onAddSimpleLine: (line: QuoteLine) => void;
  onAddMissionLine: (line: QuoteLine) => void;
  simplesLinesSelect?: QuoteLine[];
  missionsLines?: QuoteLine[];
  readonly?: boolean;
}

export const SectionActions: React.FC<SectionActionsProps> = ({
  onAddLine,
  onAddSimpleLine,
  onAddMissionLine,
  simplesLinesSelect,
  missionsLines,
  readonly = false
}) => {
  const [showSimpleDropdown, setShowSimpleDropdown] = useState(false);
  const [showMissionDropdown, setShowMissionDropdown] = useState(false);
  const missionDropdownRef = useRef<HTMLDivElement>(null);
  const simpleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (missionDropdownRef.current && !missionDropdownRef.current.contains(event.target as Node)) {
        setShowMissionDropdown(false);
      }
      if (simpleDropdownRef.current && !simpleDropdownRef.current.contains(event.target as Node)) {
        setShowSimpleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeMissionsLines = missionsLines || [];
  const safeSimplesLinesSelect = simplesLinesSelect || [];

  const handleMissionClick = (missionLine: QuoteLine) => {
    console.log('🚀 Ajout ligne mission:', missionLine);
    onAddMissionLine(missionLine);
    setShowMissionDropdown(false);
  };

  const handleSimpleClick = (simpleLine: QuoteLine) => {
    console.log('📝 Ajout ligne simple:', simpleLine);
    onAddSimpleLine(simpleLine);
    setShowSimpleDropdown(false);
  };

  const handleEmptyLineClick = () => {
    console.log('➕ Ajout ligne vide');
    onAddLine();
    setShowSimpleDropdown(false);
  };

  if (readonly) return null;

  return (
    <div className="tw-flex tw-gap-2">
      {safeMissionsLines.length > 0 && (
        <div className="tw-relative" ref={missionDropdownRef}>
          <button
            type="button"
            onClick={() => setShowMissionDropdown(!showMissionDropdown)}
            className="tw-inline-flex tw-items-center tw-gap-1 qe-btn-compact tw-font-medium qe-text-white qe-bg-primary qe-border qe-border-primary qe-rounded-sm tw-cursor-pointer tw-transition-all tw-duration-200 tw-whitespace-nowrap hover:tw-opacity-90 hover:tw-shadow-sm"
            title="Ajouter une ligne mission pré-définie"
          >
            <Plus size={11} />
            Ligne Mission
          </button>
          {showMissionDropdown && (
            <div
              className="tw-absolute tw-right-0 tw-top-full tw-mt-1 tw-min-w-[300px] tw-max-h-[200px] tw-overflow-y-auto tw-bg-white tw-border qe-border-border tw-rounded-md tw-shadow-lg tw-z-[1050]"
            >
              {safeMissionsLines.map((missionLine, index) => (
                <button
                  key={index}
                  type="button"
                  className="tw-w-full tw-px-3 tw-py-2 tw-text-left qe-button-text-base qe-text-text tw-transition-colors hover:qe-bg-surface-gray-50 tw-whitespace-nowrap tw-overflow-hidden tw-text-ellipsis"
                  onClick={() => handleMissionClick(missionLine)}
                  title={missionLine.description}
                >
                  🚀 {missionLine.description}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="tw-relative" ref={simpleDropdownRef}>
        <button
          type="button"
          onClick={() => setShowSimpleDropdown(!showSimpleDropdown)}
          className="tw-inline-flex tw-items-center tw-gap-1 qe-btn-compact tw-font-medium qe-text-white qe-bg-primary qe-border qe-border-primary qe-rounded-sm tw-cursor-pointer tw-transition-all tw-duration-200 tw-whitespace-nowrap hover:tw-opacity-90 hover:tw-shadow-sm"
          title="Ajouter une ligne"
        >
          <Plus size={6} />
          Ligne
        </button>
        {showSimpleDropdown && (
          <div
            className="tw-absolute tw-right-0 tw-top-full tw-mt-1 tw-min-w-[300px] tw-max-h-[200px] tw-overflow-y-auto tw-bg-white tw-border qe-border-border tw-rounded-md tw-shadow-lg tw-z-[1050]"
          >
            <button
              type="button"
              className="tw-w-full tw-px-3 tw-py-2 tw-text-left qe-button-text-base tw-font-bold qe-text-text qe-bg-surface-gray-50 tw-border-b qe-border-border tw-transition-colors hover:qe-bg-surface-gray-100"
              onClick={handleEmptyLineClick}
            >
              ➕ Ligne vide
            </button>

            {safeSimplesLinesSelect.map((simpleLine, index) => (
              <button
                key={index}
                type="button"
                className="tw-w-full tw-px-3 tw-py-2 tw-text-left qe-button-text-base qe-text-text tw-transition-colors hover:qe-bg-surface-gray-50 tw-whitespace-nowrap tw-overflow-hidden tw-text-ellipsis"
                onClick={() => handleSimpleClick(simpleLine)}
                title={simpleLine.description}
              >
                📝 {simpleLine.description}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
