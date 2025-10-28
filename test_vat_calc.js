// Test rapide du calcul de TVA
const lines = [
  { vatRate: 10, vatAmount: 380 },
  { vatRate: 10, vatAmount: 234 },
  { vatRate: 10, vatAmount: 12 },
  { vatRate: 10, vatAmount: 2 },
  { vatRate: 10, vatAmount: 240 },
  { vatRate: 10, vatAmount: 108 },
  { vatRate: 10, vatAmount: 12 },
  { vatRate: 10, vatAmount: 15 },
  { vatRate: 10, vatAmount: 24 },
  { vatRate: 20, vatAmount: 3.2 }
];

const vatByRate = new Map();
lines.forEach(line => {
  const rate = line.vatRate;
  const amount = line.vatAmount;
  const current = vatByRate.get(rate) || 0;
  vatByRate.set(rate, current + amount);
});

const result = Array.from(vatByRate.entries())
  .map(([rate, amount]) => ({ rate, amount }))
  .sort((a, b) => a.rate - b.rate);

console.log('VATBreakdown calculé:', JSON.stringify(result, null, 2));
console.log('Total TVA à 10%:', result.find(v => v.rate === 10)?.amount);
console.log('Total TVA à 20%:', result.find(v => v.rate === 20)?.amount);
