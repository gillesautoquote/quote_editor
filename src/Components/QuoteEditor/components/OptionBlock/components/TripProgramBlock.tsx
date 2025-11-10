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
  { id: 'depotRoundTrips' as const, label: 'Allers/Retours dépôt', keywords: ['retour'], isDepotFilter: true },
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
      const isDepotStep = labelLower.includes('dépôt') || labelLower.includes('depot');

      return STEP_FILTERS.some(filter => {
        if (!filters[filter.id]) return false;

        // Pour le filtre dépôt, vérifier que c'est un retour ET qu'il contient "dépôt"
        if (filter.id === 'depotRoundTrips') {
          const matchesKeywords = filter.keywords.some(keyword => labelLower.includes(keyword));
          return matchesKeywords && isDepotStep;
        }

        // Pour les autres filtres, exclure les étapes dépôt si le filtre dépôt n'est pas actif
        if (isDepotStep && !filters.depotRoundTrips) {
          return false;
        }

        return filter.keywords.some(keyword => labelLower.includes(keyword));
      });
    });
  }, [steps, filters]);

  const groupedByMission = useMemo(() => {
    const missions: Record<string, { tripName?: string; date: string; steps: TripProgramStep[] }[]> = {};

    filteredSteps.forEach(step => {
      const missionKey = step.tripName || 'default';

      if (!missions[missionKey]) {
        missions[missionKey] = [];
      }

      let dateGroup = missions[missionKey].find(g => g.date === step.date);
      if (!dateGroup) {
        dateGroup = { tripName: step.tripName, date: step.date, steps: [] };
        missions[missionKey].push(dateGroup);
      }

      dateGroup.steps.push(step);
    });

    return missions;
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

      </div>

      {Object.keys(groupedByMission).length === 0 ? (
        <div className="tw-bg-gray-50 tw-rounded-lg tw-border tw-border-gray-200 tw-p-6 tw-text-center tw-text-sm tw-text-gray-500">
          Aucune étape ne correspond aux filtres sélectionnés
        </div>
      ) : (
        <div className="tw-space-y-6">
          {Object.entries(groupedByMission).map(([missionKey, dateGroups], missionIndex) => (
            <div key={missionIndex} className="tw-space-y-4">
              {dateGroups[0]?.tripName && (
                <div className="tw-mb-3">
                  <h3 className="tw-text-base tw-font-bold" style={{ color: blockColor }}>
                    {dateGroups[0].tripName}
                  </h3>
                </div>
              )}
              {dateGroups.map((dateGroup, dateIndex) => (
                <div
                  key={dateIndex}
                  className="tw-bg-white tw-overflow-hidden page-break-inside-avoid print:tw-mb-2"
                  data-print-group="trip-day"
                  data-date={dateGroup.date}
                >
                  <div
                    className="tw-px-4 tw-py-2 tw-font-semibold tw-text-sm tw-capitalize print:tw-px-2 print:tw-py-1 print:tw-text-xs"
                    style={{ backgroundColor: `${blockColor}15`, color: blockColor }}
                  >
                    {formatDateFr(dateGroup.date)}
                  </div>

                  <div className="tw-p-4 print:tw-p-2">
                    <div className="tw-relative">
                      <div
                        className="tw-absolute tw-left-4 tw-top-0 tw-bottom-0 tw-w-0.5 print:tw-left-2"
                        style={{ backgroundColor: `${blockColor}30` }}
                      />

                      <div className="tw-space-y-4 print:tw-space-y-2">
                        {dateGroup.steps.map((step, stepIndex) => (
                      <div
                        key={step.id}
                        className="tw-relative tw-pl-10 tw-group page-break-inside-avoid print:tw-pl-6"
                        data-print-group="trip-step"
                        data-step-id={step.id}
                      >
                        <div
                          className="tw-absolute tw-left-0 tw-top-1 tw-w-8 tw-h-8 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-shadow-sm print:tw-w-6 print:tw-h-6 print:tw-top-0 print:tw-left-[-4px]"
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
          ))}
        </div>
      )}
    </div>
  );
};
