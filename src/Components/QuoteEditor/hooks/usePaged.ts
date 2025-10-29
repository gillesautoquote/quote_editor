import { useEffect, useState, useCallback } from 'react';

export interface PagedConfig {
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  runningHeaders?: boolean;
  runningFooters?: boolean;
  pageNumbering?: boolean;
  onPageCreated?: (pageNumber: number) => void;
  onComplete?: (totalPages: number) => void;
  onError?: (error: Error) => void;
}

export interface PagedResult {
  isReady: boolean;
  isPaginating: boolean;
  totalPages: number;
  error: Error | null;
  initializePaged: () => Promise<void>;
}

declare global {
  interface Window {
    PagedPolyfill?: {
      ready: Promise<void>;
      preview: (element?: HTMLElement) => Promise<void>;
    };
  }
}

export const usePaged = (config: PagedConfig = {}): PagedResult => {
  const [isReady, setIsReady] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const {
    marginTop = '2cm',
    marginBottom = '2cm',
    marginLeft = '1.5cm',
    marginRight = '1.5cm',
    runningHeaders = false,
    runningFooters = false,
    pageNumbering = true,
    onPageCreated,
    onComplete,
    onError
  } = config;

  const initializePaged = useCallback(async () => {
    setIsPaginating(true);
    setError(null);

    try {
      // Vérifier si Paged.js est chargé
      if (!window.PagedPolyfill) {
        throw new Error('Paged.js n\'est pas chargé. Assurez-vous que le script est inclus.');
      }

      // Injecter les styles de configuration
      const styleId = 'paged-config-styles';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;

      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      styleElement.textContent = `
        @page {
          size: A4 portrait;
          margin-top: ${marginTop};
          margin-bottom: ${marginBottom};
          margin-left: ${marginLeft};
          margin-right: ${marginRight};
        }

        ${pageNumbering ? `
          @page {
            @bottom-right {
              content: "Page " counter(page) " / " counter(pages);
              font-size: 9pt;
              color: #6c757d;
            }
          }

          @page :first {
            @bottom-right {
              content: none;
            }
          }
        ` : ''}

        ${runningHeaders ? `
          @page {
            @top-center {
              content: element(running-header);
            }
          }
        ` : ''}

        ${runningFooters ? `
          @page {
            @bottom-center {
              content: element(running-footer);
            }
          }
        ` : ''}
      `;

      // Attendre que Paged.js soit prêt
      await window.PagedPolyfill.ready;

      // Compter les pages créées
      const pages = document.querySelectorAll('.pagedjs_page');
      setTotalPages(pages.length);

      // Appeler les callbacks
      pages.forEach((_, index) => {
        onPageCreated?.(index + 1);
      });

      onComplete?.(pages.length);

      setIsReady(true);
      setIsPaginating(false);

      console.log(`✅ Paged.js: ${pages.length} pages créées`);

    } catch (err) {
      const error = err as Error;
      console.error('❌ Erreur Paged.js:', error);
      setError(error);
      setIsPaginating(false);
      onError?.(error);
    }
  }, [
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    runningHeaders,
    runningFooters,
    pageNumbering,
    onPageCreated,
    onComplete,
    onError
  ]);

  useEffect(() => {
    // Auto-initialiser si Paged.js est disponible
    if (window.PagedPolyfill && !isReady && !isPaginating) {
      initializePaged();
    }
  }, [initializePaged, isReady, isPaginating]);

  return {
    isReady,
    isPaginating,
    totalPages,
    error,
    initializePaged
  };
};
