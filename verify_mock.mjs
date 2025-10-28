import mockData from './src/Components/QuoteEditor/mocks/data.mock.json' assert { type: 'json' };

console.log('=== VÉRIFICATION DU MOCK ===\n');

const vatByRate = new Map();
let totalVATFromLines = 0;

mockData.sections.forEach((section, idx) => {
  console.log(`Section ${idx}: ${section.title}`);
  section.lines.forEach(line => {
    const rate = line.vatRate;
    const amount = line.vatAmount;
    const current = vatByRate.get(rate) || 0;
    vatByRate.set(rate, current + amount);
    totalVATFromLines += amount;
  });
});

const calculatedBreakdown = Array.from(vatByRate.entries())
  .map(([rate, amount]) => ({ rate, amount }))
  .sort((a, b) => a.rate - b.rate);

console.log('\n=== RÉSULTATS ===');
console.log('VATBreakdown dans le mock:', JSON.stringify(mockData.totals.vatBreakdown, null, 2));
console.log('\nVATBreakdown calculé depuis les lignes:', JSON.stringify(calculatedBreakdown, null, 2));
console.log('\nTotal TVA dans mock.totals.tva:', mockData.totals.tva);
console.log('Total TVA calculé depuis les lignes:', totalVATFromLines);
console.log('\nCorrespondance:', mockData.totals.tva === totalVATFromLines ? '✅' : '❌');
