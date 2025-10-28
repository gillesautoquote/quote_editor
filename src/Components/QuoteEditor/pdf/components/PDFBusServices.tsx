import React from 'react';
import { View, Text, Svg, Path } from '@react-pdf/renderer';
import type { BusServices } from '../../entities/QuoteData';

interface PDFBusServicesProps {
  busServices: BusServices;
  companyColor?: string;
}

const getServiceIcon = (iconType: string) => {
  switch (iconType) {
    case 'wifi':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'plug':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M12 2v4M8 6v4m8-4v4m-4 8v4m-5-5h10a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'ac':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'wc':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M12.56 6.6A9 9 0 1 1 2.23 10.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'dvd':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" stroke="currentColor" strokeWidth="2" fill="none" />
          <Path d="M12 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12z" stroke="currentColor" strokeWidth="2" fill="none" />
          <Path d="M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4z" fill="currentColor" />
        </Svg>
      );
    case 'microphone':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3m-4 0h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'fridge':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="m3.3 7 8.7 5 8.7-5M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'drinks':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M6 2h12v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'bed':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8V4M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'trailer':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 1 0 0 5zm13 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 1 0 0 5z" stroke="currentColor" strokeWidth="2" fill="none" />
        </Svg>
      );
    case 'wheelchair':
      return (
        <Svg width="18" height="18" viewBox="0 0 24 24">
          <Path d="M3 3h18v18H3zM9 10h1a1 1 0 0 1 1 1v2M9 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M3 14h.01M3 19h.01M21 3l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    default:
      return null;
  }
};

export const PDFBusServices: React.FC<PDFBusServicesProps> = ({
  busServices,
  companyColor = '#009955'
}) => {
  const availableServices = busServices.services.filter(s => s.available);

  if (availableServices.length === 0) return null;

  return (
    <View style={{ marginBottom: 16, marginTop: 12 }} wrap={false}>
      <Text style={{
        fontSize: 11,
        fontWeight: 'bold',
        color: companyColor,
        marginBottom: 10,
      }}>
        {busServices.title}
      </Text>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
      }}>
        {availableServices.map((service) => (
          <View
            key={service.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingVertical: 7,
              paddingHorizontal: 12,
              backgroundColor: 'white',
              border: `2px solid ${companyColor}`,
              borderRadius: 8,
            }}
          >
            <View style={{ color: companyColor }}>
              {getServiceIcon(service.icon)}
            </View>
            <Text style={{
              fontSize: 9,
              color: companyColor,
              fontWeight: 'bold',
            }}>
              {service.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
