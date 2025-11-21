import React from 'react';

interface VATBreakdown {
  rate: number;
  amount: number;
}

interface QuotePageTotalsProps {
  totals: {
    ht: number;
    tva: number;
    ttc: number;
    vatBreakdown?: VATBreakdown[];
  };
  mainColor?: string;
  printMode?: boolean;
  showAmounts?: boolean;
}

export const QuotePageTotals: React.FC<QuotePageTotalsProps> = ({
  totals,
  mainColor = '#0066cc',
  printMode = false,
  showAmounts = true
}) => {
  const textColor = getContrastColor(mainColor);

  if (!showAmounts) {
    return null;
  }

  return (
    <div
      className="tw-mb-4 tw-flex tw-justify-end page-break-inside-avoid print-keep-together"
      data-component="totals-table"
    >
      <div className="tw-border qe-border-border tw-rounded-lg tw-overflow-hidden tw-bg-white tw-shadow-sm print:tw-shadow-none print:tw-rounded-none">
        <table className="tw-border-collapse tw-text-[0.85rem] tw-min-w-[280px] qe-text-text print-color-adjust print:tw-text-xs">
          <tbody>
            <tr className="tw-bg-white">
              <td className="tw-p-2 tw-border-b qe-border-border print:tw-p-1.5">
                <strong>Total HT</strong>
              </td>
              <td className="tw-p-2 tw-border-b qe-border-border tw-text-right print:tw-p-1.5">
                <strong>{totals.ht.toFixed(2)} €</strong>
              </td>
            </tr>
            {totals.vatBreakdown && totals.vatBreakdown.length > 0 && (
              <>
                {totals.vatBreakdown.filter(vat => vat.rate > 0).map((vat, index) => (
                  <tr key={index} className="tw-bg-white">
                    <td className="tw-p-2 tw-border-b qe-border-border tw-pl-8 print:tw-p-1.5 print:tw-pl-6">
                      dont TVA à {vat.rate} %
                    </td>
                    <td className="tw-p-2 tw-border-b qe-border-border tw-text-right print:tw-p-1.5">
                      {vat.amount.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </>
            )}
            {totals.tva > 0 && (
              <tr className="tw-bg-white">
                <td className="tw-p-2 tw-border-b qe-border-border print:tw-p-1.5">
                  <strong>Total TVA</strong>
                </td>
                <td className="tw-p-2 tw-border-b qe-border-border tw-text-right print:tw-p-1.5">
                  <strong>{totals.tva.toFixed(2)} €</strong>
                </td>
              </tr>
            )}
            <tr
              className="print-color-adjust"
              style={{ backgroundColor: mainColor, color: textColor }}
            >
              <td className="tw-p-2 print:tw-p-1.5">
                <strong>Total TTC</strong>
              </td>
              <td className="tw-p-2 tw-text-right print:tw-p-1.5">
                <strong>{totals.ttc.toFixed(2)} €</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

function getContrastColor(backgroundColor: string): 'white' | 'black' {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return 'white';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}