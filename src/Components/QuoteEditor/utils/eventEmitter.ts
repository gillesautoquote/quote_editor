/**
 * Émetteur d'événements global simple pour la communication entre composants
 * VERSION STANDALONE pour QuoteEditor
 */

type EventCallback = (...args: any[]) => void;

class EventEmitter {
  private events: Map<string, EventCallback[]> = new Map();

  /**
   * S'abonner à un événement
   */
  on(eventName: string, callback: EventCallback): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName)!.push(callback);
  }

  /**
   * Se désabonner d'un événement
   */
  off(eventName: string, callback: EventCallback): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      // Nettoyer si plus de callbacks
      if (callbacks.length === 0) {
        this.events.delete(eventName);
      }
    }
  }

  /**
   * Émettre un événement
   */
  emit(eventName: string, ...args: any[]): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Erreur dans l'événement ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Se désabonner de tous les événements
   */
  removeAllListeners(eventName?: string): void {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}

// Instance globale unique
export const globalEventEmitter = new EventEmitter();

// Événements prédéfinis
export const EVENTS = {
  EXPORT_PDF: 'exportPdf',
  QUOTE_DATA_CHANGED: 'quoteDataChanged',
  SAVE_QUOTE: 'saveQuote'
} as const;