const mock = require('./src/Components/QuoteEditor/mocks/data.mock.json');

console.log('=== VÉRIFICATION DU MOCK ===\n');

// Calculer la TVA à partir des lignes
const vatByRate = new Map();
let totalVATFromLines = 0;

mock.sections.forEach((section, idx) => {
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
console.log('VATBreakdown dans le mock:', JSON.stringify(mock.totals.vatBreakdown, null, 2));
console.log('\nVATBreakdown calculé depuis les lignes:', JSON.stringify(calculatedBreakdown, null, 2));
console.log('\nTotal TVA dans mock.totals.tva:', mock.totals.tva);
console.log('Total TVA calculé depuis les lignes:', totalVATFromLines);
console.log('\nCorrespondance:', mock.totals.tva === totalVATFromLines ? '✅' : '❌');
