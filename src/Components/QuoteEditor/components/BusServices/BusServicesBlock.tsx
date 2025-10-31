import React from 'react';
import { Wifi, Plug, Wind, Droplet, Disc, Mic, Package, Utensils, Coffee, Bed, Truck, Accessibility } from 'lucide-react';
import type { BusServices, BusService } from '../../entities/QuoteData';

interface BusServicesBlockProps {
  busServices: BusServices;
  companyColor?: string;
  readonly?: boolean;
  onUpdateServices?: (services: BusServices) => void;
  showOnlyAvailable?: boolean;
}

const getServiceIcon = (iconType: BusService['icon']) => {
  const iconProps = { size: 18, strokeWidth: 1.5 };

  switch (iconType) {
    case 'wifi':
      return <Wifi {...iconProps} />;
    case 'plug':
      return <Plug {...iconProps} />;
    case 'ac':
      return <Wind {...iconProps} />;
    case 'wc':
      return <Droplet {...iconProps} />;
    case 'dvd':
      return <Disc {...iconProps} />;
    case 'microphone':
      return <Mic {...iconProps} />;
    case 'fridge':
      return <Package {...iconProps} />;
    case 'pmr':
      return <Utensils {...iconProps} />;
    case 'drinks':
      return <Coffee {...iconProps} />;
    case 'bed':
      return <Bed {...iconProps} />;
    case 'trailer':
      return <Truck {...iconProps} />;
    case 'wheelchair':
      return <Accessibility {...iconProps} />;
    default:
      return null;
  }
};

export const BusServicesBlock: React.FC<BusServicesBlockProps> = ({
  busServices,
  companyColor,
  readonly = false,
  onUpdateServices,
  showOnlyAvailable = false
}) => {
  const handleToggleService = (serviceId: string) => {
    if (readonly || !onUpdateServices) return;

    const updatedServices = {
      ...busServices,
      services: busServices.services.map(service =>
        service.id === serviceId
          ? { ...service, available: !service.available }
          : service
      )
    };

    onUpdateServices(updatedServices);
  };

  const displayedServices = showOnlyAvailable
    ? busServices.services.filter(service => service.available)
    : busServices.services;

  if (showOnlyAvailable && displayedServices.length === 0) {
    return null;
  }

  return (
    <div className="tw-mb-6">
      <h3
        className="tw-text-base tw-font-semibold tw-mb-3"
        style={{ color: companyColor }}
      >
        {busServices.title}
      </h3>

      <div className="tw-grid tw-grid-cols-4 md:tw-grid-cols-8 print:tw-grid-cols-8 tw-gap-2">
        {displayedServices.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => handleToggleService(service.id)}
            disabled={readonly}
            className={`tw-flex tw-flex-col tw-items-center tw-gap-1 tw-p-2 tw-rounded-md tw-border tw-transition-all tw-duration-200 ${
              readonly ? 'tw-cursor-default' : 'tw-cursor-pointer hover:tw-shadow-md'
            }`}
            style={{
              borderColor: service.available ? companyColor : '#e5e7eb',
              backgroundColor: service.available ? `${companyColor}10` : 'white',
              opacity: service.available ? 1 : 0.5
            }}
          >
            <div
              className="tw-flex tw-items-center tw-justify-center"
              style={{ color: service.available ? companyColor : '#9ca3af' }}
            >
              {getServiceIcon(service.icon)}
            </div>
            <span
              className="tw-text-[10px] tw-text-center tw-leading-tight"
              style={{
                color: service.available ? companyColor : '#6b7280',
                fontWeight: service.available ? 600 : 400
              }}
            >
              {service.label}
            </span>
          </button>
        ))}
      </div>

      {!readonly && (
        <p className="tw-text-xs tw-text-gray-500 tw-mt-3 tw-italic">
          Cliquez sur un service pour l'activer ou le désactiver
        </p>
      )}
    </div>
  );
};
