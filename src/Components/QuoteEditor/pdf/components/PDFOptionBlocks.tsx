import React from 'react';
import { View, Text, Svg, Path } from '@react-pdf/renderer';
import { createOptionBlocksStyles } from '../styles/optionBlocksStyles';
import type { OptionBlock, SignatureFrame, Company, TripProgramStep, TripProgramFilters } from '../../entities/QuoteData';

const isGrayColor = (color: string): boolean => {
  const normalizedColor = color.toLowerCase();
  return normalizedColor === '#f8f9fa' ||
         normalizedColor === '#e9ecef' ||
         normalizedColor === '#dee2e6' ||
         normalizedColor === '#f5f5f5' ||
         normalizedColor === '#e5e7eb' ||
         normalizedColor === '#d1d5db';
};

const STEP_FILTERS = [
  { id: 'depart' as const, label: 'Départs', keywords: ['départ', 'depart'] },
  { id: 'arrivee' as const, label: 'Arrivées', keywords: ['arrivée', 'arrivee'] },
  { id: 'mise_en_place' as const, label: 'Mise en place', keywords: ['mise en place'] },
  { id: 'depotRoundTrips' as const, label: 'Allers/Retours dépôt', keywords: ['départ', 'depart', 'arrivée', 'arrivee', 'retour'], isDepotFilter: true },
];

const filterTripSteps = (steps: TripProgramStep[], filters: TripProgramFilters): TripProgramStep[] => {
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
};

interface PDFOptionBlocksProps {
  optionBlocks: OptionBlock[];
  signatureFrame: SignatureFrame;
  company: Company;
  neutralStyle?: boolean;
}

