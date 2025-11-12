import React from 'react';
import { Bus, Cloud } from 'lucide-react';
import type { CarbonImpact as CarbonImpactType } from '../../entities/QuoteData';
import { EditableField } from '../EditableField/EditableField';

interface CarbonImpactProps {
  carbonImpact: CarbonImpactType;
  onUpdateCarbonImpact?: (carbonImpact: CarbonImpactType) => void;
  readonly?: boolean;
  printMode?: boolean;
}

export const CarbonImpact: React.FC<CarbonImpactProps> = ({
  carbonImpact,
  onUpdateCarbonImpact,
  readonly = false,
  printMode = false
}) => {
  const greenColor = '#00796b'; // Vert environnemental

  return (
    <div className="tw-mb-6 tw-flex tw-justify-center">
      <div
        className="tw-flex tw-flex-col tw-items-center tw-gap-3 tw-border-2 tw-rounded-xl tw-px-6 tw-py-4 tw-shadow-sm"
        style={{
          backgroundColor: '#e8f5f0',
          borderColor: '#b8dccf'
        }}
      >
        <h3
          className="tw-text-sm tw-font-semibold tw-flex tw-items-center tw-gap-2"
          style={{ color: greenColor }}
        >
          <svg className="tw-w-5 tw-h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2C8.5 2 5.5 4.5 5.5 7.5C5.5 11 12 17 12 17s6.5-6 6.5-9.5C18.5 4.5 15.5 2 12 2z"/>
          </svg>
          Impact environnemental du trajet
        </h3>

        <div className="tw-flex tw-items-center tw-gap-4">
          <div
            className="tw-flex tw-items-center tw-gap-3 tw-bg-white tw-rounded-lg tw-px-4 tw-py-3 tw-border"
            style={{ borderColor: '#b8dccf' }}
          >
            <Bus className="tw-w-7 tw-h-7" strokeWidth={2} style={{ color: greenColor }} />
            <div className="tw-flex tw-flex-col">
              <span
                className="tw-text-2xl tw-font-bold tw-leading-none"
                style={{ color: greenColor }}
              >
                {carbonImpact.equivalentKm}
              </span>
              <span className="tw-text-xs tw-text-gray-600 tw-font-medium tw-mt-0.5">
                kilomètres
              </span>
            </div>
          </div>

          <div className="tw-text-xl tw-font-bold" style={{ color: greenColor }}>=</div>

          <div
            className="tw-flex tw-items-center tw-gap-3 tw-bg-white tw-rounded-lg tw-px-4 tw-py-3 tw-border"
            style={{ borderColor: '#b8dccf' }}
          >
            <Cloud className="tw-w-7 tw-h-7" strokeWidth={2} style={{ color: greenColor }} />
            <div className="tw-flex tw-flex-col">
              <span
                className="tw-text-2xl tw-font-bold tw-leading-none"
                style={{ color: greenColor }}
              >
                {carbonImpact.co2Amount}
              </span>
              <span className="tw-text-xs tw-text-gray-600 tw-font-medium tw-mt-0.5">
                {carbonImpact.unit}
              </span>
            </div>
          </div>
        </div>

        {carbonImpact.description && (
          <div
            className="tw-mt-3 tw-pt-3 tw-border-t tw-w-full tw-flex tw-justify-center"
            style={{ borderColor: '#b8dccf' }}
          >
            <div className="tw-max-w-2xl tw-w-full">
              <EditableField
                value={carbonImpact.description}
                onSave={(value) =>
                  onUpdateCarbonImpact?.({ ...carbonImpact, description: value })
                }
                disabled={readonly}
                printMode={printMode}
                as="p"
                className="tw-text-xs tw-text-gray-700 tw-text-center tw-leading-relaxed"
                multiline
                fullWidth
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
