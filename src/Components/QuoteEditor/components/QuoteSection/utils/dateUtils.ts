// Fonction pour formater les dates au format français DD/MM/YY
export const formatDateFrench = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2); // Format YY
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

// Fonction pour convertir le format français vers ISO
export const parseDateFrench = (frenchDate: string): string => {
  if (!frenchDate) return '';
  
  const match = frenchDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!match) return frenchDate;
  
  const [, day, month, year] = match;
  const fullYear = year.length === 2 ? `20${year}` : year;
  const isoDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  return isoDate;
};