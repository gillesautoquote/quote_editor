import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Clock, Filter, Trash2, Plus } from 'lucide-react';
import type { TripProgramStep, TripProgramFilters } from '../../../QuoteEditor.types';
import { EditableField } from '../../EditableField/EditableField';
import { getLightVariant, getLighterColor } from '../../../utils/colorUtils';

interface TripProgramBlockProps {
  steps: TripProgramStep[];
  filters: TripProgramFilters;
  onUpdateSteps: (steps: TripProgramStep[]) => void;
  onUpdateFilters: (filters: TripProgramFilters) => void;
  readonly?: boolean;
  printMode?: boolean;
  blockColor: string;
  companyColor?: string;
}

const STEP_FILTERS = [
  { id: 'depart' as const, label: 'Départs', keywords: ['départ', 'depart'] },
  { id: 'arrivee' as const, label: 'Arrivées', keywords: ['arrivée', 'arrivee'] },
  { id: 'mise_en_place' as const, label: 'Mise en place', keywords: ['mise en place'] },
  { id: 'depotRoundTrips' as const, label: 'Allers/Retours dépôt', keywords: ['départ', 'depart', 'arrivée', 'arrivee', 'retour'], isDepotFilter: true },
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
  blockColor,
  companyColor
}) => {
  // Style d'impression : forcer un saut de page avant chaque nouvelle mission
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const styleId = 'qe-trip-program-mission-break-print-style';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @media print {
        .qe-new-mission-break {
          break-before: page !important;
          page-break-before: always !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);
  const filteredSteps = useMemo(() => {
    return steps.filter(step => {
      const labelLower = step.label.toLowerCase();
      const isDepotStep = labelLower.includes('dépôt') || labelLower.includes('depot');

      return STEP_FILTERS.some(filter => {
        if (!filters[filter.id]) return false;

        // Pour le filtre dépôt, vérifier que c'est un aller/retour ET qu'il contient "dépôt"
        if (filter.id === 'depotRoundTrips') {
          const hasDepart = labelLower.includes('départ') || labelLower.includes('depart');
          const hasArrivee = labelLower.includes('arrivée') || labelLower.includes('arrivee');
          const hasRetour = labelLower.includes('retour');
          return (hasDepart || hasArrivee || hasRetour) && isDepotStep;
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

    // Fonction pour regrouper les étapes au même endroit
    const mergeStepsAtSameLocation = (steps: TripProgramStep[]): TripProgramStep[] => {
      const merged: TripProgramStep[] = [];
      const locationMap = new Map<string, TripProgramStep[]>();

      // Grouper par localisation (ville + adresse normalisée)
      steps.forEach(step => {
        const locationKey = `${step.city.toLowerCase().trim()}_${(step.address || '').toLowerCase().trim()}`;
        if (!locationMap.has(locationKey)) {
          locationMap.set(locationKey, []);
        }
        locationMap.get(locationKey)!.push(step);
      });

      // Pour chaque localisation, fusionner si nécessaire
      locationMap.forEach(stepsAtLocation => {
        if (stepsAtLocation.length === 1) {
          merged.push(stepsAtLocation[0]);
        } else {
          // Trier par heure
          stepsAtLocation.sort((a, b) => a.time.localeCompare(b.time));

          // Identifier mise en place et départ
          const miseEnPlace = stepsAtLocation.find(s =>
            s.label.toLowerCase().includes('mise en place')
          );
          const depart = stepsAtLocation.find(s =>
            s.label.toLowerCase().includes('départ') &&
            !s.label.toLowerCase().includes('mise en place')
          );

          if (miseEnPlace && depart) {
            // Fusionner en une seule étape avec les deux horaires
            merged.push({
              ...miseEnPlace,
              time: `${miseEnPlace.time} - ${depart.time}`,
              label: `Mise en place / Départ`
            });
          } else {
            // Sinon garder toutes les étapes séparées
            merged.push(...stepsAtLocation);
          }
        }
      });

      return merged;
    };

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

    // Fusionner les étapes au même endroit pour chaque groupe de date
    Object.values(missions).forEach(dateGroups => {
      dateGroups.forEach(dateGroup => {
        dateGroup.steps = mergeStepsAtSameLocation(dateGroup.steps);
      });
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

  const handleTripNameUpdate = (oldTripName: string, newTripName: string) => {
    if (readonly) return;
    const newSteps = steps.map(step =>
      step.tripName === oldTripName ? { ...step, tripName: newTripName } : step
    );
    onUpdateSteps(newSteps);
  };

  return (
    <div className="tw-p-4 print:tw-p-2" data-component="trip-program">
      <div className={`tw-mb-3 tw-flex tw-flex-wrap tw-gap-2 tw-items-center ${printMode ? 'tw-hidden' : ''} print:tw-hidden`}>
        <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-600">
          <Filter size={16} />
          <span className="tw-font-medium">Filtres:</span>
        </div>

        {STEP_FILTERS.map(filter => (
          <button
            key={filter.id}
            type="button"
            onClick={() => toggleFilter(filter.id)}
            disabled={readonly}
            className="tw-inline-flex tw-items-center qe-btn-sm tw-font-medium tw-rounded-full tw-border tw-transition-all tw-whitespace-nowrap tw-px-4 tw-py-1.5"
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
          <div
            key={missionIndex}
            className={missionIndex > 0 ? 'qe-new-mission-break tw-space-y-4' : 'tw-space-y-4'}
          >
            {dateGroups[0]?.tripName && (
              <div className="tw-mb-3">
                <EditableField
                  value={dateGroups[0].tripName}
                  onSave={(value) => handleTripNameUpdate(dateGroups[0].tripName!, value)}
                  disabled={readonly}
                  as="h3"
                  className="tw-text-base tw-font-bold"
                  style={{ color: blockColor }}
                />
              </div>
            )}
              {dateGroups.map((dateGroup, dateIndex) => {
                // Toujours utiliser companyColor pour les en-têtes de jour (cohérence visuelle)
                const containerColor = companyColor || blockColor;
                return (
                <div
                  key={dateIndex}
                  className="tw-rounded-xl tw-overflow-hidden tw-border page-break-inside-avoid print:tw-mb-2 print:tw-rounded-lg"
                  style={{
                    borderColor: getLighterColor(containerColor, 0.7),
                    backgroundColor: 'white'
                  }}
                  data-print-group="trip-day"
                  data-date={dateGroup.date}
                >
                  <div
                    className="tw-px-4 tw-py-2.5 tw-font-semibold tw-text-base tw-capitalize print:tw-px-2 print:tw-py-1.5 print:tw-text-xs"
                    style={{
                      backgroundColor: getLighterColor(containerColor, 0.85),
                      color: containerColor
                    }}
                  >
                    {formatDateFr(dateGroup.date)}
                  </div>

                  <div className="tw-p-4 print:tw-p-2">
                    <div className="tw-relative">
                      {/* Ligne verticale continue derrière les icônes pour montrer le trajet */}
                      <div
                        className="tw-absolute tw-left-4 tw-top-0 tw-bottom-0 tw-w-0.5 print:tw-left-2 print:tw-w-[2px]"
                        style={{
                          backgroundColor: blockColor,
                          opacity: 0.5,
                          zIndex: 0
                        }}
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
                            color: 'white',
                            zIndex: 1
                          }}
                        >
                          <Clock size={printMode ? 12 : 14} />
                        </div>

                        <div className="tw-bg-white tw-rounded-lg tw-p-3 tw-border tw-border-gray-200 print:tw-p-2 print:tw-text-xs">
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
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
