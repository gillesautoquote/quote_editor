import type { DaySchedule, TripProgramStep } from '../entities/QuoteData';

export const convertItineraryToTripSteps = (itinerary: DaySchedule[]): TripProgramStep[] => {
  const steps: TripProgramStep[] = [];

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
              label: step.label || ''
            });
          }
        });
      }
    });
  });

  return steps;
};

export const createProgrammeVoyageBlock = (itinerary: DaySchedule[], companyColor?: string) => {
  return {
    id: `block-programme-voyage-${Date.now()}`,
    title: 'Programme de voyage',
    color: companyColor,
    columns: 1,
    showTitle: true,
    allowWidthControl: true,
    type: 'programme-voyage' as const,
    tripSteps: convertItineraryToTripSteps(itinerary),
    tripFilters: {
      depart: true,
      arrivee: true,
      mise_en_place: true,
      retour: false,
      excludeDepot: true
    }
  };
};
