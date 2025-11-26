import type { DaySchedule, TripProgramStep, TripProgramFilters } from '../entities/QuoteData';

export const convertItineraryToTripSteps = (itinerary: DaySchedule[]): TripProgramStep[] => {
  const steps: TripProgramStep[] = [];
  let stepIndex = 0;

  // Parcourir l'itin\u00e9raire dans l'ordre exact pour pr\u00e9server la s\u00e9quence du mock
  // Cela garantit que les incoh\u00e9rences temporelles (comme 00:21 sur jeudi au lieu de vendredi)
  // sont pr\u00e9serv\u00e9es telles quelles
  itinerary.forEach(day => {
    day.items.forEach(item => {
      if (item.type === 'etapesGroupees') {
        item.etapes.forEach(step => {
          if (step.type === 'etape') {
            // G\u00e9n\u00e9rer un ID unique en combinant UUID + index pour \u00e9viter les doublons
            const uniqueId = step.uuid ? `${step.uuid}-${stepIndex}` : `step-${stepIndex}`;
            steps.push({
              id: uniqueId,
              date: day.date,
              time: step.heure,
              city: item.adresse.ville || '',
              address: item.adresse.adresse || '',
              label: step.label || '',
              labelType: step.labelType,
              tripName: day.tripName
            });
            stepIndex++;
          }
        });
      }
    });
  });

  return steps;
};

export const createProgrammeVoyageBlock = (
  itinerary: DaySchedule[],
  companyColor?: string,
  defaultFilters?: TripProgramFilters,
  title?: string,
  id?: string
) => {
  const filters: TripProgramFilters = defaultFilters || {
    depart: true,
    arrivee: true,
    mise_en_place: true,
    depotRoundTrips: false
  };

  return {
    id: id || 'block-programme-voyage-auto',
    title: title || 'Programme de voyage',
    color: companyColor,
    columns: 1,
    showTitle: true,
    allowWidthControl: true,
    type: 'programme-voyage' as const,
    tripSteps: convertItineraryToTripSteps(itinerary),
    tripFilters: filters
  };
};
