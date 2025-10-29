import React, { useState, useMemo } from 'react';
import { MapPin, Clock, Filter, Trash2, Plus } from 'lucide-react';
import type { TripProgramStep, TripProgramFilters } from '../../../QuoteEditor.types';
import { EditableField } from '../../EditableField/EditableField';

interface TripProgramBlockProps {
  steps: TripProgramStep[];
  filters: TripProgramFilters;
  onUpdateSteps: (steps: TripProgramStep[]) => void;
  onUpdateFilters: (filters: TripProgramFilters) => void;
  readonly?: boolean;
  printMode?: boolean;
  blockColor: string;
}

const STEP_FILTERS = [
  { id: 'depart' as const, label: 'Départs', keywords: ['départ', 'depart'] },
  { id: 'arrivee' as const, label: 'Arrivées', keywords: ['arrivée', 'arrivee'] },
  { id: 'mise_en_place' as const, label: 'Mise en place', keywords: ['mise en place'] },
  { id: 'retour' as const, label: 'Retours', keywords: ['retour'] },
];

const formatDateFr = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return date.toLocaleDateString('fr-FR', options);
};

export const TripProgramBlock: React.FC<TripProgramBlockProps> = ({
  steps,
  filters,
  onUpdateSteps,
  onUpdateFilters,
  readonly = false,
  printMode = false,
  blockColor
}) => {
  const filteredSteps = useMemo(() => {
    return steps.filter(step => {
      const labelLower = step.label.toLowerCase();

      if (filters.excludeDepot && (labelLower.includes('dépôt') || labelLower.includes('depot'))) {
        return false;
      }

      return STEP_FILTERS.some(filter => {
        if (!filters[filter.id]) return false;
        return filter.keywords.some(keyword => labelLower.includes(keyword));
      });
    });
  }, [steps, filters]);

  const groupedByDate = useMemo(() => {
    return filteredSteps.reduce((acc, step) => {
      if (!acc[step.date]) {
        acc[step.date] = [];
      }
      acc[step.date].push(step);
      return acc;
    }, {} as Record<string, TripProgramStep[]>);
  }, [filteredSteps]);

  const toggleFilter = (filterId: keyof TripProgramFilters) => {
    if (readonly) return;
    onUpdateFilters({
      ...filters,
      [filterId]: !filters[filterId]
    });
  };

  const handleStepUpdate = (stepId: string, field: keyof TripProgramStep, value: string) => {
    if (readonly) return;
    const newSteps = steps.map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    );
    onUpdateSteps(newSteps);
  };

  const handleRemoveStep = (stepId: string) => {
    if (readonly) return;
    const newSteps = steps.filter(step => step.id !== stepId);
    onUpdateSteps(newSteps);
  };

  const handleAddStep = () => {
    if (readonly) return;
    const newStep: TripProgramStep = {
      id: `step-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      city: 'Nouvelle ville',
      address: '',
      label: 'Nouvelle étape'
    };
    onUpdateSteps([...steps, newStep]);
  };

  return (
    <div className="tw-p-4 print:tw-p-2" data-component="trip-program">
      <div className={`tw-mb-3 tw-flex tw-flex-wrap tw-gap-2 tw-items-center ${printMode ? 'tw-hidden' : ''} print:tw-hidden`}>
        <div className="tw-flex tw-items-center tw-gap-1.5 tw-text-xs tw-text-gray-600">
          <Filter size={14} />
          <span className="tw-font-medium">Filtres:</span>
        </div>

        {STEP_FILTERS.map(filter => (
          <button
            key={filter.id}
            type="button"
            onClick={() => toggleFilter(filter.id)}
            disabled={readonly}
            className="tw-px-3 tw-py-1 tw-text-xs tw-rounded-full tw-border tw-transition-all"
            style={{
              backgroundColor: filters[filter.id] ? blockColor : 'white',
              color: filters[filter.id] ? 'white' : '#6b7280',
              borderColor: filters[filter.id] ? blockColor : '#d1d5db',
              cursor: readonly ? 'default' : 'pointer'
            }}
          >
            {filter.label}
          </button>
        ))}

        <div className="tw-h-4 tw-w-px tw-bg-gray-300 tw-mx-1" />

        <button
          type="button"
          onClick={() => toggleFilter('excludeDepot')}
          disabled={readonly}
          className="tw-px-3 tw-py-1 tw-text-xs tw-rounded-full tw-border tw-transition-all"
          style={{
            backgroundColor: filters.excludeDepot ? '#f3f4f6' : 'white',
            color: filters.excludeDepot ? '#374151' : '#6b7280',
            borderColor: '#d1d5db',
            cursor: readonly ? 'default' : 'pointer'
          }}
        >
          {filters.excludeDepot ? 'Masquer dépôt' : 'Afficher dépôt'}
        </button>

        {!readonly && !printMode && (
          <>
            <div className="tw-h-4 tw-w-px tw-bg-gray-300 tw-mx-1" />
            <button
              type="button"
              onClick={handleAddStep}
              className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-text-xs tw-rounded-full tw-border tw-transition-all hover:tw-shadow-sm"
              style={{
                backgroundColor: 'white',
                color: blockColor,
                borderColor: blockColor
              }}
            >
              <Plus size={12} />
              Ajouter étape
            </button>
          </>
        )}
      </div>

      {Object.keys(groupedByDate).length === 0 ? (
        <div className="tw-bg-gray-50 tw-rounded-lg tw-border tw-border-gray-200 tw-p-6 tw-text-center tw-text-sm tw-text-gray-500">
          Aucune étape ne correspond aux filtres sélectionnés
        </div>
      ) : (
        <div className="tw-space-y-4">
          {Object.entries(groupedByDate).map(([date, dateSteps], dateIndex) => (
            <div
              key={dateIndex}
              className="tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-overflow-hidden page-break-inside-avoid print:tw-mb-2"
              data-print-group="trip-day"
              data-date={date}
            >
              <div
                className="tw-px-4 tw-py-2 tw-font-semibold tw-text-sm tw-capitalize print:tw-px-2 print:tw-py-1 print:tw-text-xs"
                style={{ backgroundColor: `${blockColor}15`, color: blockColor }}
              >
                {formatDateFr(date)}
              </div>

              <div className="tw-p-4 print:tw-p-2">
                <div className="tw-relative">
                  <div
                    className="tw-absolute tw-left-4 tw-top-0 tw-bottom-0 tw-w-0.5 print:tw-left-2"
                    style={{ backgroundColor: `${blockColor}30` }}
                  />

                  <div className="tw-space-y-4 print:tw-space-y-2">
                    {dateSteps.map((step, stepIndex) => (
                      <div
                        key={step.id}
                        className="tw-relative tw-pl-10 tw-group page-break-inside-avoid print:tw-pl-6"
                        data-print-group="trip-step"
                        data-step-id={step.id}
                      >
                        <div
                          className="tw-absolute tw-left-0 tw-top-1 tw-w-8 tw-h-8 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-shadow-sm print:tw-w-6 print:tw-h-6 print:tw-top-0"
                          style={{
                            backgroundColor: blockColor,
                            color: 'white'
                          }}
                        >
                          <Clock size={printMode ? 12 : 14} />
                        </div>

                        <div className="tw-bg-gray-50 tw-rounded-lg tw-p-3 tw-border tw-border-gray-200 print:tw-p-2 print:tw-text-xs">
                          <div className="tw-flex tw-items-start tw-justify-between tw-gap-2">
                            <div className="tw-flex-1 tw-space-y-2">
                              <div className="tw-flex tw-items-center tw-gap-3 tw-flex-wrap">
                                <EditableField
                                  value={step.time}
                                  onSave={(value) => handleStepUpdate(step.id, 'time', value)}
                                  disabled={readonly}
                                  className="tw-font-bold tw-text-sm"
                                  style={{ color: blockColor }}
                                />
                                <div className="tw-w-px tw-h-4 tw-bg-gray-300" />
                                <EditableField
                                  value={step.label}
                                  onSave={(value) => handleStepUpdate(step.id, 'label', value)}
                                  disabled={readonly}
                                  className="tw-text-sm tw-text-gray-700"
                                />
                              </div>

                              <div className="tw-flex tw-items-start tw-gap-2">
                                <MapPin size={14} className="tw-text-gray-400 tw-mt-0.5 tw-flex-shrink-0" />
                                <div className="tw-flex tw-flex-col tw-gap-1">
                                  <EditableField
                                    value={step.city}
                                    onSave={(value) => handleStepUpdate(step.id, 'city', value)}
                                    disabled={readonly}
                                    className="tw-text-sm tw-font-medium tw-text-gray-900"
                                  />
                                  {step.address && (
                                    <EditableField
                                      value={step.address}
                                      onSave={(value) => handleStepUpdate(step.id, 'address', value)}
                                      disabled={readonly}
                                      className="tw-text-xs tw-text-gray-500"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>

                            {!readonly && !printMode && (
                              <button
                                type="button"
                                onClick={() => handleRemoveStep(step.id)}
                                className="tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity tw-p-1 tw-rounded tw-text-red-500 hover:tw-bg-red-50"
                                title="Supprimer cette étape"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
