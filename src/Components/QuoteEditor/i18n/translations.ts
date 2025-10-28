export const translations = {
  fr: {
    toolbar: {
      title: 'Éditeur de Devis',
      readonly: 'Lecture seule',
      save: 'Enregistrer',
      undo: 'Annuler',
      redo: 'Rétablir',
      exportPDF: 'Exporter PDF',
      addSection: 'Ajouter un tableau',
      addBlock: 'Ajouter une liste',
      reset: 'Réinitialiser',
      selectTemplate: 'Sélectionner un modèle',
    },
    saveStates: {
      saving: 'Sauvegarde...',
      saved: 'Sauvegardé',
      unsaved: 'Non sauvegardé',
    },
    errors: {
      noData: 'Aucune donnée fournie',
      invalidData: 'Données invalides',
      loadError: 'Erreur de chargement',
      saveError: 'Erreur lors de la sauvegarde',
      exportError: 'Erreur lors de l\'export',
    },
    common: {
      loading: 'Chargement...',
      confirm: 'Êtes-vous sûr ?',
      cancel: 'Annuler',
      ok: 'OK',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
    },
    quote: {
      number: 'Devis n°',
      version: 'Version',
      date: 'Date',
      validUntil: 'Valable jusqu\'au',
      reference: 'Référence',
    },
    table: {
      date: 'Date',
      description: 'Description',
      duration: 'Durée',
      pax: 'Pax',
      unitPrice: 'P. U.',
      quantity: 'Qté',
      priceHT: 'HT',
      vatRate: 'TVA',
      priceTTC: 'TTC',
      subtotal: 'Sous-total',
      total: 'Total',
    },
    actions: {
      addRow: 'Ajouter une ligne',
      deleteRow: 'Supprimer la ligne',
      moveUp: 'Déplacer vers le haut',
      moveDown: 'Déplacer vers le bas',
    },
    aria: {
      editableField: 'Champ éditable : {field}',
      button: 'Bouton : {action}',
      dropdown: 'Menu déroulant : {label}',
      dragHandle: 'Poignée de glissement',
    },
  },
  en: {
    toolbar: {
      title: 'Quote Editor',
      readonly: 'Read only',
      save: 'Save',
      undo: 'Undo',
      redo: 'Redo',
      exportPDF: 'Export PDF',
      addSection: 'Add table',
      addBlock: 'Add list',
      reset: 'Reset',
      selectTemplate: 'Select template',
    },
    saveStates: {
      saving: 'Saving...',
      saved: 'Saved',
      unsaved: 'Unsaved',
    },
    errors: {
      noData: 'No data provided',
      invalidData: 'Invalid data',
      loadError: 'Loading error',
      saveError: 'Save error',
      exportError: 'Export error',
    },
    common: {
      loading: 'Loading...',
      confirm: 'Are you sure?',
      cancel: 'Cancel',
      ok: 'OK',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
    },
    quote: {
      number: 'Quote #',
      version: 'Version',
      date: 'Date',
      validUntil: 'Valid until',
      reference: 'Reference',
    },
    table: {
      date: 'Date',
      description: 'Description',
      duration: 'Duration',
      pax: 'Pax',
      unitPrice: 'Unit Price',
      quantity: 'Qty',
      priceHT: 'Excl. VAT',
      vatRate: 'VAT',
      priceTTC: 'Incl. VAT',
      subtotal: 'Subtotal',
      total: 'Total',
    },
    actions: {
      addRow: 'Add row',
      deleteRow: 'Delete row',
      moveUp: 'Move up',
      moveDown: 'Move down',
    },
    aria: {
      editableField: 'Editable field: {field}',
      button: 'Button: {action}',
      dropdown: 'Dropdown: {label}',
      dragHandle: 'Drag handle',
    },
  },
};

export type Locale = 'fr' | 'en';
export type TranslationKeys = typeof translations.fr;

export function useTranslation(locale: Locale = 'fr') {
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) =>
          str.replace(`{${paramKey}}`, paramValue),
        value
      );
    }

    return value;
  };

  return { t, locale };
}
