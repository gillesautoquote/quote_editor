import type { DaySchedule, TripProgramStep, TripProgramFilters } from '../entities/QuoteData';

export const convertItineraryToTripSteps = (itinerary: DaySchedule[]): TripProgramStep[] => {
  const steps: TripProgramStep[] = [];

  // Parcourir l'itin\u00e9raire dans l'ordre exact pour pr\u00e9server la s\u00e9quence du mock
  // Cela garantit que les incoh\u00e9rences temporelles (comme 00:21 sur jeudi au lieu de vendredi)
  // sont pr\u00e9serv\u00e9es telles quelles
  itinerary.forEach(day => {
    day.items.forEach(item => {
      if (item.type === 'etapesGroupees') {
        item.etapes.forEach(step => {
          if (step.type === 'etape') {
            steps.push({
              id: step.uuid || `step-${Date.now()}-${Math.random()}`,
              date: day.date,
              time: step.heure,
              city: item.adresse.ville || '',
              address: item.adresse.adresse || '',
              label: step.label || '',
              tripName: day.tripName
            });
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
