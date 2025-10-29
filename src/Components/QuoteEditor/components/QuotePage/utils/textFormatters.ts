export const formatCopyright = (companyName: string): string => {
  const currentYear = new Date().getFullYear();
  return `© ${currentYear} ${companyName}. Tous droits réservés.`;
};

export const formatUrl = (url: string): string => {
  if (!url) return '';

  let formattedUrl = url.trim();

  if (formattedUrl.startsWith('http://')) {
    formattedUrl = formattedUrl.substring(7);
  } else if (formattedUrl.startsWith('https://')) {
    formattedUrl = formattedUrl.substring(8);
  }

  if (formattedUrl.startsWith('www.')) {
    formattedUrl = formattedUrl.substring(4);
  }

  return formattedUrl;
};