export const PDFOptionBlocks: React.FC<PDFOptionBlocksProps> = ({
  optionBlocks,
  signatureFrame,
  company,
  neutralStyle = false
}) => {
  const optionBlocksStyles = createOptionBlocksStyles(company);
  const GAP_SIZE = 8; // Gap en points - IDENTIQUE À L'ÉDITEUR

  const getBlockWidthPercent = (columns: number): number => {
    switch (columns) {
      case 2: return 33.333;
      case 3: return 50;
      case 4: return 66.667;
      case 6: return 100;
      default: return 50;
    }
  };

  const SIGNATURE_WIDTH = 50;

  const getTextStyle = (style: string) => {
    const baseStyle = optionBlocksStyles.itemText;

    switch (style) {
      case 'bold':
        return [baseStyle, optionBlocksStyles.boldText];
      case 'italic':
        return [baseStyle, optionBlocksStyles.italicText];
      case 'underline':
        return [baseStyle, optionBlocksStyles.underlineText];
      default:
        return baseStyle;
    }
  };

  const organizeBlocksInRows = () => {
    const rows: any[][] = [];
    let currentRow: any[] = [];
    let currentRowWidth = 0;

    optionBlocks.forEach((block) => {
      // Skip programme-voyage blocks as they will be rendered separately
      if (block.type === 'programme-voyage') {
        return;
      }

      const blockWidth = getBlockWidthPercent(block.columns || 3);

      if (currentRowWidth + blockWidth > 100 && currentRow.length > 0) {
        rows.push([...currentRow]);
        currentRow = [];
        currentRowWidth = 0;
      }

      currentRow.push({
        type: 'optionBlock',
        block,
        widthPercent: blockWidth
      });
      currentRowWidth += blockWidth;

      if (blockWidth === 100) {
        rows.push([...currentRow]);
        currentRow = [];
        currentRowWidth = 0;
      }
    });

    if (currentRowWidth + SIGNATURE_WIDTH <= 100) {
      currentRow.push({
        type: 'signatureFrame',
        widthPercent: SIGNATURE_WIDTH
      });
      currentRowWidth += SIGNATURE_WIDTH;
    } else {
      if (currentRow.length > 0) {
        rows.push([...currentRow]);
      }
      currentRow = [{
        type: 'signatureFrame',
        widthPercent: SIGNATURE_WIDTH
      }];
      currentRowWidth = SIGNATURE_WIDTH;
    }

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const blockRows = organizeBlocksInRows();

  // Get all programme-voyage blocks
  const programmeVoyageBlocks = optionBlocks.filter(block => block.type === 'programme-voyage');

  return (
    <View style={optionBlocksStyles.container}>
      {blockRows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={optionBlocksStyles.blocksRow}
          wrap={false}
          minPresenceAhead={50}
        >
          {row.map((item, itemIndex) => {
            const isLastInRow = itemIndex === row.length - 1;
            if (item.type === 'signatureFrame') {
              if (!signatureFrame) {
                return null;
              }
              return (
                <View
                  key="signature-frame"
                  style={[
                    optionBlocksStyles.signatureFrameContainer,
                    {
                      width: `${item.widthPercent}%`,
                      marginLeft: row.length === 1 ? 'auto' : 0,
                      marginRight: 0,
                      marginBottom: GAP_SIZE
                    }
                  ]}
                  wrap={false}
                >
                  {signatureFrame.beforeLines?.length > 0 && (
                    <View style={optionBlocksStyles.beforeSection}>
                      {signatureFrame.beforeLines.map((line, index) => (
                        <Text
                          key={index}
                          style={[
                            optionBlocksStyles.instructionLine,
                            ...(line.style === 'bold' ? [optionBlocksStyles.boldText] : []),
                            ...(line.style === 'italic' ? [optionBlocksStyles.italicText] : []),
                            ...(line.style === 'underline' ? [optionBlocksStyles.underlineText] : []),
                          ]}
                        >
                          {line.text}
                        </Text>
                      ))}
                    </View>
                  )}

                  <View style={optionBlocksStyles.signatureBox}>
                    <View style={optionBlocksStyles.signatureSpace} />
                  </View>

                  {signatureFrame.afterLines?.length > 0 && (
                    <View style={optionBlocksStyles.afterSection}>
                      {signatureFrame.afterLines.map((line, index) => (
                        <Text
                          key={index}
                          style={[
                            optionBlocksStyles.instructionLine,
                            ...(line.style === 'bold' ? [optionBlocksStyles.boldText] : []),
                            ...(line.style === 'italic' ? [optionBlocksStyles.italicText] : []),
                            ...(line.style === 'underline' ? [optionBlocksStyles.underlineText] : []),
                          ]}
                        >
                          {line.text}
                        </Text>
                      ))}
                    </View>
                  )}

                  <View style={optionBlocksStyles.fillSpace} />
                </View>
              );
            }

            const { block } = item;
            // En mode neutralStyle, on utilise UNIQUEMENT company.mainColor (pas block.color)
            const blockColor = neutralStyle
              ? (company.mainColor || '#0066cc')
              : (block.color || company.mainColor || '#0066cc');
            const isGray = neutralStyle ? false : isGrayColor(blockColor);
            return (
              <View
                key={block.id}
                style={{
                  ...optionBlocksStyles.blockContainer,
                  borderLeftColor: blockColor,
                  borderLeftWidth: neutralStyle ? 4 : 3,
                  width: `${item.widthPercent}%`,
                  marginRight: isLastInRow ? 0 : GAP_SIZE,
                  marginBottom: GAP_SIZE,
                  borderColor: neutralStyle ? '#e2e8f0' : '#e1e5e9',
                  boxShadow: neutralStyle ? '0 1px 2px rgba(0,0,0,0.05)' : undefined,
                }}
                wrap={block.type === 'programme-voyage'}
                minPresenceAhead={block.type === 'programme-voyage' ? 80 : 30}
              >
                {block.showTitle !== false && (
                  <View
                    style={[
                      optionBlocksStyles.blockHeader,
                      {
                        backgroundColor: neutralStyle ? `${blockColor}08` : (isGray ? '#f8f9fa' : `${blockColor}08`),
                        paddingVertical: neutralStyle ? 8 : 5,
                        paddingHorizontal: neutralStyle ? 10 : 5,
                      }
                    ]}
                    wrap={false}
                  >
                    <Text style={[
                      optionBlocksStyles.blockTitle,
                      {
                        color: neutralStyle ? blockColor : (isGray ? '#374151' : blockColor),
                        fontSize: neutralStyle ? 11 : 10,
                        fontWeight: neutralStyle ? 'semibold' : 'bold',
                        letterSpacing: neutralStyle ? 0.2 : 0,
                      }
                    ]}>
                      {block.title}
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    optionBlocksStyles.blockContent,
                    { padding: neutralStyle ? 10 : 6 }
                  ]}
                  wrap={block.type === 'programme-voyage'}
                >
                  {block.type === 'list' && block.rows?.map((row: any) => (
                    <View
                      key={row.id}
                      style={[
                        optionBlocksStyles.listItem,
                        { marginBottom: neutralStyle ? 4 : 2 }
                      ]}
                      wrap={false}
                    >
                      <Text style={[
                        optionBlocksStyles.bulletPoint,
                        {
                          color: neutralStyle ? blockColor : (isGray ? '#6b7280' : blockColor),
                          fontSize: neutralStyle ? 10 : 9,
                        }
                      ]}>•</Text>
                      <Text style={[
                        getTextStyle(row.style || 'normal'),
                        {
                          fontSize: neutralStyle ? 10 : 9,
                          color: '#334155',
                          lineHeight: neutralStyle ? 1.5 : 1.3,
                        }
                      ]}>
                        {row.label}
                      </Text>
                    </View>
                  ))}

                  {block.type === 'notes' && block.notes?.map((note: any, noteIndex: number) => (
                    <View
                      key={noteIndex}
                      style={[
                        optionBlocksStyles.listItem,
                        { marginBottom: neutralStyle ? 4 : 2 }
                      ]}
                      wrap={false}
                    >
                      <Text style={[
                        optionBlocksStyles.bulletPoint,
                        {
                          color: neutralStyle ? blockColor : (isGray ? '#6b7280' : blockColor),
                          fontSize: neutralStyle ? 10 : 9,
                        }
                      ]}>•</Text>
                      <Text style={[
                        getTextStyle(note.style || 'normal'),
                        {
                          fontSize: neutralStyle ? 10 : 9,
                          color: '#334155',
                          lineHeight: neutralStyle ? 1.5 : 1.3,
                        }
                      ]}>
                        {note.text}
                      </Text>
                    </View>
                  ))}

                </View>
              </View>
            );
          })}
        </View>
      ))}

      {/* Render programme-voyage blocks separately with individual date groups */}
      {programmeVoyageBlocks.map((block) => {
        const blockColor = neutralStyle
          ? (company.mainColor || '#0066cc')
          : (block.color || company.mainColor || '#0066cc');

        if (!block.tripSteps) return null;

        const filters = block.tripFilters || {
          depart: true,
          arrivee: true,
          mise_en_place: true,
          retour: false,
          excludeDepot: true
        };

        const filteredSteps = filterTripSteps(block.tripSteps, filters);
        const groupedByDate = filteredSteps.reduce((acc: any, step: any) => {
          if (!acc[step.date]) {
            acc[step.date] = [];
          }
          acc[step.date].push(step);
          return acc;
        }, {});

        const dateEntries = Object.entries(groupedByDate);

        return (
          <React.Fragment key={block.id}>
            {/* Titre "Programme de Voyage" - affiché une seule fois */}
            {block.showTitle !== false && (
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: blockColor,
                marginBottom: 12,
                marginTop: 8,
                letterSpacing: 0.3,
              }}>
                {block.title || 'Programme de Voyage'}
              </Text>
            )}

            {dateEntries.map(([date, steps]: [string, any]) => (
          <View
            key={`${block.id}-${date}`}
            style={{ marginBottom: 8 }}
            wrap={false}
            minPresenceAhead={60}
          >
            {/* En-tête de date */}
            <View
              style={{
                backgroundColor: `${blockColor}15`,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 3,
                marginBottom: 4
              }}
              wrap={false}
            >
              <Text style={{
                fontSize: 8.5,
                fontWeight: 'bold',
                color: blockColor,
                textTransform: 'capitalize'
              }}>
                {new Date(date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </View>

            {/* Conteneur avec ligne verticale continue */}
            <View style={{ position: 'relative', paddingLeft: 0 }}>
              {/* Ligne verticale continue derrière toutes les icônes pour montrer le trajet */}
              {steps.length > 1 && (
                <View style={{
                  position: 'absolute',
                  left: 12,
                  top: 12,
                  bottom: 0,
                  width: 2,
                  backgroundColor: `${blockColor}50`
                }} />
              )}
              {/* Liste des étapes */}
              {steps.map((step: any, stepIndex: number) => (
                <View
                  key={step.id}
                  style={{
                    flexDirection: 'row',
                    marginBottom: stepIndex < steps.length - 1 ? 5 : 0,
                    position: 'relative'
                  }}
                  wrap={false}
                >
                  {/* Icône ronde avec Clock */}
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: blockColor,
                    marginRight: 8,
                    flexShrink: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                  }}>
                    <Svg width="14" height="14" viewBox="0 0 1280 1280">
                      <Path
                        d="M6090 10754 c-528 -46 -902 -128 -1315 -291 -955 -376 -1830 -1187 -2301 -2133 -219 -441 -346 -879 -411 -1425 -25 -214 -25 -796 0 -1010 51 -425 134 -763 274 -1120 376 -955 1187 -1830 2133 -2301 441 -219 879 -346 1425 -411 214 -25 796 -25 1010 0 650 78 1191 257 1705 564 567 340 1104 859 1472 1424 378 579 579 1156 660 1894 20 186 17 770 -5 960 -50 423 -134 763 -274 1120 -376 955 -1187 1830 -2133 2301 -438 218 -882 346 -1415 409 -133 16 -708 29 -825 19z m-29 -1209 c-105 -214 -191 -398 -191 -410 0 -43 63 -330 74 -337 6 -4 55 -8 109 -8 l97 0 0 -1175 0 -1176 -140 -248 c-77 -136 -140 -256 -140 -267 0 -14 43 -46 155 -116 l154 -98 224 0 c160 0 226 3 235 12 9 9 12 92 12 313 l0 302 320 554 c176 305 325 555 330 557 5 2 46 -17 91 -42 45 -25 87 -46 93 -46 17 0 176 139 176 153 0 13 16 285 25 422 21 342 36 638 33 680 -2 37 -7 51 -20 53 -9 2 -232 -139 -496 -312 l-479 -316 -21 -107 c-15 -73 -19 -110 -12 -118 6 -7 46 -33 90 -59 44 -25 80 -50 80 -55 0 -7 -194 -346 -206 -360 -2 -2 -4 323 -4 722 l0 727 98 0 c53 0 102 4 108 8 11 7 74 294 74 337 0 12 -85 196 -190 408 -104 213 -190 388 -190 389 0 4 70 0 220 -13 381 -32 835 -155 1140 -309 59 -30 61 -32 47 -53 -83 -129 -289 -540 -281 -560 7 -17 304 -191 328 -191 23 -1 168 206 288 409 39 66 73 122 74 124 6 6 101 -60 198 -138 228 -182 442 -394 621 -616 76 -95 155 -204 155 -215 0 -3 -30 -23 -67 -44 -100 -57 -462 -299 -467 -312 -6 -15 174 -332 192 -339 7 -2 101 40 210 94 178 89 241 122 339 183 l32 19 31 -61 c117 -232 233 -603 279 -895 20 -126 41 -313 41 -361 l0 -24 -137 0 c-146 -1 -495 -24 -513 -35 -14 -8 -14 -382 0 -390 18 -11 367 -34 513 -35 l137 0 0 -24 c0 -48 -21 -235 -41 -361 -46 -291 -162 -663 -279 -894 l-30 -60 -87 51 c-130 76 -484 249 -501 246 -19 -4 -206 -323 -197 -337 11 -18 338 -236 443 -295 56 -32 102 -61 102 -65 0 -12 -76 -118 -155 -216 -176 -218 -388 -430 -610 -608 -89 -71 -195 -147 -205 -147 -4 0 -36 51 -72 113 -68 117 -271 422 -289 432 -12 8 -326 -174 -334 -193 -5 -14 161 -353 244 -495 28 -49 51 -90 51 -93 0 -7 -120 -64 -228 -109 -293 -120 -628 -201 -961 -235 -57 -5 -114 -10 -127 -10 l-24 0 0 138 c0 147 -24 494 -35 511 -9 15 -381 15 -390 0 -11 -17 -35 -364 -35 -511 l0 -138 -24 0 c-48 0 -235 21 -361 41 -291 46 -663 162 -894 279 l-60 30 67 118 c92 157 236 457 229 474 -7 19 -324 201 -337 193 -17 -10 -220 -316 -288 -432 -36 -62 -68 -113 -72 -113 -10 0 -116 76 -205 147 -222 178 -434 390 -610 608 -79 98 -155 204 -155 216 0 4 46 33 103 65 104 59 431 277 442 295 9 14 -178 333 -197 337 -17 3 -371 -170 -501 -246 l-87 -51 -30 60 c-117 231 -233 603 -279 894 -20 126 -41 313 -41 361 l0 24 133 0 c143 0 489 24 506 35 15 9 15 381 0 390 -17 11 -363 35 -506 35 l-133 0 0 24 c0 48 21 235 41 361 46 292 162 663 279 895 35 69 17 71 160 -14 47 -27 168 -90 270 -139 182 -88 185 -89 201 -68 36 44 181 312 176 325 -7 17 -296 212 -432 291 -55 32 -102 60 -104 61 -6 6 60 101 138 198 182 228 394 442 616 621 95 76 204 155 215 155 3 0 23 -30 44 -67 57 -100 299 -462 312 -467 15 -6 332 174 338 191 8 21 -198 431 -281 560 -14 21 -12 23 47 53 305 154 756 276 1140 310 128 11 213 16 218 14 2 -1 -83 -176 -187 -389z"
                        fill="white"
                        transform="scale(0.1, -0.1) translate(0, -12800)"
                      />
                    </Svg>
                  </View>

                  {/* Carte de contenu */}
                  <View style={{
                    flex: 1,
                    backgroundColor: '#f9fafb',
                    borderRadius: 4,
                    border: '1px solid #e5e7eb',
                    padding: 6
                  }}>
                    {/* Heure et label */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 3,
                      flexWrap: 'wrap'
                    }}>
                      <Text style={{
                        fontSize: 8,
                        fontWeight: 'bold',
                        color: blockColor,
                        marginRight: 5
                      }}>
                        {step.time}
                      </Text>
                      <View style={{
                        width: 1,
                        height: 8,
                        backgroundColor: '#d1d5db',
                        marginRight: 5
                      }} />
                      <Text style={{
                        fontSize: 8,
                        color: '#374151'
                      }}>
                        {step.label}
                      </Text>
                    </View>

                    {/* Lieu avec icône */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginTop: 1
                    }}>
                      <View style={{
                        width: 3,
                        height: 3,
                        borderRadius: 1.5,
                        backgroundColor: '#9ca3af',
                        marginTop: 3,
                        marginRight: 5,
                        flexShrink: 0
                      }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 8,
                          color: '#111827',
                          fontWeight: 'bold',
                          marginBottom: step.address ? 1 : 0
                        }}>
                          {step.city || ''}
                        </Text>
                        {step.address && (
                          <Text style={{
                            fontSize: 6.5,
                            color: '#6b7280'
                          }}>
                            {step.address}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
            ))}
          </React.Fragment>
        );
      })}
    </View>
  );
};